import React, { useEffect, useState } from 'react'
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Cpmponents/Layout';
import { useDispatch } from 'react-redux';
import { changetoken } from '../../Features/Tokenslice';
import userimg from '..//../assets/user.jpg'

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

      const response = await fetch(`http://192.168.1.25/Queue/login.php?do=login&hotel_id=${filepath}`, {
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
    setTimeout(() => {
      setShowErr(false)
    }, 400000);
  },)

  return (
    <div>
      <Layout>
        <div className="login-container">
          
              <div className="card-container">
              {
            showerr ? (
              <div className='showerr'>
                <div>
                  <strong className='text-danger fs-2'>Error! </strong><span style={{ fontSize: '18px' }}>Invalid Username and Password</span>
                  <i class="fa-solid fa-xmark"onClick={() => setShowErr(false)} style={{marginLeft:'15px', fontSize:'25px', color:"red"}}></i> 
                </div>
              </div>
            )
              :
              ''
          }
                <form>
                  <div style={{textAlign:'center'}}>
                  <img src={userimg} alt="" />
                  <h4 className='text-center fs-2'>Employee Login</h4>
                  </div>
          
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label"> <strong>Username</strong></label>
                    <input type="email" className="form-control" value={userdetails.username} onChange={onchangetext} id="username" name='username' />

                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label"><strong>Password</strong></label>
                    <input type="password" className="form-control" value={userdetails.password} onChange={onchangetext} name='password' id="password" />

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
      </Layout>
    </div>
  )
}

export default LoginForm