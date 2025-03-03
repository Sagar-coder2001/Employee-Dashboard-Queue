import React, { useEffect, useState } from 'react'
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Cpmponents/Layout';
import { useDispatch } from 'react-redux';
import { changetoken } from '../../Features/Tokenslice';
import userimg from '..//../assets/user.jpg'
import { motion } from 'framer-motion';

const LoginForm = () => {
  const [userdetails, setUserDetails] = useState({
    username: '',
    password: ''
  })
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showerr, setShowErr] = useState(false);
  const [filepath, setfilepath] = useState('');
  const [authuser , setauthuser] = useState(false)
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  // const [isOffline, setIsOffline] = useState(!navigator.onLine);


  const onchangetext = (e) => {
    setUserDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

  }

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    const file = queryParams.get('HID');

    setfilepath(file);
  }, [])

  const submitDetails = async (e) => {
    e.preventDefault();
    try {
      const formdata = new FormData();
      formdata.append('username', userdetails.username);
      formdata.append('password', userdetails.password);

      const response = await fetch(`http://192.168.1.10/Queue/login.php?do=login&hotel_id=${filepath}`, {
        method: 'POST',
        body: formdata,
      });
      const data = await response.json();
      console.log(data);
      dispatch(changetoken(data.Status));

      if (data.Status === true && data.Role === 'emp') {
        navigate('/Employeedashboard', { state: { tokenid: data.Token, username: userdetails.username } });
      }
      if(data.Role === 'admin'){
        setauthuser(true);
      }
      if (data.Status === false ) {
        setShowErr(true);
      }
      setUserDetails({
        username: '',
        password: ''
      })
    }
    catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault(); // Prevent automatic prompt
      setDeferredPrompt(e); // Save the event to trigger it later
      setIsPromptVisible(true); // Show custom button
    });
    // setTimeout(() => {
    //   setShowErr(false)
    // }, 5000);
  },[])


  const handleAddToHomeScreen = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the A2HS prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        setDeferredPrompt(null); // Clear the prompt event after use
        setIsPromptVisible(false); // Hide the custom prompt button
      });
    }
  };

  const handleCancel = () => {
    setIsPromptVisible(false)
  };

  const togglePass = (id) => {
    const passwordInput = document.getElementById(id);
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
};
  return (
    <div>
      <Layout>
        <div className="login-container">
              <div className="card-container">
            
                <form>
                  <div style={{textAlign:'center'}}>
                  <img src={userimg} alt="" />
                  <h4 className='text-center fs-2'>Employee Register</h4>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label"> <strong>Username</strong></label>
                    <input type="email" className="form-control" value={userdetails.username} onChange={onchangetext} id="username" name='username' />
                  <span className='text-danger'>{showerr ?  'Username is required' : ''}</span>
                  </div>
                  <div className="mb-3" style={{position:'relative'}}>
                    <label htmlFor="password" className="form-label"><strong>Password</strong></label>
                    <input type="password" className="form-control" value={userdetails.password} onChange={onchangetext} name='password' id="password" />
                    <i className="fa-solid fa-eye" style={{position: 'absolute', top:'40px', right:'10px', color:'black'}} onClick={() => {togglePass('password')}}></i>
                    <span className='text-danger'>{showerr ?  'Password is required' : ''}</span>
                  </div>
                  <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                    <label htmlFor="form-check-label">Check me out</label>
                  </div>
                  <div className="submit-btn">
                    <button type="submit" className="btn" onClick={submitDetails}><strong>Submit</strong></button>
                  </div>
                </form>
              </div>
        </div>

        {isPromptVisible && (
            <motion.div 
            initial={{ opacity: 0 }} 
            animate={{opacity : 1 }}     
            transition={{ duration: 0.8 }}

            style={{
              width:'96%',
              maxWidth:'500px',
              textAlign:'center',
              margin:'0px auto',
              position:'absolute',
              top: '55px',
              left:'50%',
              zIndex:'1000',
              transform:'translate(-50%,-50%)'
            }}

            className="alert alert-primary alert-dismissible fade show" role="alert">
              <strong>Install These app for better Experince</strong>
            <div className='mt-2'>
              <button
                id="add-to-home-screen-btn"
                type="button"
                className="btn btn-success me-2"
                onClick={handleAddToHomeScreen}
              >
                Add to Home Screen
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </motion.div>
          )}

      </Layout>
    </div>
  )
}

export default LoginForm