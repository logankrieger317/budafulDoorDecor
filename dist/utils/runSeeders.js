"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const umzug_1 = require("umzug");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
async function runSeeders() {
    const maxRetries = 3;
    let currentTry = 0;
    while (currentTry < maxRetries) {
        try {
            const databaseUrl = 'postgresql://postgres:MMsLaCDVZzbqWdHqmLdLRiQhgIxGyoyE@monorail.proxy.rlwy.net:13479/railway';
            const sequelize = new sequelize_1.Sequelize(databaseUrl, {
                dialect: 'postgres',
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false
                    }
                },
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                },
                retry: {
                    max: 5
                }
            });
            // Test the connection
            await sequelize.authenticate();
            console.log('Database connection has been established successfully.');
            const umzug = new umzug_1.Umzug({
                migrations: {
                    glob: path_1.default.join(__dirname, '../../seeders/*.js'),
                    resolve: ({ name, path: filePath }) => {
                        if (!filePath) {
                            throw new Error(`Could not resolve path for seeder ${name}`);
                        }
                        const seeder = require(filePath);
                        return {
                            name,
                            up: async () => {
                                const queryInterface = sequelize.getQueryInterface();
                                return seeder.up(queryInterface, sequelize);
                            },
                            down: async () => {
                                const queryInterface = sequelize.getQueryInterface();
                                return seeder.down(queryInterface, sequelize);
                            }
                        };
                    },
                },
                context: sequelize.getQueryInterface(),
                storage: new umzug_1.SequelizeStorage({ sequelize }),
                logger: console,
            });
            const pending = await umzug.pending();
            console.log('Pending seeders:', pending.map(m => m.name));
            await umzug.up();
            console.log('All seeders have been executed successfully');
            await sequelize.close();
            return;
        }
        catch (error) {
            console.error('Error running seeders:', error);
            currentTry++;
            if (currentTry === maxRetries) {
                console.error('Max retries reached. Exiting...');
                process.exit(1);
            }
            console.log(`Retrying... (Attempt ${currentTry + 1} of ${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
        }
    }
}
runSeeders();
