import { config } from "dotenv";

config();

export const env = {
    PORT: Number(process.env.PORT ?? 3000),
    DATABASE_URL: process.env.DATABASE_URL!,
    BLOCKCHAIN_RPC_URL: process.env.BLOCKHAIN_RPC_URL!,
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS!,
    PRIVATE_KEY: process.env.PRIVATE_KEY!,
};