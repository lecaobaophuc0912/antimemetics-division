const API_BASE_URL = 'http://localhost:3001/api';

async function testApiConnection() {
    console.log('🔍 Testing API connection to backend...');

    try {
        // Test health check
        console.log('\n1. Testing health check...');
        const healthResponse = await fetch(`${API_BASE_URL}/health`);
        if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            console.log('✅ Health check passed:', healthData);
        } else {
            console.log('❌ Health check failed:', healthResponse.status);
        }
    } catch (error) {
        console.log('❌ Health check error:', error.message);
    }

    try {
        // Test auth endpoints
        console.log('\n2. Testing auth endpoints...');
        const authResponse = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password123',
            }),
        });

        if (authResponse.ok) {
            const authData = await authResponse.json();
            console.log('✅ Auth endpoint working:', authData);
        } else {
            const errorData = await authResponse.json().catch(() => ({}));
            console.log('⚠️ Auth endpoint response:', authResponse.status, errorData);
        }
    } catch (error) {
        console.log('❌ Auth endpoint error:', error.message);
    }

    console.log('\n📋 API Test Summary:');
    console.log(`Backend URL: ${API_BASE_URL}`);
    console.log('Frontend should be able to connect to backend on port 3001');
}

testApiConnection(); 