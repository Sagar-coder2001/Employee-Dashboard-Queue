import React from 'react'
import './Navbar.css';
import { useSelector } from 'react-redux';
import zeal from '../../assets/Zeal_Logo_2.png'

const Navbar = () => {
   const isloggedin = useSelector((state) => state.token.userloggedin);
 
    return (
        <div>
            <header>
                <div className="navbar">
                    <div className="leftnavbar">
                       <a href="" className='ml-4'>Banana-Leaf</a>
                    </div>
                    <div className="rightnavbar">
                           <img src={zeal} alt="" style={{width:'35px', height:'35px'}} />
                    </div>
                </div>
            </header>

        </div>
    )
}

export default Navbar
