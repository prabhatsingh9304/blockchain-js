const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");

app.use(bodyParser.json());

const blockchain = new Blockchain();

//Create a new transaction
app.post("/transaction", (req, res) => {
  try {
    const { sender, receiver, amount } = req.body;
    const blockNumber = blockchain.createNewTransaction(
      amount,
      sender,
      receiver
    );
    res.send({
      status: true,
      message: "Transaction Created Successfully",
      blockNumber: blockNumber,
    });
  } catch (error) {
    res.send({
      status: false,
      message: "Transaction failed",
      error: error,
    });
  }
});

//Get entire blockchain
app.get("/blockchain", (req, res) => {
  try {
    res.send({
      status: true,
      blockchain: blockchain,
    });
  } catch (error) {
    res.send({
      status: false,
      message: "Blockchain retrieval failed",
      error: error,
    });
  }
});

//Mine a block
app.get("/mine", (req, res) => {
  try {
    const lastBlock = blockchain.getLastBlock();
    const previousHash = blockchain.getLastBlock()["hash"];
    const currentBlockData = {
      index: lastBlock["index"] + 1,
      transactions: blockchain.pendingTransactions,
    };

    const nonce = blockchain.proofOfWork(previousHash, currentBlockData);

    const newBlockHash = blockchain.hashBlock(
      previousHash,
      currentBlockData,
      nonce
    );

    const newBlock = blockchain.createNewBlock(
      previousHash,
      newBlockHash,
      nonce
    );

    res.send({
      status: true,
      message: "New Blocked Mined Successfully",
      minedBlock: newBlock,
    });
  } catch (error) {
    res.send({
      status: false,
      message: "Blocked minning failed ",
      error: error,
    });
  }
});

app.listen(3000, () => {
  console.log("Server is working");
});
