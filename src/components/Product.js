import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Rating from './Rating'

import close from '../assets/close.svg'

const Product = ({ item, provider, account, aynimarket, togglePop }) => {

  const[order, setOrder] = useState(null)
  const[hasBought, setHasBought] = useState(false)

  const fetchDetails = async () => {
    const events = await aynimarket.queryFilter("Buy")
    const orders = events.filter(
      (event) => event.arg.buyer === account && event.args.itemId.toString()=== item.id.toString()
    )

    if(orders.length === 0) return
    const order = await aynimarket.orders(account, orders[0].args.orderId)
    setOrder(order)
  
  }

  const buyHandler = async () => {
    const signer = await provider.getSigner()
    let transaction = aynimarket.connect(signer).buy(item.id, {value: item.cost})
    await transaction.wait()
    
    setHasBought(true)
  
  }

  useEffect(() => {fetchDetails()},[hasBought])

  return (
    <div className="product">
      <div className='product__details'>
        <div className='product__image'>
          <img src={item.image} alt="Product" />
        </div>
        <div className='product__overview'>
          <h1>{item.name}</h1>
          <Rating rating={item.rating} />
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
            FREE delivery <br/>
            <strong>
              {new Date(Date.now() + 345600000).toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'})}
            </strong>
          </p>

          {item.stock > 0? (<p>In Stock</p>):(<p>Out of Stock</p>)}

          <button className='product__buy' onClick={buyHandler}>Buy Now</button>
          <p><small>Ship from</small> Aynimarket</p>
          <p><small>Sold by</small> Aynimarket</p>

          {order && (
            <div className='product__bought'>
              Item bought on <br/>
              <strong>
                {new Date(Number(order.time.toString()+ '000')).toLocaleDateString(
                  undefined,{
                    weekday:'long',
                    hour:'numeric',
                    minute:'numeric',
                    second:'numeric'
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