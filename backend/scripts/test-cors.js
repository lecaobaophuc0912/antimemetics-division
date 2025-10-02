#!/usr/bin/env node

/**
 * Script test CORS configuration
 * Usage: node scripts/test-cors.js [origin] [method] [endpoint]
 */

const http = require('http');

const args = process.argv.slice(2);
const origin = args[0] || 'http://localhost:3001';
const method = args[1] || 'GET';
const endpoint = args[2] || '/api/todos';

const options = {
    hostname: 'localhost',
    port: 3000,
    path: endpoint,
    method: method,
    headers: {
        'Origin': origin,
        'Content-Type': 'application/json',
    }
};

// Test preflight request (OPTIONS)
if (method !== 'OPTIONS') {
    const preflightOptions = {
        ...options,
        method: 'OPTIONS',
        headers: {
            ...options.headers,
            'Access-Control-Request-Method': method,
            'Access-Control-Request-Headers': 'Content-Type, Authorization',
        }
    };

    console.log(`\n🔍 Testing preflight request (OPTIONS) from ${origin}`);
    console.log('Headers:', preflightOptions.headers);

    const preflightReq = http.request(preflightOptions, (res) => {
        console.log(`\n📡 Preflight Response Status: ${res.statusCode}`);
        console.log('CORS Headers:');
        console.log(`  Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin']}`);
        console.log(`  Access-Control-Allow-Methods: ${res.headers['access-control-allow-methods']}`);
        console.log(`  Access-Control-Allow-Headers: ${res.headers['access-control-allow-headers']}`);
        console.log(`  Access-Control-Allow-Credentials: ${res.headers['access-control-allow-credentials']}`);
        console.log(`  Access-Control-Max-Age: ${res.headers['access-control-max-age']}`);

        if (res.statusCode === 200) {
            console.log('✅ Preflight request successful');
        } else {
            console.log('❌ Preflight request failed');
        }
    });

    preflightReq.on('error', (err) => {
        console.error('❌ Preflight request error:', err.message);
    });

    preflightReq.end();
}

// Test actual request
console.log(`\n🚀 Testing ${method} request from ${origin}`);
console.log('Headers:', options.headers);

const req = http.request(options, (res) => {
    console.log(`\n📡 Response Status: ${res.statusCode}`);
    console.log('CORS Headers:');
    console.log(`  Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin']}`);
    console.log(`  Access-Control-Allow-Credentials: ${res.headers['access-control-allow-credentials']}`);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('✅ Request successful');
            if (data) {
                try {
                    const jsonData = JSON.parse(data);
                    console.log('Response data:', JSON.stringify(jsonData, null, 2));
                } catch (e) {
                    console.log('Response data:', data);
                }
            }
        } else {
            console.log('❌ Request failed');
            if (data) {
                console.log('Error response:', data);
            }
        }
    });
});

req.on('error', (err) => {
    console.error('❌ Request error:', err.message);
});

// Add request body for POST/PUT/PATCH
if (['POST', 'PUT', 'PATCH'].includes(method)) {
    const body = JSON.stringify({ test: 'data' });
    req.setHeader('Content-Length', Buffer.byteLength(body));
    req.write(body);
}

req.end();

console.log('\n📋 Test Summary:');
console.log(`Origin: ${origin}`);
console.log(`Method: ${method}`);
console.log(`Endpoint: ${endpoint}`);
console.log(`Server: http://localhost:3000`);
