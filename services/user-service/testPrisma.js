// testPrisma.js
import prisma from './src/config/prisma.js'; // adjust the path if needed

async function main() {
  try {
    // 1. Create a test user
    const newUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash: 'hashedpassword',
        passwordAlgo: 'bcrypt',
        firstName: 'Shybash',
        lastName: 'Shaik',
        role: 'client_user', // use a valid role from your Role enum
      },
    });
    console.log('Created user:', newUser);

    // 2. Fetch all users
    const users = await prisma.user.findMany();
    console.log('All users:', users);

    // 3. Fetch a single user by email
    const singleUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
    });
    console.log('Single user:', singleUser);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
