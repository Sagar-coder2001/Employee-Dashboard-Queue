import React from 'react'
import './Navbar.css';
import { useSelector } from 'react-redux';

const Navbar = () => {
   const isloggedin = useSelector((state) => state.token.userloggedin);
 
    return (
        <div>
            <header>
                <div className="navbar">
                    <div className="leftnavbar">
                       <a href="" className='ml-4'>Company Name</a>
                    </div>
                    <div className="rightnavbar">
                       {/* <i class="fa-solid fa-bell"></i> */}
                       {
                        isloggedin && (
                            <i className="fa-solid fa-user"></i>
                        )
                       }
                    </div>
                </div>
            </header>

        </div>
    )
}

export default Navbar
