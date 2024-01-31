import { ethers } from 'ethers';

const Navigation = ({ account, setAccount }) => {
    const connectHandler = async () => {
        //Window Ethereum Object
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = ethers.utils.getAddress(accounts[0])
        setAccount(account)
    }

    const disconnectHandler = () => {
        // Add logic to disconnect the account
        setAccount(null);
    }

    return (
        <nav>
            <div className='nav__brand'>
                <h1>Aynimarket</h1>
            </div>
            <input type="text" className='nav__search' />
            <div className='connect__secton'>
            {account ? (
                <div className='connect__buttons'>
                    <button type='button' className='wallet__connect'>{account.slice(0, 6) + '...' + account.slice(38, 42)}</button>
                    <spam className="nav__disconnect" onClick={disconnectHandler}> Disconnect Wallet </spam>
                </div>
            ) : (
                <button type='button' className='nav__connect' onClick={connectHandler}><i className="fa-solid fa-wallet"></i> Connect Wallet</button>
            )}
            </div>
            <ul className='nav__links'>
                <li><a href="#Clothing & Jewelry">Clothing & Jewelry</a></li>
                <li><a href="#Electronics $ Gadgets">Electronics $ Gadgets</a></li>
                <li><a href="#Toys & Gaming">Toys & Gaming</a></li>
            </ul>
        </nav>
    );
}

export default Navigation;