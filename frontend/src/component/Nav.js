/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {io} from 'socket.io-client'
import {motion} from 'framer-motion'

const Nav = () =>{

  const auth = localStorage.getItem('user');
  const [visibility,setVisibility] = useState('')
  const [messageVisibility,setMessageVisibility] = useState('hidden')
  const [bell,setBell] = useState('')
  const [groupId,setGroupId] = useState('')
  const [image,setImage] = useState('')
  const [groupName,setGroupName] = useState('')
  const [messageId,setMessageId] = useState('')
    const [newMessage,setNewMessage] = useState('')
    const [userName,setUserName] = useState('')
    const [userId,setUserId] = useState('')
    const [position,setPosition] = useState('')
  const Navigate = useNavigate();
  const [active,setActive] = useState('line3')
  const [left,setLeft] = useState(false)

  const accepiRef = useRef(null)

  const socket = io.connect('https://chatsbot-rwv2.onrender.com')

  useEffect(()=>{
    if(auth){
    setUserName(JSON.parse(localStorage.getItem('user')).name)
    setUserId(JSON.parse(localStorage.getItem('user'))._id)
    }
  })

    // const userEmail = JSON.parse(localStorage.getItem('user')).email
    // const userName = JSON.parse(localStorage.getItem('user')).name
    // const userId = JSON.parse(localStorage.getItem('user'))._id
    

    useEffect(()=>{
      getMessage()
    },[newMessage.length])

    useEffect(()=>{  
      socket.on('connection',null);
      socket.on('getInvite',data =>{
          setNewMessage((prev)=>[...prev ,data ])
          if(auth && data.email ===(JSON.parse(auth).email)){
            setBell('visible')
          }
          
          
      })
      return()=>
          socket.off('getMessage');
      
  
},[]) 
    

  const LogOut = () =>{
    localStorage.clear()
    Navigate('/login')
  }

  const getMessage = async() =>{
    if(auth){
      await axios.get(`https://chatsbot-rwv2.onrender.com/new-message/${JSON.parse(localStorage.getItem('user')).email}`).then((res)=>{
        if(res){
            setNewMessage(res.data)
        }
    })
    
    }
}

const inviteHandle = async()=>{
  const formData = new FormData()
  formData.append('groupId',groupId)
  formData.append('userId',userId)
  formData.append('image',image)
  formData.append('groupName',groupName)
  formData.append('email',JSON.parse(auth).email)
  formData.append('userName',JSON.parse(auth).name)

  await axios.post(`https://chatsbot-rwv2.onrender.com/accept-invite`,formData,{
    headers:{
      "Content-Type":"application/json"
    }
  }).then(async(res)=>{
    if(res){
      deleteMessage()
      window.location.reload()
    }
  })
}

const deleteMessage = async() =>{
  await axios.delete(`https://chatsbot-rwv2.onrender.com/delete-invite-data/${messageId}`).then((res)=>{
    if(res){
      Navigate('/')
    }
  })
}

const getPosition = () =>{
  document.documentElement.scrollTop>70?setPosition('fixed'):setPosition('relative')
}

window.addEventListener('scroll',getPosition)

    return(
        <>
        <div className="App">
      <div className='header' style={{position:position}}>
        <div className='appName'>ChatsBot</div>
        <div className='navbar'>
          {auth ? <ul style={{position:'absolute',right:"5rem"}}>
           { window.innerWidth>550?<>
            <li className="groups-bar"> <Link to={'/'}>Groups</Link></li>
            <li className="createGroup"> <Link to={'/create-group'}>Create Groups</Link></li>
            <li className='profile' onMouseLeave={()=>{setVisibility('hidden')}}>
              <div className="profileDiv" onMouseOver={()=>{setVisibility('visible')}} >Profile
              <div className="bell">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" style={{visibility:bell}}  fill="currentColor" class="bi bi-bell-fill bellIcon" viewBox="0 0 16 16">
  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
</svg>
                  </div>
              </div>
              <div className="option" style={{visibility:visibility}}>
                
              <div className="newMessage"  style={{cursor:'pointer',fontSize:'2rem',padding:'1rem'}} onClick={()=>{setMessageVisibility('visible');setBell('hidden')}}>Messages</div>
                  <button className="logout" onClick={()=>{LogOut();window.location.reload()}}>LogOut</button>
                </div>
            </li>
            </>:<>
            <li onClick={()=>{active === 'line3'?setActive("active line3"):setActive("line3");
              (active!=="line3"?document.body.style.overflow='visible':document.body.style.overflow='hidden');
              setLeft(!left);
              }}>
            <svg xmlns="http://www.w3.org/2000/svg"width={21} height={15} overflow={'visible'} viewBox="0 0 21 15" className={active}>
            <rect height="2" width="20" y="0" rx="1" ry="1" className="top-line"></rect> 
            <rect height="2" width="20" y="5" rx="1" ry="1" className="mid-line"></rect> 
            <rect height="2" width="20" y="10" rx="1" ry="1" className="bottom-line"></rect>
            </svg>
            </li>
            </>}
            
            </ul>:
            <ul style={{position:'absolute',right:"5rem"}}>
            <li className='signup'><Link to={'/signup'}>SignUp</Link></li>
            <li className='login'><Link to={'/login'}>LogIn</Link></li>
            {/* <li onClick={loginWithRedirect()}>LogIn</li> */}
          </ul>}
        </div>
      </div>
    </div>
    <div>
    <motion.div animate={{x:left?0:window.innerWidth}} transition={{type:"tween"}} initial={{x:window.innerWidth}} className="res-nav-bar">
                  <ul>
                  <li className="groups-bar" onClick={()=>{setLeft(!left);setActive("line3");document.body.style.overflow='visible'}}> <Link to={'/'}>Groups</Link></li>
            <li className="createGroup" onClick={()=>{setLeft(!left);setActive("line3")}}> <Link to={'/create-group'}>Create Groups</Link></li>
            <li className='profile' onMouseLeave={()=>{setVisibility('hidden')}}>
              <div className="profileDiv" onMouseOver={()=>{setVisibility('visible')}} >Profile
              <div className="bell">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" style={{visibility:bell}}  fill="currentColor" class="bi bi-bell-fill bellIcon" viewBox="0 0 16 16">
  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
</svg>
                  </div>
              </div>
              <div className="option" style={{visibility:visibility ,boxShadow:'1px 1px 1px,-1px -1px 1px'}}>
                
              <div className="newMessage"  style={{cursor:'pointer',fontSize:'2rem',padding:'1rem'}} onClick={()=>{setMessageVisibility('visible');setBell('hidden')}}>Messages</div>
                  <button className="logout" onClick={()=>{LogOut();window.location.reload()}}>LogOut</button>
                </div>
            </li>
                  </ul>
                </motion.div>
                </div>
                


    <div className="newMessageDiv" style={{height:((window.innerHeight / 10)-25 ) + "rem",width:((window.innerHeight / 10)) + "rem",top:((window.innerHeight / 10) - 20)/4 + "rem",visibility:messageVisibility}} >
                <div className="closeBtnDiv" style={{float:'inline-end'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" color="red" fill="currentColor" style={{cursor:'pointer'}} class="bi bi-x-lg closeBtn" viewBox="0 0 16 16" onClick={()=>{setMessageVisibility('hidden')}} >
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
</svg>
                </div>
                    <div className="messDiv">
                        {
                            newMessage.length>0? newMessage.map((item,index)=>{
                                return(
                                    <>
                                    <div className="message">
                                      <div>
                                      <div className="dateDiv" style={{padding:'1rem'}}>{item.date}</div> <div className="timeDiv">{item.time}</div> Hey {userName}, I am {item.userName} Inviting you to join {item.groupName} Group
                                      </div>
                                      <div className="btnDiv">
                                        <button className="acceptBtn" ref={accepiRef} onClick={async()=>{setGroupId(item.groupId);setImage(item.image);setGroupName(item.groupName);getMessage();accepiRef.current.innertext = 'please wait ...';groupId!==''&&image!==''&&groupName!==''?await inviteHandle():setGroupId(item.groupId);setImage(item.image);setGroupName(item.groupName);setMessageId(item._id);}}>Accept Invite</button>
                                        <button className="cancelBtn" onClick={async()=>{(messageId!==''?await deleteMessage() :setMessageId(item._id));getMessage()}}>Cancel Invite</button>
                                      </div>
                                    </div>
                                    </>
                                )
                            }):<h1>there is no message</h1>

                        }
                    </div>
                </div>
        </>
    );
}
export default Nav;
