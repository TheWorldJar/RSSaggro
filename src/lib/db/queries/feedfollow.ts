import {db} from "..";
import {feed_follows, feeds, users} from "../schema";
import {eq} from "drizzle-orm";

export async function createFeedFollow(userId: string, feedId: string) {
    const [newFeedFollow] = await db
        .insert(feed_follows)
        .values({
            user_id: userId,
            feed_id: feedId,
        })
        .returning();
    const [result] = await db
        .select({feed_follows, feeds: feeds.name, users: users.name})
        .from(feed_follows)
        .where(eq(feed_follows.id, newFeedFollow.id))
        .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
        .innerJoin(users, eq(feed_follows.user_id, users.id));
    return result;
}

export async function getFeedFollowForUser(user_id: string) {
    return db
        .select({feed_follows, feeds: feeds.name, users: users.name})
        .from(feed_follows)
        .where(eq(feed_follows.user_id, user_id))
        .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
        .innerJoin(users, eq(feed_follows.user_id, users.id));
}
