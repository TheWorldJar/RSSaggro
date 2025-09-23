import {CommandsRegistry, handlerLogin, registerCommand, runCommand} from "./commands.js";

function main() {
    const commands: CommandsRegistry = {};
    registerCommand(commands, 'login', handlerLogin);
    const run = process.argv.slice(2);
    try {
        runCommand(commands, run[0], ...run.slice(1));
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

main();