import { resolve } from 'node:path'

const databaseConfigs = {
    development: {
        dialect: 'sqlite',
        url: './data/sqlite.dev.db',
    },
    test: {
        dialect: 'sqlite',
        url: './data/sqlite.test.db'
    
    },
    production: {
        dialect: 'postgresql',
        url: process.env.DATABASE_URL || ""
    }
}

type Environment = keyof typeof databaseConfigs;
const environment  = process.env.NODE_ENV ?? 'development';

if(!(environment in databaseConfigs)) {
    throw new Error(`Unsupported Environment: ${environment}`);
}

export const databaseConfig = databaseConfigs[environment as Environment];

if(!databaseConfig) throw new Error(`Configuration for environment ${environment} could not be found`);

export function getSqlitePath() {
    if(databaseConfig.dialect !== "sqlite") {
        throw new Error("Current environment does not use SQLite");
    }

    return resolve(databaseConfig.url);
}
