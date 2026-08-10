import { ethers } from "ethers";
import { env } from "./env";
import abi from "../abi/DocumentRegistry.abi.json";
import { Wallet } from "ethers";

const provider = new ethers.JsonRpcProvider(
    env.BLOCKCHAIN_RPC_URL
);

const wallet = new ethers.NonceManager(
    new ethers.Wallet(
        env.PRIVATE_KEY,
        provider
    )
);

export const contract = new ethers.Contract(
    env.CONTRACT_ADDRESS,
    abi,
    wallet
);