import {
    CommandsRegistry,
    handlerAddFeed,
    handlerAgg,
    handlerFeeds,
    handlerFollow,
    handlerFollowing,
    handlerLogin,
    handlerRegister,
    handlerReset,
    handlerUsers,
    runCommand
} from "./commands.js";

async function main() {
    const commands: CommandsRegistry = {
        'login': handlerLogin,
        'register': handlerRegister,
        'reset': handlerReset,
        'users': handlerUsers,
        'agg': handlerAgg,
        'addfeed': handlerAddFeed,
        'feeds': handlerFeeds,
        'follow': handlerFollow,
        'following': handlerFollowing,
    };
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