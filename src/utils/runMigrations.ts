import { Umzug, SequelizeStorage } from 'umzug';
import { db } from '../config/database';
import path from 'path';

const umzug = new Umzug({
  migrations: {
    glob: ['../../migrations/*.js', { cwd: __dirname }],
    resolve: ({ name, path, context }) => {
      const migration = require(path!);
      return {
        name,
        up: async () => {
          const fn = migration.up || migration.default?.up;
          return fn(db.getQueryInterface(), db.Sequelize);
        },
        down: async () => {
          const fn = migration.down || migration.default?.down;
          return fn(db.getQueryInterface(), db.Sequelize);
        },
      };
    },
  },
  context: db.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize: db }),
  logger: console,
});

export type Migration = typeof umzug._types.migration;

export async function runMigrations() {
  try {
    await db.authenticate();
    console.log('Database connection has been established successfully.');

    const migrations = await umzug.up();
    console.log('Migrations executed successfully:', migrations.map(m => m.name));

    await db.close();
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runMigrations();
}
