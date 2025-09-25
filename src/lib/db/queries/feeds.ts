import {db} from '..';
import {feeds, users} from '../schema';
import {eq} from "drizzle-orm";

export async function createFeed(name: string, url: string, user: string) {
    const [result] = await db.insert(feeds).values({
        name: name,
        url: url,
        user_id: user
    }).returning();
    return result;
}

export async function getFeeds() {
    return db.select().from(feeds).leftJoin(users, eq(feeds.user_id, users.id));
}

export async function getFeedId(url: string) {
    const [result] = await db.select({id: feeds.id}).from(feeds).where(eq(feeds.url, url));
    return result.id;
}