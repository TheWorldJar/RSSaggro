import {readConfig, setUser} from "./config.js";
import {createUser, getUser, getUserId, getUsers, resetUsers} from "./lib/db/queries/users";
import {fetchFeed} from "./RSSFeed";
import {createFeed, getFeedId, getFeeds} from "./lib/db/queries/feeds";
import {createFeedFollow, getFeedFollowForUser} from "./lib/db/queries/feedfollow";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    if (cmdName in registry) {
        await registry[cmdName](cmdName, ...args);
    } else {
        throw new Error(`Unknown command: ${cmdName}`);
    }
}

export async function handlerLogin(_: string, ...args: string[]) {
    if (args.length < 1) {
        throw new Error("Missing argument: specify a username");
    }
    if (!await getUser(args[0])) {
        throw new Error(`User does not exist: ${args[0]}`);
    }
    setUser(args[0]);
    console.log(`Successfully logged in as ${args[0]}`);
}

export async function handlerRegister(_: string, ...args: string[]) {
    if (args.length < 1) {
        throw new Error("Missing argument: specify a username");
    }
    const result = await createUser(args[0]);
    console.log(`Successfully created user ${result.name}`);
    await handlerLogin(_, args[0]);
}

export async function handlerReset(_: string) {
    await resetUsers();
    console.log(`Successfully reset users!`);
}

export async function handlerUsers(_: string) {
    const users = await getUsers();
    for (const user of users) {
        if (user.name === readConfig().currentUserName) {
            console.log(`* ${user.name} (current)`);
        } else {
            console.log(`* ${user.name}`);
        }
    }
}

export async function handlerAgg(_: string) {
    /*if (args.length < 1) {
        throw new Error("Missing argument: specify a URL");
    }
    const result = await fetchFeed(args[0]);
    console.log(result);*/
    const result = await fetchFeed('https://www.wagslane.dev/index.xml');
    console.log(result);
}

export async function handlerAddFeed(_: string, ...args: string[]) {
    if (args.length < 2) {
        throw new Error("Missing argument(s): addfeed {name} {url}");
    }
    const userId = await getUserId(readConfig().currentUserName);
    const result = await createFeed(args[0], args[1], userId);
    console.log(`Successfully added feed: ${result.name}`);
    await handlerFollow(_, args[1], userId, result.id);
}

export async function handlerFeeds(_: string) {
    const result = await getFeeds();
    for (const item of result) {
        if (item.feeds && item.users) {
            console.log(`* Title: ${item.feeds.name} / URL: ${item.feeds.url} / User: ${item.users.name}`);
        }
    }
}

export async function handlerFollow(_: string, ...args: string[]) {
    if (args.length < 1) {
        throw new Error("Missing argument: specify a url to follow");
    }
    const userId = args.length > 1 ? args[1] : await getUserId(readConfig().currentUserName);
    const feedId = args.length > 2 ? args[2] : await getFeedId(args[0]);
    const result = await createFeedFollow(userId, feedId);
    console.log(result);
}

export async function handlerFollowing(_: string) {
    const userId = await getUserId(readConfig().currentUserName);
    const result = await getFeedFollowForUser(userId);
    result.forEach((item) => {
        console.log(`* ${item.feeds}`);
    })
}