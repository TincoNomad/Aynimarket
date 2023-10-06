// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Aynimarket {
    address public owner;

    struct Item{
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    struct Order {
        uint256 time;
        Item item;
    }

    //Mapping item with id 
    mapping(uint256 => Item) public items;

    //Mapping for buying
    mapping(address => uint256) public orderCount;

    //Mapping for total orders - nested mapping
    mapping(address => mapping(uint256 => Order)) public orders;
    
    //Create an event call
    event Buy(address buyer, uint256 orderID, uint256 itemID);
    event List(string name, uint256 cost, uint256 quantity);

    //Modifier to only the owner of the products can call the function
    modifier onlyOwner(){
        require(msg.sender == owner);
        //thi seccion here means "do ir before de function budy" 
        //Also do the modification before is more gas eficient
        _;
    }

    constructor(){
        //wallet sign message 
        owner = msg.sender;
    }

    //List products
    function list(
        uint256 _id, 
        string memory _name, 
        string memory _category,
        string memory _image,
        uint256 _cost,
        uint256 _rating,
        uint256 _stock
        ) public onlyOwner{

            //Create item struct
            Item memory item = Item(_id, _name, _category, _image, _cost, _rating, _stock);

            //Save Item Struct to blockchain - Using mapping
            items [_id] = item;

            //Emit an event
            emit List(_name, _cost, _stock);
        }

    //Buy products
    //To receive Crypto us "payable" afeter "public"
    function buy(uint256 _id) public payable{
        //Ferch item
        Item memory item = items[_id];

        //Require enough ether to buy item
        require(msg.value >= item.cost);

        //Require item is in stock
        require(item.stock > 0);

        //Create an order
        Order memory order = Order(block.timestamp, item);

        //Sabe order to chain
        orderCount[msg.sender]++; //<--- Order ID
        orders[msg.sender][orderCount[msg.sender]] = order;

        //Substrack stock
        items[_id].stock = item.stock - 1;
        //Emit event
        emit Buy(msg.sender, orderCount[msg.sender], item.id);
    } 

    //Withdraw funds
    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
