const web3 = require('@solana/web3.js');
const chalk = require("chalk");
const figlet = require("figlet");
const inquirer = require("inquirer");
const { randomNumber, getReturnAmount, totalAmountToBePaid } = require("./helper.js");
const { getWalletBalance, transferSOL, airDropSol } = require("./solana.js");
// import { web3 } from '@solana/web3.js';
// import {run} from "./helper.js";


// console.log(connection);

const gameSecretKey = [
    13, 132, 57, 91, 189, 246, 89, 114, 100, 223, 20,
    30, 59, 219, 72, 193, 140, 162, 130, 91, 102, 77,
    52, 237, 3, 204, 79, 22, 245, 81, 199, 97, 31,
    26, 103, 45, 84, 217, 176, 177, 26, 200, 72, 58,
    214, 8, 64, 217, 179, 4, 29, 240, 15, 59, 64,
    249, 93, 231, 87, 191, 156, 48, 252, 239
]

const userSecretKey = [
    53, 111, 119, 120, 204, 162, 149, 174, 221, 76, 164,
    69, 60, 32, 16, 187, 7, 80, 207, 122, 253, 96,
    112, 9, 0, 33, 91, 101, 70, 229, 166, 224, 185,
    155, 90, 174, 164, 55, 202, 54, 108, 10, 181, 24,
    226, 78, 170, 143, 233, 199, 98, 1, 57, 47, 9,
    128, 165, 6, 228, 103, 71, 21, 253, 138
];

// change the userWallet here 

const gameWallet = web3.Keypair.fromSecretKey(Uint8Array.from(gameSecretKey));
const userWallet = web3.Keypair.fromSecretKey(Uint8Array.from(userSecretKey));
// console.log(userWallet);


const init = () => {
    console.log(
        chalk.green(
            figlet.textSync("Solana Staker", {
                font: "Standard",
                horizontalLayout: "default",
                verticalLayout: "default",
                width: 80,
            })
        )
    );
}

const askQuestions = () => {
    const questions = [
        {
            name: "STAKE",
            type: "number",
            message: "What is the amount of SOL you want to stake?",
        },
        {
            type: "number",
            name: "STAKE_RATIO",    
            message: "What is your stake ratio? 1:",
        }
    ];

    return inquirer.prompt(questions);
}

const askGuess = () => {
    const questions = [
        {
            name: "GUESS",
            type: "number",
            message: "Guess a number between 1 and 5 (both included):"
        }
    ];

    return inquirer.prompt(questions);
}

const runMain = async () => {
    init();

    console.log(
        chalk.yellow(
            'The max bidding amount is 2.5 SOL here'
        )
    );

    const answers = await askQuestions();

    const bal = await getWalletBalance(userWallet.publicKey.toString());

    if (bal < answers.STAKE) {
        console.log(
            chalk.red(
                `You don't have enough SOL to play the game`
            )
        );
        return;
    }
    
    console.log(
        "You need to pay",
        chalk.green(
            totalAmountToBePaid(answers)
        ),
        "SOL to move forward"
    );
    console.log(
        chalk.green(
            `You will get ${answers.STAKE * answers.STAKE_RATIO} SOL if you win`
        )
    );

    if (answers.STAKE > 2.5) {
        console.log(
            chalk.red(
                "You can't bid more than 2.5 SOL"
            )
        );
    }

    

    const answer = await askGuess();
    const randNumber = randomNumber();
    console.log(
        chalk.yellow(
            `Lucky number was ${randNumber}`
        )
    );

    

    const gameChargeSign = await transferSOL(userWallet, gameWallet, answers.STAKE);
    console.log(
        "Signature of the game charge:",
        chalk.green(
            gameChargeSign
        )
    );

    if (randNumber == answer.GUESS) {
        const winSign = await transferSOL(gameWallet, userWallet, getReturnAmount(answers.STAKE, answers.STAKE_RATIO));
        console.log(
            chalk.green(
                `You won!`
            )
        );
        console.log(
            "Prize signature:",
            chalk.green(
                winSign
            )
        );
    } else {
        console.log(
            chalk.red(
                `You loose! `
            )
        );
        console.log(
            chalk.yellow(
                "Better luck next time"
            )
        );
        
    }


    console.log("-----------------------------");
    const balU = await getWalletBalance(userWallet.publicKey.toString());
    console.log(
        "User Wallet Balance:",
        balU
    );

    console.log("---");
    const balG = await getWalletBalance(gameWallet.publicKey.toString());
    console.log(
        "Game Wallet Balance:",
        balG
    );
}

// const runMain2 = async () => {
//     console.log(
//         chalk.green(
//             `airdroping..`
//         )
//     );
//     const ad = await airDropSol(userWallet.publicKey.toString());
//     const balance = await getWalletBalance(userWallet.publicKey.toString());
//     console.log(
//         chalk.green(
//             `Your balance is ${balance} SOL`
//         )
//     );
// }
runMain();

