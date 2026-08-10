import {
    registerDocument,
    verifyDocument,
    getDocument,
    revokeDocument,
} from "./services/blockchain.service";


const hash =
    "0xb256ba8f0c47793741c4d800457332d8f40f1ef40d0dae1ad8d8110972a4229e";


async function main() {

    console.log("Registering...");

    const txHash = await registerDocument(hash);

    console.log("TX:", txHash);


    console.log("Checking...");

    const valid = await verifyDocument(hash);

    console.log("Valid:", valid);


    console.log("Getting document...");

    const doc = await getDocument(hash);

    console.log(doc);


    console.log("Revoking...");

    const revokeTx = await revokeDocument(hash);

    console.log("Revoke TX:", revokeTx);


    const afterRevoke = await verifyDocument(hash);

    console.log(
        "Valid after revoke:",
        afterRevoke
    );
}


main();