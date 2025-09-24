import {
    CommandsRegistry,
    handlerAddFeed,
    handlerAgg,
    handlerFeeds,
    handlerLogin,
    handlerRegister,
    handlerReset,
    handlerUsers,
    registerCommand,
    runCommand
} from "./commands.js";

async function main() {
    const commands: CommandsRegistry = {};
    registerCommand(commands, 'login', handlerLogin);
    registerCommand(commands, 'register', handlerRegister);
    registerCommand(commands, 'reset', handlerReset);
    registerCommand(commands, 'users', handlerUsers);
    registerCommand(commands, 'agg', handlerAgg);
    registerCommand(commands, 'addfeed', handlerAddFeed);
    registerCommand(commands, 'feeds', handlerFeeds);
    const run = process.argv.slice(2);
    try {
        await runCommand(commands, run[0], ...run.slice(1));
    } catch (error: any) {
        if (error?.cause?.code === '23505') {
            console.error(`That already exists!`);
        } else {
            console.error(error?.message);
        }
        process.exit(1);
    }
    process.exit(0);
}

await main();