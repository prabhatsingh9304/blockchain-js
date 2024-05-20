var sha256 = require("js-sha256").sha256;

class Blockchain {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
    this.createNewBlock("0", "0", 100);
  }

  createNewBlock = function (previousHash, hash, nonce) {
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      hash: hash,
      nonce: nonce,
      previousHash: previousHash,
    };

    //After Adding new block empty transaction POOL
    this.chain.push(newBlock);
    this.pendingTransactions = [];

    return newBlock;
  };

  getLastBlock = function () {
    return this.chain[this.chain.length - 1];
  };

  createNewTransaction = function (amount, sender, receiver) {
    const newTransaction = {
      amount: amount,
      sender: sender,
      receiver: receiver,
    };

    this.pendingTransactions.push(newTransaction);

    //Return the index of last block (1->index)
    return this.getLastBlock()["index"] + 1;
  };

  hashBlock = function (previousHash, currentBlockData, nonce) {
    const hashData =
      previousHash + JSON.stringify(currentBlockData) + nonce.toString();
    const hash = sha256(hashData);

    return hash;
  };

  //Increase the nonce
  //Hash using new nonce
  //Do it till hash first 4 character matches with 0000
  proofOfWork = function (previousHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousHash, currentBlockData, nonce);
    while (hash.substring(0, 4) !== "0000") {
      nonce = nonce + 1;
      hash = this.hashBlock(previousHash, currentBlockData, nonce);
    }
    return nonce;
  };
}

module.exports = Blockchain;
