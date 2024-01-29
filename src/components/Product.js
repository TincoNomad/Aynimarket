import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
// import WalletError from './WalletError'

// Components
import Rating from './Rating'

import close from '../assets/close.svg'

const Product = ({ item, provider, account, aynimarket, togglePop }) => {

  const [order, setOrder] = useState(null)

  const buyHandler = async () => {

    try {
      const signer = await provider.getSigner()
      let transaction = aynimarket.connect(signer).buy(item.id, { value: item.cost })
      // await transaction.wait()
      // console.log(" => Transacción exitosa", transaction)
      if (transaction.hash) {
        await transaction.wait();
        console.log(" => Transacción exitosa", transaction);
      } else {
        console.error('Error al realizar la compra: Transaction hash not available');
      }
    } catch (error) {
      console.error('Error al realizar la compra:', error);

      if (error.message.includes('unknown account #0 (operation="getAddress", code=UNSUPPORTED_OPERATION')) {
        console.error('Error: unknown account #0 (operation="getAddress", code=UNSUPPORTED_OPERATION)');
      }
    }
  }
  useEffect(() => {
    const fetchDetails = async () => {

      try {
        const latestBlock = await provider.getBlockNumber();
        const events = await aynimarket.queryFilter("Buy", { fromBlock: latestBlock - 1000 });
        const orders = events.filter(
          (event) =>
            event.args.buyer === account && event.args.itemId.toString() === item.id.toString(),
        );

        if (orders.length === 0) return;
        const order = await aynimarket.orders(account, orders[0].args.orderId);
        setOrder(order);
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      }
    };

    fetchDetails();
  }, [account, aynimarket, item.id, provider, setOrder]);

  return (
    <div className="product">
      <div className='product__details'>
        <div className='product__image'>
          <img src={item.image} alt="Product" />
        </div>
        <div className='product__overview'>
          <h1>{item.name}</h1>
          <Rating value={item.rating} />
          <hr></hr>
          <p>{item.address}</p>
          <h2>{ethers.utils.formatUnits(item.cost.toString(), 'ether')} ETH</h2>
          <hr></hr>
          <h2>Overwiew</h2>
          <p>
            {item.description}

            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima rem, iusto,
            consectetur inventore quod soluta quos qui assumenda aperiam, eveniet doloribus
            commodi error modi eaque! Iure repudiandae temporibus ex? Optio!
          </p>
        </div>
        <div className='product__order'>
          <h1>{ethers.utils.formatUnits(item.cost.toString(), 'ether')} ETH</h1>
          <p>
            FREE delivery <br />
            <strong>
              {new Date(Date.now() + 345600000).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </strong>
          </p>

          {item.stock > 0 ? (<p>In Stock</p>) : (<p>Out of Stock</p>)}

          <button className='product__buy' onClick={buyHandler}>Buy Now</button>
          <p><small>Ship from</small> Aynimarket</p>
          <p><small>Sold by</small> Aynimarket</p>

          {order && (
            <div className='product__bought'>
              Item bought on <br />
              <strong>
                {new Date(Number(order.time.toString() + '000')).toLocaleDateString(
                  undefined, {
                  weekday: 'long',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric'
                }
                )}
              </strong>
            </div>
          )}

        </div>
        <button onClick={togglePop} className='product__close'><img src={close} alt="Close" /></button>
      </div>
    </div>
  );
}

export default Product;