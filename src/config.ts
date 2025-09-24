import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    dbUrl: "postgres://postgres:boot.dev@localhost:5432/gator?sslmode=disable";
    currentUserName: string;
};

export function setUser(user: string) {
    writeConfig({
        dbUrl: "postgres://postgres:boot.dev@localhost:5432/gator?sslmode=disable",
        currentUserName: user,
    });
}

export function readConfig(): Config {
    const data = fs.readFileSync(getConfigFilePath(), "utf8");
    return validateConfig(JSON.parse(data));
}

function getConfigFilePath(): string {
    return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg: Config) {
    fs.writeFileSync(
        getConfigFilePath(),
        JSON.stringify({
            db_url: cfg.dbUrl,
            current_user_name: cfg.currentUserName,
        }),
    );
}

function validateConfig(rawConfig: any): Config {
    if (
        rawConfig.db_url !=
        "postgres://postgres:boot.dev@localhost:5432/gator?sslmode=disable" ||
        !rawConfig.current_user_name
    ) {
        return {
            dbUrl:
                "postgres://postgres:boot.dev@localhost:5432/gator?sslmode=disable",
            currentUserName: "",
        };
    }
    return {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name,
    };
}
