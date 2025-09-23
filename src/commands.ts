import {setUser} from "./config.js";
import {createUser, getUser, resetUsers} from "./lib/db/queries/users";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    if (cmdName in registry) {
        await registry[cmdName](cmdName, ...args);
    } else {
        throw new Error(`Unknown command: ${cmdName}`);
    }
}

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length < 1) {
        throw new Error("Missing argument: specify a username");
    }
    if (! await getUser(args[0])) {
        throw new Error(`User does not exist: ${args[0]}`);
    }
    setUser(args[0]);
    console.log(`Successfully logged in as ${args[0]}`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length < 1) {
        throw new Error("Missing argument: specify a username");
    }
    const result = await createUser(args[0]);
    console.log(`Successfully created user ${result.name}`);
    await handlerLogin(cmdName, args[0]);
}

export async function handlerReset(_: string, ...args: string[]) {
    await resetUsers();
    console.log(`Successfully reset users!`);
}

