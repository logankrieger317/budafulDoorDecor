"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = runMigrations;
const umzug_1 = require("umzug");
const database_1 = require("../config/database");
const umzug = new umzug_1.Umzug({
    migrations: {
        glob: ['../migrations/*.ts', { cwd: __dirname }],
        resolve: ({ name, path, context }) => {
            const migration = require(path);
            return {
                name,
                up: async () => migration.up(context, database_1.db.getQueryInterface()),
                down: async () => migration.down(context, database_1.db.getQueryInterface()),
            };
        },
    },
    context: database_1.db.getQueryInterface(),
    storage: new umzug_1.SequelizeStorage({ sequelize: database_1.db }),
    logger: console,
});
async function runMigrations() {
    try {
        await database_1.db.authenticate();
        console.log('Database connection has been established successfully.');
        const migrations = await umzug.up();
        console.log('Migrations executed successfully:', migrations.map(m => m.name));
        await database_1.db.close();
    }
    catch (error) {
        console.error('Error running migrations:', error);
        process.exit(1);
    }
}
if (require.main === module) {
    runMigrations();
}
