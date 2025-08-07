const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const packageDefinition = protoLoader.loadSync(
    [
        path.join(__dirname, '../src/proto/messenger.proto'),
        path.join(__dirname, '../src/proto/hello.proto'),
    ]
);
const messengerProto = grpc.loadPackageDefinition(packageDefinition);

console.log('🔍 === gRPC SERVICES ANALYSIS ===');
console.log('�� Available packages:', Object.keys(messengerProto));

// Log chi tiết từng package và service
for (const packageName of Object.keys(messengerProto)) {
    console.log(`\n�� Package: ${packageName}`);
    const packageObj = messengerProto[packageName];

    // Lọc ra chỉ những service (function constructor)
    const services = Object.keys(packageObj).filter(key =>
        typeof packageObj[key] === 'function'
    );

    console.log(`  �� Services found: ${services.length}`);

    for (const serviceName of services) {
        console.log(`    �� Service: ${serviceName}`);
        const service = packageObj[serviceName];

        // Tạo instance để xem methods
        try {
            const client = new service('localhost:5002', grpc.credentials.createInsecure());
            const methods = Object.getOwnPropertyNames(client.__proto__);
            console.log(`      �� Methods:`, methods);
        } catch (error) {
            console.log(`      ❌ Error creating client:`, error.message);
        }
    }
}

console.log('\n🧪 === TESTING SERVICES ===');

// Test HelloService
if (messengerProto.messenger && messengerProto.messenger.HelloService) {
    console.log('\n🔧 Testing HelloService...');
    const helloClient = new messengerProto.messenger.HelloService(
        'localhost:5002',
        grpc.credentials.createInsecure()
    );

    helloClient.Hello({ name: 'John' }, (err, response) => {
        if (err) {
            console.error('❌ HelloService failed:', err.message);
        } else {
            console.log('✅ HelloService Response:', response);
        }
    });
}

// Test MessengerService
if (messengerProto.messenger && messengerProto.messenger.MessengerService) {
    console.log('\n🔧 Testing MessengerService...');
    const messengerClient = new messengerProto.messenger.MessengerService(
        'localhost:5002',
        grpc.credentials.createInsecure()
    );

    messengerClient.FindOne({ id: 1 }, (err, response) => {
        if (err) {
            console.error('❌ MessengerService failed:', err.message);
        } else {
            console.log('✅ MessengerService Response:', response);
        }
    });
}

console.log('\n📊 === SUMMARY ===');
console.log('Total packages found:', Object.keys(messengerProto).length);

for (const packageName of Object.keys(messengerProto)) {
    const packageObj = messengerProto[packageName];
    const services = Object.keys(packageObj).filter(key =>
        typeof packageObj[key] === 'function'
    );
    console.log(`Package "${packageName}": ${services.length} service(s)`);

    for (const serviceName of services) {
        console.log(`  - ${serviceName}`);
    }
}