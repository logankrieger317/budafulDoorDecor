import db from '../src/models';

async function checkUsers() {
  try {
    const users = await db.User.findAll();
    console.log('Users found:', users.length);
    console.log('User details:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}): ${user.role}`);
    });
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await db.sequelize.close();
  }
}

checkUsers();
