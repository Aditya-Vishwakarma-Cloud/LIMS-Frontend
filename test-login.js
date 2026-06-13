const axios = require('axios');

async function testLogin() {
    try {
        const response = await axios.post('http://localhost:8080/api/auth/login', {
            email: 'admin@lims.com',
            password: 'LimsAdmin2026!'
        });
        console.log("Login successful! Response status:", response.status);
        console.log("Response data:", response.data);
    } catch (error) {
        if (error.response) {
            console.error("Login failed with status:", error.response.status);
            console.error("Response data:", error.response.data);
        } else {
            console.error("Login failed with error:", error.message);
        }
    }
}

testLogin();
