import * as dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/../../.env' });

export default {
    postgresHostname : process.env.DATABASE_HOSTNAME ?? 'localhost',
    postgresPort : process.env.DATABASE_PORT ?? 5432,
    postgresUsername : process.env.DATABASE_USERNAME ?? 'postgres',
    postgresPassword : process.env.DATABASE_PASSWORD ?? 'postgres',
    postgresDatabase : process.env.DATABASE_NAME ?? 'database',
}