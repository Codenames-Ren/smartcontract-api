import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { env } from "./config/env";
import { prisma } from "./config/prisma";
import { documentRoute } from "./routes/document.route";

await prisma.$connect();

const app = new Elysia()

.use(cors())

.onError(({ error, set }) => {
    console.error(error);
    set.status = 500;

    return {
        success: false,
        message:
            error instanceof Error
                ? error.message
                : "Internal server error",
    };
})

.use(documentRoute)

.get("/", () => ({
    message:
        "Smart Contract API running 🚀",
}))

.listen(env.PORT);

console.log(`🦊 Elysia running at ${env.PORT}`);