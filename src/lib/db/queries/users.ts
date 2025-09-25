import {db} from "..";
import {users} from "../schema";
import {eq, sql} from "drizzle-orm";

export async function createUser(name: string) {
    const [result] = await db.insert(users).values({name: name}).returning();
    return result;
}

export async function getUser(name: string) {
    const [result] = await db.select().from(users).where(eq(users.name, name));
    return result;
}

export async function getUserId(name: string) {
    const [result] = await db.select({id: users.id}).from(users).where(eq(users.name, name));
    return result.id;
}

export async function resetUsers() {
    await db.execute(sql`SET client_min_messages TO WARNING`);
    await db.execute(sql`TRUNCATE TABLE ${users} CASCADE`);
}

export async function getUsers() {
    return db.select({name: users.name}).from(users);
}