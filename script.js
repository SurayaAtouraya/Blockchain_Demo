class Block
{
	constructor(index, timeStamp, data, previousHash)
	{
		this.index = index;                                                                                                             
		this.timeStamp = timeStamp;                                                                                                                 
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
    this.nonce = 0;                                                                                                               //Random value used in mining calculation
	}

	calculateHash()						                                                                                                      //Uses SHA256 from CryptoJS to generate a hash based on passed string
	{
  		return CryptoJS.SHA256(this.index + this.previousHash + this.timeStamp + JSON.stringify(this.data) + this.nonce).toString();
	}
  
  mineBlock(difficulty)                                                                                                           //Proof of Work implementation to prevent spamming.
  {
    while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0"))
      {
        this.nonce++;
        this.hash = this.calculateHash();
      }
    console.log("Block mined hash value: " + this.hash);
  }
}

class Blockchain
{
	constructor()
	{
		this.chain = [this.createGenesisBlock()];
    this.difficulty=2;                                                                                                            //How many 0's must start in the hash
	}

	createGenesisBlock()
	{
		return new Block(0,"01/01/2017","Genesis Block","0");
	}

	getLatestBlock()
	{
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock)
	{
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.mineBlock(this.difficulty);
		this.chain.push(newBlock);
	}
  
  isChainValid()
  {
    for (var i = 1 ; i< this.chain.length ; i++)
      {
        const currentBlock = this.chain[i];
        const previousBlock = this.chain[i-1];
        
        if (currentBlock.hash !== currentBlock.calculateHash())
        {
           return false;
        }
        if (currentBlock.previousHash !== previousBlock.hash)
        {
            return false;
        }
        return true;
      }
  }
}

var test = new Blockchain();
console.log("Lets create a few sample blocks");
console.log("Mining...");
test.addBlock(new Block(1,"10/2/2017", {amount: 4}));
console.log("Mining...");
test.addBlock(new Block(2,"10/3/2017", {amount: 2}));
console.log("Lets examine the blockchain.");
console.log(JSON.stringify(test,null,4));
console.log("Lets examine if the blockchain is valid.");
console.log(test.isChainValid());
console.log("True, therefore the blockchain is valid, lets try to tamper with a block and see if it can be validated.");
test.chain[1].data = {amount: 100};
console.log("Transfer amount has been increased from 4 to 100. Validiating...");
console.log(test.isChainValid());
console.log("The block is invalid! Let's try recalculating the hash.");
console.log("New hash" + test.chain[1].calculateHash());
console.log("Now lets see if it is accepted. Validating...");
console.log(test.isChainValid());
console.log("Rejected since the previous hash of the next block does not match the current blocks hash since we recalculated it. This requires us to recalculate every hash onward to validate the chain. Our chain is small and is easy to recalculate the hash. However, Bitcoin has hundreds of thousands of blocks in its chain with block mining taking a considerable amount of time. Making it very secure.");