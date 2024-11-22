import React, { useEffect, useState } from 'react'
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Cpmponents/Layout';
import { useDispatch } from 'react-redux';
import { changetoken } from '../../Features/Tokenslice';

const LoginForm = () => {
  const [userdetails, setUserDetails] = useState({
    username: '',
    password: ''
  })
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showerr, setShowErr] = useState(false);
  const [filepath , setfilepath] = useState('');


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
  },[])



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

      if (data.Status === true) {
        navigate('/Employeedashboard', { state: { tokenid: data.Token, username: userdetails.username } });
      }
      if (data.Status === false) {
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

  return (
    <div>
      <Layout>
        <div className="login-container">
          <div className="card-container">
            <form>
              <h4 className='text-center fs-2'>Employee Login</h4>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input type="email" className="form-control" value={userdetails.username} onChange={onchangetext} id="username" name='username' />

              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" value={userdetails.password} onChange={onchangetext} name='password' id="password" />

              </div>
              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                <label htmlFor="form-check-label">Check me out</label>
              </div>
              <div className="submit-btn">
                <button type="submit" className="btn btn-primary" onClick={submitDetails}>Submit</button>
              </div>
            </form>
          </div>
        </div>
        {
          showerr && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <strong>Error!</strong>Username and Password Invalid
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setShowErr(false)}></button>
            </div>
          )
        }
      </Layout>

    </div>
  )
}

export default LoginForm