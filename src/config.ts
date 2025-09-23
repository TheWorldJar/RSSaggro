import fs from 'fs';
import os from 'os';
import path from 'path'

export type Config = {
    dbUrl: 'postgres://example';
    currentUserName: string;
}

export function setUser(user: string) {
    writeConfig({dbUrl: 'postgres://example', currentUserName: user});
}

export function readConfig(): Config {
    const data = fs.readFileSync(getConfigFilePath(), 'utf8');
    return validateConfig(JSON.parse(data));
}

function getConfigFilePath(): string {
    return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg: Config) {
    fs.writeFileSync(getConfigFilePath(), JSON.stringify({db_url: cfg.dbUrl, current_user_name: cfg.currentUserName}));
}

function validateConfig(rawConfig: any): Config {
    if (rawConfig.db_url != "postgres://example" || !rawConfig.current_user_name) {
        return {dbUrl: "postgres://example", currentUserName: ""};
    }
    return {dbUrl: rawConfig.db_url, currentUserName: rawConfig.current_user_name};
}