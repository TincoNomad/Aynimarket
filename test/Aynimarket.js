const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

  //GLobal constants for listing an item
  const ID = 1
  const NAME = "Shoes"
  const CATEGORY = "Clothing"
  const IMAGE = "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg"
  const COST = tokens(1)
  const RATING = 4
  const STOCK = 5

describe("Aynimarket", () => {
  // create a variable to hold the contract
  let aynimarket
  let deployer, buyer

  beforeEach(async () => {
    //Setup Accounts
    [deployer, buyer] = await ethers.getSigners()
    //console.log(deployer.address, buyer.address)
    //Deploy contract in test net
    const Aynimarket = await ethers.getContractFactory("Aynimarket")
    //declare aynimarket variable
    aynimarket = await Aynimarket.deploy()
  })
  
  // Describe the deployment
  describe("Deployment", () => {
    it("Sets the owner", async () => {
      const owner = await aynimarket.owner()
      expect(owner).to.equal(deployer.address)
    
    })
  })

  describe("Listing", () => {
    let transaction

    beforeEach(async () => {
      transaction = await aynimarket.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
      await transaction.wait()
    })

    it("Return item attributes", async () => {
      const item = await aynimarket.items(ID)
      expect(item.id).to.equal(ID)
      expect(item.name).to.equal(NAME)
      expect(item.category).to.equal(CATEGORY)
      expect(item.image).to.equal(IMAGE)
      expect(item.rating).to.equal(RATING)
      expect(item.stock).to.equal(STOCK)    
    })

    it("Emits List event", () => {
      expect(transaction).to.emit(aynimarket, "List")
    })
  })

  describe("Buying", () => {
    let transaction

    beforeEach(async () => {
      //List an item
      transaction = await aynimarket.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
      await transaction.wait()

      //Buy an item
      transaction = await aynimarket.connect(buyer).buy(ID, {value: COST})
      await transaction.wait()
    
    })

    it("Updates buyers's order count", async () => {
      const result = await aynimarket.orderCount(buyer.address)
      expect(result).to.equal(1)
    })

    it("Adds the order", async () => {
      const order = await aynimarket.orders(buyer.address, 1)
      expect(order.time).to.be.greaterThan(0)
      expect(order.item.name).to.equal(NAME)
    })

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(aynimarket.address)
      expect(result).to.equal(COST)
      //For watch the value you can usa
      //console.log(result)
    })

    it("Emits a Buy event", () => {
      expect(transaction).to.emit(aynimarket, "Buy")
    })
  })

  describe("Withdrawing", () => {
    let balanceBefore

    beforeEach(async () => {
      // List a item
      let transaction = await aynimarket.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
      await transaction.wait()

      // Buy a item
      transaction = await aynimarket.connect(buyer).buy(ID, { value: COST })
      await transaction.wait()

      // Get Deployer balance before
      balanceBefore = await ethers.provider.getBalance(deployer.address)

      // Withdraw
      transaction = await aynimarket.connect(deployer).withdraw()
      await transaction.wait()
    })

    it('Updates the owner balance', async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    it('Updates the contract balance', async () => {
      const result = await ethers.provider.getBalance(aynimarket.address)
      expect(result).to.equal(0)
    })
  })
})
