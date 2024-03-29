import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'

// ABIs
import Aynimarket from './abis/Aynimarket.json'

// Config
import config from './config.json'

function App() {
  const [provider, setProvider] = useState(null)
  const [aynimarket, setAynimarket] = useState(null)
  const [account, setAccount] = useState(null)

  const [electronics, setElectronics] = useState(null)
  const [clothing, setClothing] = useState(null)
  const [toys, setToys] = useState(null)

  const [item, setItem] = useState({})
  const [toggle, setToggle] = useState(false)

  const togglePop = (item) => {
    setItem(item)
    toggle ? setToggle(false) : setToggle(true)
  }

  const loadBlockchainData = async () => {

    try {
      //Conect blockchain
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      setProvider(provider)
      const network = await provider.getNetwork()

      //Conect to smart contract ()
      const aynimarket = new ethers.Contract(config[network.chainId].aynimarket.address, Aynimarket, provider)
      setAynimarket(aynimarket)

      //Load products
      const items = []
      for (var i = 0; i < 9; i++) {
        const item = await aynimarket.items(i + 1)
        items.push(item)
      }
      const electronics = items.filter((item) => item.category === 'electronics')
      const clothing = items.filter((item) => item.category === 'clothing')
      const toys = items.filter((item) => item.category === 'toys')

      setElectronics(electronics)
      setClothing(clothing)
      setToys(toys)
    } catch (error) {
      console.error('Error loading blockchain data:', error);
    }
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <h2>Aynimarket Best Sellers - MATIC</h2>


      {electronics && clothing && toys && (
        <>
          <Section title={"Clothing & Jewelry"} items={clothing} togglePop={togglePop} account={account}/>
          <Section title={"Electronics $ Gadgets"} items={electronics} togglePop={togglePop} account={account}/>
          <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop} account={account}/>
        </>
      )}

      {toggle && (
        <Product item={item} provider={provider} account={account} aynimarket={aynimarket} togglePop={togglePop} />

      )}

    </div>
  );
}

export default App;
