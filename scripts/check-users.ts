import db from '../models';

async function checkUsers() {
  try {
    const users = await db.User.findAll();
    console.log('Users in the database:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.role})`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.sequelize.close();
  }
}

checkUsers();
