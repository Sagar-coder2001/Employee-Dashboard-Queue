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
                       <img src={zeal} alt="" style={{width:'35px', height:'35px'}} />

                    </div>
                    <div className="rightnavbar">
                       <a href="" className='ml-3' style={{marginLeft:'30px'}}>Banana-Leaf</a>
                    </div>
                    <div>
                        
                    </div>
                </div>
            </header>

        </div>
    )
}

export default Navbar
