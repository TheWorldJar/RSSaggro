import {CommandsRegistry, handlerLogin, handlerRegister, registerCommand, runCommand} from "./commands.js";

async function main() {
    const commands: CommandsRegistry = {};
    registerCommand(commands, 'login', handlerLogin);
    registerCommand(commands, 'register', handlerRegister);
    const run = process.argv.slice(2);
    try {
        await runCommand(commands, run[0], ...run.slice(1));
    } catch (error: any) {
        if (error?.cause?.code === '23505') {
            console.error(`User already exists!`);
        } else {
            console.error(error?.message);
        }
        process.exit(1);
    }
    process.exit(0);
}

await main();