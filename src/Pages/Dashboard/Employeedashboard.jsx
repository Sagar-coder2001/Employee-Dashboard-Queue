import React, { useEffect, useState, useRef } from 'react';
import './Employeedashboard.css';
import Layout from '../../Cpmponents/Layout';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const Employeedashboard = () => {
  const location = useLocation();
  const { tokenid, username } = location.state || {};
  const [token, setToken] = useState(tokenid || '');
  const [user, setUsername] = useState(username || '');
  const [acrooms, setAcRooms] = useState([]);
  const [nonacrooms, setNonAcRooms] = useState([]);
  const [roomtype, setRoomType] = useState();
  const [seatOptions, setSeatOptions] = useState([]);
  const [eventsource, setEventSource] = useState(null);
  const [waitingContact, setWaitingContact] = useState([]);
  const [waitingtime, setWaitingtime] = useState('');
  const [waitingUser, setWaitingUser] = useState([]);
  const [tableSize, setTableSize] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [noofpeoples, setnooffpeoples] = useState([]);
  const [callingusername, setCallingUserName] = useState([]);
  const [callingusercontact, setCallingUserContact] = useState([]);
  const [updatetime, setUpdateTime] = useState('')
  const [managequeue, setManageQueue] = useState('');
  const [showcard, setShowCard] = useState(true);
  const [notificationmsg, setNotificationmsg] = useState('');

  const navigate = useNavigate();
  const cardRef = useRef(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formdata = new FormData();
        formdata.append('token', token);
        formdata.append('username', user);

        const response = await fetch('http://192.168.1.25/Queue/Hotel_Admin/table.php?for=get', {
          method: 'POST',
          body: formdata,
        });
        const data = await response.json();
        if (data.Authentication === false) {
          navigate('/');
        }
        setAcRooms(data.AC || []);
        setNonAcRooms(data.NON_AC || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [token, user, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setSelectedUser(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedUser]);

  const handleRoomTypeChange = (e) => {
    const selectedRoomType = e.target.value;
    setRoomType(selectedRoomType);
    setTableSize('');
    setSeatOptions(selectedRoomType === '1' ? acrooms : nonacrooms);
  };

  const handleTableSizeChange = (e) => {
    // fetchQueue();
    setTableSize(e.target.value);
  };

  useEffect(() => {
    if (tableSize && roomtype) {
      fetchQueue();
    }
  }, [tableSize, roomtype]);

  const fetchQueue = () => {
    stopfunction();
    const eventSource = new EventSource(`http://192.168.1.25/Queue/Hotel_Employee/fetchQueue.php?username=${user}&token=${token}&table_size=${tableSize}&table_type=${roomtype}`);

    setEventSource(eventSource);
    eventSource.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      console.log(newMessage);
      setNotificationmsg(newMessage.Notification.Message);
      if (!newMessage.Status) {
        eventSource.close();
      }

      if (newMessage.Notification.Message) {
        toast(newMessage.Notification.Message);
      }

      if (newMessage.Authentication === false) {
        navigate('/');
      }
      setWaitingContact(newMessage.Waiting?.Contact || []);
      setWaitingUser(newMessage.Waiting?.Name || []);
      setWaitingtime(newMessage.Waiting?.Time || []);
      setnooffpeoples(newMessage.Waiting?.NumberOfPeople || []);
      setCallingUserContact(newMessage.Calling?.Contact || []);
      setCallingUserName(newMessage.Calling?.Name || []);
    };
  };

  const stopfunction = () => {
    if (eventsource) {
      eventsource.close();
      setEventSource(null);
    }
  };

  const tableData = waitingUser.map((user, index) => ({
    srno: index + 1,
    waitingUser: user || 'N/A',
    waitingContact: waitingContact[index] || 'N/A',
    waitingtime: waitingtime[index] || 'N/A',
    roomType: roomtype === '1' ? 'AC' : 'Non AC',
    noofpeoples: noofpeoples[index] || 'N/A',
  }));

  const callingData = callingusername.map((user, index) => ({
    srno: index + 1,
    callingUser: user || 'N/A',
    callingContact: callingusercontact[index] || 'N/A',
  }));

  const handleRowClick = (row) => {
    window.scrollTo(0, 0);
    setSelectedUser(row);
    setShowCard(true);
  };


  const submitusertime = () => {
    setShowCard(true)
    const fetchData = async () => {
      try {
        const formdata = new FormData();
        formdata.append('token', token);
        formdata.append('username', user);
        formdata.append('contact', selectedUser.waitingContact);
        formdata.append('timeChange', updatetime);

        const response = await fetch('http://192.168.1.25/Queue/Hotel_Employee/queueManage.php', {
          method: 'POST',
          body: formdata,
        });
        const data = await response.json();
        if (data.Status === true) {
          setShowCard(false);
        }
        if (data.Authentication === false) {
          navigate('/');
        }
        console.log(data)

      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }

  const updatealoteuser = (abc, row) => {
    const fetchData = async () => {
      try {
        const formdata = new FormData();
        formdata.append('token', token);
        formdata.append('username', user);
        formdata.append('contact', row);

        const response = await fetch(`http://192.168.1.25/Queue/Hotel_Employee/queueManage.php?waiting=${abc}`, {
          method: 'POST',
          body: formdata,
        });
        const data = await response.json();
        if (data.Authentication === false) {
          navigate('/');
        }
        console.log(data)
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }

  const handlequeueupdate = (e) => {
    setManageQueue(e.target.value)
  }

  const handlemanagequeue = () => {
    const fetchData = async () => {
      try {
        const formdata = new FormData();
        formdata.append('token', token);
        formdata.append('username', user);
        formdata.append('contact', selectedUser.waitingContact);
        formdata.append('queueUpdate', managequeue)

        const response = await fetch(`http://192.168.1.25/Queue/Hotel_Employee/queueManage.php`, {
          method: 'POST',
          body: formdata,
        });
        const data = await response.json();
        if (data.Authentication === false) {
          navigate('/');
        }
        if (data.Status === true) {
          setShowCard(false);
        }
        console.log(data)

      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }


  // Get current page data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const handlePageClick = (page) => {
    setCurrentPage(page);
    paginate(page);
  };

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      paginate(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < itemsPerPage) {
      setCurrentPage(currentPage + 1);
      paginate(currentPage + 1);
    }
  };

  return (
    <div>
      <Layout>
        <div className="employee-dashoboard">
       
          <div className="employee">
            {
          (
                <ToastContainer
                position="top-right"
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
              )
            }
            <div className="row mt-5 container-fluid">
              <div className="col-md-6 text-center">
                <div className="rooms" style={{ fontSize: '20px' }}><strong>Rooms :</strong></div>
                <div className="input-container text-start">
                  <label className="radio-label">
                    <input type="radio" name="room" value="1" className="radio-input" onChange={handleRoomTypeChange} />
                    <span className="custom-radio"></span>
                    AC
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="room" value="0" className="radio-input" onChange={handleRoomTypeChange} />
                    <span className="custom-radio"></span>
                    Non AC
                  </label><br />
                </div>
              </div>
              <div className="col-md-6 text-center">
                <div className="table">
                  <label htmlFor="table" style={{ fontSize: '20px' }}><strong>Seat No :</strong></label><br />
                  <select name="table" id="table" value={tableSize} className='selecttable' onChange={handleTableSizeChange}>
                    <option>Select table size</option>
                    {seatOptions.length > 0 ? (
                      seatOptions.map((seat, index) => (
                        <option key={index} value={seat} style={{ color: 'black' }}>
                          {seat}
                        </option>
                      ))
                    ) : (
                      <option disabled>No Seats Available</option>
                    )}
                  </select>
                </div>
              </div>
              {/* <div className="btn-select text-center">
                <button className='queuefetchbtn' onClick={fetchQueue}>Submit</button>
              </div> */}
            </div>

            {/* Calling Users */}

            <div className="waiting-user text-center mt-3">
              <span style={{ fontSize: '25px' }}><strong>Calling Users</strong></span>
              <div className="callinguser-container d-flex justify-content-center flex-column mt-3">
                {callingData.length > 0 ? (
                  callingData.map((row) => (
                    <div className="user-card" key={row.srno} style={{ marginBottom: '10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', width: '96%', border: '1px solid #ccc', borderRadius: '5px', padding: '10px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
                      <div className="user-card-header" style={{ marginBottom: '10px' }}>
                        <h5 style={{ margin: '5px 0px', fontSize: '23px' }}>Calling...</h5>
                        <h6 style={{ margin: '5px 0px', fontSize: '20px' }}><strong>UserName:</strong> {row.callingUser}</h6>
                        <p style={{ margin: 0, fontSize: '20px' }}><strong>Contact:</strong> {row.callingContact}</p>
                        <hr />
                        <div className="updatedata-container ">
                          <button className='queuefetchbtn' style={{ margin: '0px 4px' }} onClick={() => updatealoteuser('aloting', row.callingContact)}>Alote</button>
                          <button className='queuefetchbtn' style={{ margin: '0px 4px' }} onClick={() => updatealoteuser('deleting', row.callingContact)}>Delete</button>
                          <button className='queuefetchbtn' style={{ margin: '0px 4px' }} onClick={() => updatealoteuser('waiting', row.callingContact)}>Back To Queue</button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : <span>There Are No Data In Calling</span>}
              </div>
            </div>

            {/* Waiting Users */}
            <div className="waiting-user text-center mt-3">
              <div className="table-container">
                <span style={{ fontSize: '25px' }}><strong>All Waiting Users</strong></span>
                <table className="custom-table">
                  <thead>
                    <tr style={{ backgroundColor: 'white' }}>
                      <th style={{ padding: '10px' }}>Sr. No</th>
                      <th>Username</th>
                      {/* <th>Contact</th> */}
                      <th>Time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((row) => (
                        <tr key={row.srno} onClick={() => handleRowClick(row)} style={{ cursor: 'pointer', position: 'relative' }}>
                          <td>{row.srno}</td>
                          <td>{row.waitingUser}</td>
                          {/* <td>{row.waitingContact}</td> */}
                          <td>{row.waitingtime}</td>
                          <td>
                            <span style={{ paddingRight: '20px' }} onClick={(e) => {
                              e.stopPropagation();
                              updatealoteuser('calling', row.waitingContact);
                            }}><i className="fa-solid fa-arrow-up"></i></span>

                            <span className='data-bs-toggle="modal" data-bs-target="#exampleModal"' onClick={(e) => {
                              e.stopPropagation();
                              updatealoteuser('delete', row.waitingContact);
                            }}><i className="fa-solid fa-trash text-danger"></i></span></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* pagination  */}

            <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-center">
                {/* Previous Button */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <a className="page-link" href="#" onClick={(e) => { e.preventDefault(); handlePreviousClick(); }} tabIndex="-1">Previous</a>
                </li>

                {/* Page Number Buttons */}
                {Array.from({ length: currentPage }, (_, index) => (
                  <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <a
                      className="page-link"
                      href="#"
                      onClick={(e) => { e.preventDefault(); handlePageClick(index + 1); }}
                    >
                      {index + 1}
                    </a>
                  </li>
                ))}

                {/* Next Button */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <a className="page-link" href="#" onClick={(e) => { e.preventDefault(); handleNextClick(); }}>Next</a>
                </li>
              </ul>
            </nav>


            {/* User Details Card */}
            {selectedUser && (
              <div className="user-details-card text-center" ref={cardRef} style={{ display: !showcard ? 'none' : 'block' }}>
                <form>
                  <h3>User Details</h3>
                  <div className='mb-2 fs-5'>Your Queue-No: {selectedUser.srno}</div>
                  <div className="row mb-2">
                    <label htmlFor="username" className="col-4 col-form-label text-start">Username:</label>
                    <div className="col-8">
                      <input type="text" value={selectedUser.waitingUser} className="form-control" readOnly />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <label htmlFor="contact" className="col-5 col-form-label text-start">Contact No:</label>
                    <div className="col-7">
                      <input type="text" value={selectedUser.waitingContact} className="form-control" readOnly />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <label htmlFor="room-type" className="col-5 col-form-label text-start">Room Type:</label>
                    <div className="col-7">
                      <input type="text" value={selectedUser.roomType} className="form-control" readOnly />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <label htmlFor="noofpeoples" className="col-7 col-form-label text-start">Number of People:</label>
                    <div className="col-5">
                      <input type="text" value={selectedUser.noofpeoples} className="form-control" readOnly />
                    </div>
                  </div>
                  <hr />

                  <div className="input-group row mb-3">
                    <label htmlFor="waiting-time" className="col-5 col-form-label text-start">Waiting Time:</label>
                    <input type="number" value={updatetime} style={{ borderRadius: '4px' }} onChange={(e) => setUpdateTime(e.target.value)} className="col-2 form-control" />
                    <span className='queuefetchbtn col-4' style={{ margin: '0px 5px', }} onClick={submitusertime}>Submit</span>
                  </div>
                  <hr></hr>
                  <div className="input-group row mb-3">
                    <label htmlFor="waiting-time" className="col-5 col-form-label text-start">Queue manage:</label>
                    <select name="manage-queue" className='col-2 selecttable' style={{ width: '60px' }} value={managequeue} onChange={handlequeueupdate}>
                      {
                        tableData.map((val) => (
                          <option key={val.srno} value={val.srno}>
                            {val.srno}
                          </option>
                        ))
                      }
                    </select>

                    <span className='queuefetchbtn col-4' onClick={handlemanagequeue} style={{ margin: '0px 5px', borderRadius: '4px' }}>Submit</span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedUser(null)}
                    style={{
                      border: 'none',
                      background: 'none',
                      fontSize: '1.2rem',
                      color: 'red',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    &#10006;
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </Layout >
    </div >
  );
};

export default Employeedashboard;
