/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from 'socket.io-client'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify';
import Setting from "./Setting";

const Nav = () => {

  const auth = localStorage.getItem('user');
  const [visibility, setVisibility] = useState('')
  const [messageDisplay, setMessageDisplay] = useState('d-none')
  const [groupId, setGroupId] = useState('')
  const [image, setImage] = useState('')
  const [groupName, setGroupName] = useState('')
  const [messageId, setMessageId] = useState('')
  const [newMessage, setNewMessage] = useState([])
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState('')
  const [position, setPosition] = useState('relative')
  const Navigate = useNavigate();
  const [active, setActive] = useState('line3')
  const [left, setLeft] = useState(false)
  const [check, setCheck] = useState(false)
  const [bell, setBell] = useState('')
  const [email,setEmail] = useState('')
  const [settingClass,setSettingClass] = useState('d-none')

  const acceptRef = useRef(null)

  const BASE_URL = process.env.REACT_APP_BASE_URL

  const socket = io(`${BASE_URL}`, { autoConnect: false })


  useEffect(() => {
    if (auth) {
      setUserName(JSON.parse(localStorage.getItem('user')).name)
      setUserId(JSON.parse(localStorage.getItem('user'))._id)
      setEmail(JSON.parse(localStorage.getItem('user')).email)
      setBell(JSON.parse(localStorage.getItem('notification')).display)
    }
  },[])

  


  useEffect(() => {
    getMessage()
  }, [newMessage.length])

  useEffect(() => {
    const socket = io(`${BASE_URL}`)
  const notify = new Audio('audio/notification-22-270130.mp3')
    socket.on('getInvite', data => {
    return (
    setNewMessage((prev) => [...prev, data]),
    data.email === JSON.parse(localStorage.getItem('user')).email ?setTimeout(() => {
       localStorage.setItem('notification',JSON.stringify({'display':'d-flex'}));
       notify.play()
       setBell(JSON.parse(localStorage.getItem('notification')).display)
       toast("Your getting new message")
    }, 10):''
    )
    })
    return () => {
      socket.off('getInvite');
      socket.disconnect()
  }

  },[])
  console.log(userId);
  


  const LogOut = () => {
    localStorage.clear()
    Navigate('/login')
  }

  const getMessage = async () => {
    if (auth) {
      await axios.get(`${BASE_URL}/new-message/${JSON.parse(localStorage.getItem('user')).email}`).then((res) => {
        if (res) {
          setNewMessage(res.data)
          
        }
      })

    }
  }

  const inviteHandle = async () => {

    setCheck(true)

    const formData = new FormData()
    formData.append('groupId', groupId)
    formData.append('userId', JSON.parse(auth)._id)
    formData.append('image', image)
    formData.append('groupName', groupName)
    formData.append('email', JSON.parse(auth).email)
    formData.append('userName', JSON.parse(auth).name)

    await axios.post(`${BASE_URL}/accept-invite`, formData, {
      headers: {
        "Content-Type": "application/json"
      }
    }).then(async (res) => {
      if (res.data) {
        await deleteMessage()
        window.location.reload()

      }
    })
  }

  const deleteMessage = async () => {
    await axios.delete(`${BASE_URL}/delete-invite-data/${messageId}`).then((res) => {
      if (res) {
        Navigate('/')
      }
    })
  }

  const getPosition = () => {
    window.scrollY > 100 ? setPosition('fixed') : setPosition('relative')
  }

  window.addEventListener('scroll', getPosition)

  let sum = 0
  
  for(let i=0;i<newMessage.length;i++){
    sum+=newMessage[i].view
  }

  async function updateView(){
    const formData = new FormData()
    formData.append('view', 0)
  await axios.put(`${BASE_URL}/update-invite-view/${email}`,formData,{
    headers: {
        'Content-Type': 'application/json',
    }
   }).then((res)=>{
    if(res){
      localStorage.setItem('notification',JSON.stringify({'display':'d-none'}))
    }
   }).catch((err)=>{
    if(err){
      toast.error('Request failed')
    }
   })
  }
  
  

  return (
    <>
      <div className='header w-100 top-0 z-3' style={{ position: position }}>
        <div className="container-fluid d-flex align-items-center">
          <div className='appName'>WebChat</div>
          <div className='navBar w-100 d-flex align-items-center'>
            {auth ? <>
              <div className="bar d-flex w-100 justify-content-evenly fs-3">
                <div className="groups-bar"> <Link to={'/'}>Groups</Link></div>
                <div className="createGroup"> <Link to={'/create-group'}>Create Groups</Link></div>
                <div className='profile cursor-pointer justify-content-center' onMouseLeave={() => { setVisibility('hidden') }} onMouseOver={() => { setVisibility('visible') }}>
                  <div className="profileDiv d-flex align-items-center"  >Profile
                    <span className={"badge badge-light bg-info fs-6 "+ bell}>{sum}</span>
                  </div>
                  <div className="option show position-absolute z-2 mt-6 p-4" style={{ visibility: visibility }}>

                    <div className="newMessage fs-4 p-3" style={{ cursor: 'pointer' }} onClick={() => { setMessageDisplay('d-block'); updateView() }}>Messages</div>
                    <div className="fs-4 d-flex justify-content-center mb-3" onClick={()=>{document.documentElement.setAttribute('setting','show')}}>Setting</div>
                    <button className="logout mb-1 fs-5 m-auto" onClick={() => { LogOut(); window.location.reload() }}>LogOut</button>
                  </div>
                </div>
                <div className=" cursor-pointer show d-flex justify-content-end mx-3 position-absolute end-0">
                  <div onClick={() => {
                    active === 'line3' ? setActive("active line3") : setActive("line3");
                    (active !== "line3" ? document.body.style.overflowY = 'visible' : document.body.style.overflowY = 'hidden');
                    document.body.style.overflowX = 'hidden'
                    setLeft(!left);
                  }} className="show">
                    <svg xmlns="http://www.w3.org/2000/svg" width={21} height={15} overflow={'visible'} viewBox="0 0 21 15" className={active + ' show'} >
                      <rect height="2" width="20" y="0" rx="1" ry="1" className="top-line show"></rect>
                      <rect height="2" width="20" y="5" rx="1" ry="1" className="mid-line show"></rect>
                      <rect height="2" width="20" y="10" rx="1" ry="1" className="bottom-line show"></rect>
                    </svg>
                  </div>
                </div>
              </div>
            </>

              :
              ''}
          </div>
        </div>
      </div>
      <div>

        <motion.div animate={{ marginRight: left ? 0 : -160 }} transition={{ type: "tween" }} initial={{ marginRight: -160 }} className={"res-nav-bar z-2 "}>
          <ul>
            <li className="groups-bar" onClick={() => { setLeft(!left); setActive("line3"); document.body.style.overflow = 'visible' }}> <Link to={'/'}>Groups</Link></li>
            <li className="createGroup" onClick={() => { setLeft(!left); setActive("line3") }}> <Link to={'/create-group'}>Create Groups</Link></li>
            <li className='profile' onMouseLeave={() => { setVisibility('hidden') }}>
              <div className="profileDiv d-flex align-items-center" onMouseOver={() => { setVisibility('visible') }} >Profile
                
                  {/* <i className={"bi bi-bell-fill text-danger "+ bell}></i> */}
                  <span className={"badge badge-light bg-info "+ bell}>{sum}</span>
                
              </div>
              <div className=" position-absolute w-100 start-0 p-2 fs-4">
                <div className="option " style={{ visibility: visibility, boxShadow: '1px 1px 1px,-1px -1px 1px' }}>

                  <div className="newMessage py-2" style={{ cursor: 'pointer', padding: '1rem' }} onClick={() => { setMessageDisplay('d-block');updateView() }}>Messages</div>
                  <div className="fs-4 d-flex justify-content-center mb-3" onClick={()=>{document.documentElement.setAttribute('setting','show')}}>Setting</div>
                  <button className="logout fs-4 py-2 mb-1" onClick={() => { LogOut(); window.location.reload() }}>LogOut</button>
                </div>
              </div>
            </li>
          </ul>
        </motion.div>
      </div>



      <div className={" container card  h-100 position-absolute z-3 pb-5 overflow-hidden fs-3 bg-transparent text-white  " + messageDisplay} style={{ backdropFilter:'blur(5px)' }}>
        <div className=" card-header position-sticky justify-content-between d-flex mt-1" >
          <div className="fs-3 text-dark fw-bold">Your Messages</div>
          <div className="d-flex justify-content-end"><i className="bi bi-x-circle text-danger fs-2" onClick={() => { setMessageDisplay('d-none') }}></i></div>
        </div>
        <div className=" px-4 d-flex justify-content-center pb-4  h-100 card-body " >

          <div className="row h-100 overflow-scroll pb-4 scroll-bar-none">
            {
              newMessage.length > 0 ? newMessage.map((item, index) => {
                return (
                  <>
                  <div className={ " justify-content-center "+(item.view !== newMessage[(index>0?index-1:index)].view?'d-flex':'d-none')} style={{boxShadow: '0px 1px 30px #000000c4 inset'}}>unread message</div>
                    <div className=" d-grid  bg-warning w-100 align-items-center mb-2 bg-opacity-25 col-12 rounded-4">
                      
                        <div className=" fs-3 d-flex row w-100"><span className="w-75">{item.date}</span> <span className="w-25 fs-5 d-flex justify-content-end">{item.time}</span></div>
                        <div className=" d-flex justify-content-center mb-3">Hey {userName}, I am {item.userName} Inviting you to join {item.groupName} Group</div>
                      <div className="d-flex justify-content-evenly mb-3">
                        <button className="btn btn-success fs-4" ref={acceptRef} onClick={async () => { getMessage(); groupId !== '' && groupName !== '' ? await inviteHandle() : setGroupId(item.groupId); setImage(item.image); setGroupName(item.groupName); setMessageId(item._id); }} disabled={check}>
                          {check ?
                            <div class="spinner-border spinner-border-sm" style={{ height: '2rem', width: '2rem' }} role="status">
                              <span class="visually-hidden">Loading...</span>
                            </div> : "Accept Invite"}</button>
                        <button className="btn btn-danger fs-4" onClick={async () => { (messageId !== '' ? await deleteMessage() : setMessageId(item._id)); getMessage() }}>Cancel Invite</button>
                      </div>
                    </div>
                  </>
                )
              }) : <h3>there is no message </h3>

            }
          </div>
        </div>
      </div>

      <Setting/>
    </>
  );
}
export default Nav;
