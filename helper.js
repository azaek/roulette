
const getReturnAmount = (answer) => {
    return answer.STAKE + (answer.STAKE * answer.STAKE_RATIO);
}

const randomNumber = () => {
    return Math.floor(Math.random() * (5 - 1 + 1)) + 1;
}

const totalAmountToBePaid = (answer) => {
    return answer.STAKE ;
}

module.exports = {
    randomNumber,
    getReturnAmount,
    totalAmountToBePaid
}

// run();