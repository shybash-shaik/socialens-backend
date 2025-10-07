import fetch from 'node-fetch';

async function main() {
  try {
    // Login to get access token
    const loginResponse = await fetch('http://localhost:5001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'password123',
      }),
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    const accessToken = loginData.tokens.accessToken;

    // Create invitation
    const inviteResponse = await fetch('http://localhost:5001/invitations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        email: 'shybashshaik@gmail.com',
        role: 'client_user',
        tenantId: 'test-tenant',
        authType: 'otp',
      }),
    });

    if (!inviteResponse.ok) {
      const errorText = await inviteResponse.text();
      throw new Error(
        `Invitation creation failed: ${inviteResponse.status} - ${errorText}`
      );
    }

    await inviteResponse.json();
  } catch {
    // ignore errors
  }
}

main();
