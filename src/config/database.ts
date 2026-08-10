import { Pool } from "pg";
import { env } from "./env";

export const db = new Pool({
    connectionString: env.DATABASE_URL,
});

export async function checkDatabase() {
    const result = await db.query(
        "SELECT NOW()"
    );

    console.log(
        "PostgreSQL connected:",
        result.rows[0]
    );
}