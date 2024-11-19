import React, {  useEffect,  useRef, useState } from "react";
import axios from 'axios'
import {io} from 'socket.io-client'

const Home = () => {




    // const [groupsId,setGroupsId] = useState('')
    const [groups, setGroups] = useState('')
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = JSON.parse(localStorage.getItem('user'))._id
    const userName = JSON.parse(localStorage.getItem('user')).name
    const userEmail = JSON.parse(localStorage.getItem('user')).email

    const [item, setItem] = useState('')
    const [message, setMessage] = useState([])
    const [memberVisibility,setMemberVisibility] = useState('')
    const [chatId, setChatId] = useState('')
    const [visibility, setVisibility] = useState('')
    const [inviteVisibility, setInviteVisibility] = useState('')
    const [email, setEmail] = useState('')
    const [member,setMember] = useState('')
    const [exitId,setExitId] = useState('')
    const [exitVisibility,setExitVisibility] = useState('')

    const inviteRef = useRef(null)
    const okRef = useRef(null)
    
    const socket = io('https://chatsbot-rwv2.onrender.com')
    
    
    useEffect(()=>{  
            socket.on('connection',null);
            socket.on('getMessage',data =>{
                setChatId((prev)=>[...prev ,data ])

                
            })
            return()=>
                socket.off('getMessage');
            
        
    },[chatId])  

    

    const messagesEndRef = useRef(null)
    const ref = useRef(null)

    const groupId = `${item.groupId}`
    const t = new Date()
    const time = `${(t.getHours() > 12 ? (t.getHours()-12>=9 ? "0"+t.getHours()-12:t.getHours()-12):t.getHours())+":"+(t.getMinutes() <=9 ? "0"+t.getMinutes():t.getMinutes())+" "+(t.getHours()>=12?"PM":"AM")}`
    const date = `${(t.getDate() < 10 ? "0" + t.getDate() : t.getDate()) + "-" + (t.getMonth() > 9 ? t.getMonth() : "0" + t.getMonth()) + "-" + t.getFullYear()}`
    
    
    const groupName = `${item.groupName}`
    const image = `${item.image}`

    useEffect(() => {
        if(groups === ''){
            getGroups()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groups])

    useEffect(() => {
            getChatData()
        
    },[message])

    const [checkUser,setCheckUser] = useState('')

    useEffect(()=>{
        if(email !== ''){
            getGroupId();
        }
        
        socket.on('connection',null);
            socket.on('getUserId',data =>{
               setCheckUser((prev)=>[...prev ,data ]) 
                
                
            })
            return()=>
                socket.off('getMessage');
        
    },[email])


    
    const getGroupId = async()=>{
        await axios.get(`https://chatsbot-rwv2.onrender.com/get-groupid-for-invite/${groupId}`).then((res)=>{
            if(res){
                socket.emit('addUserId',res.data)
                
                
            }
        })
    }
    
    

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth'
        })
    }, [chatId])


    const [onlineUsers,setOnlineUsers] = useState([])
    

    useEffect(()=>{
        socket.emit("new-user-add", user);
    socket.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [groups]);



  useEffect(() => {
    // Tab has focus
    const handleFocus = async () => {
      socket.emit("new-user-add", user);
      socket.on("get-users", (users) => {
        setOnlineUsers(users);
      });
    };// Tab closed
    const handleBlur = () => {
      if(userId) {
        socket.emit("offline")   
      }
    };

    // Track if the user changes the tab to determine when they are online
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };   
  }, [groups]);

    const getGroups = async (e) => {
        await axios.get(`https://chatsbot-rwv2.onrender.com/group&useriddata/${userId}`,).then((res) => {
            setGroups(res.data)
            
        })
            .catch((err) => {
                console.log(err);

            })


    }

    

    const sendChat = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('message', message)
        formData.append('time', time)
        formData.append('userId', userId)
        formData.append('groupId', groupId)
        formData.append('userName', userName)
        formData.append('date', date)

        await axios.post(`https://chatsbot-rwv2.onrender.com/send-chat`, formData, {
            headers: {
                "Content-Type": "application/json"
            }
        })

        socket.emit('addMessage',
            {
                message,
                time,
                date,
                groupId,
                userId,
                userName 
            }
        )

        setMessage("")

    }

    const getChatData = async () => {
        await axios.get(`https://chatsbot-rwv2.onrender.com/chat-data/${groupId}`).then(async (res) => {
            if (res) {
                setChatId(res.data)
            }
        })
        

    }


    const inviteHandle = async () => {

        const formData = new FormData()
        formData.append('email', email)
        formData.append('groupId', groupId)
        formData.append('time', time)
        formData.append('groupName', groupName)
        formData.append('date', date)
        formData.append('userName', userName)
        formData.append('image', image)

        await axios.post('https://chatsbot-rwv2.onrender.com/send-invite', formData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            if (res) {
                alert('invite send successfully')
            }
            socket.emit('sendInvite',
                {
                    email,
                    image,
                    time,
                    date,
                    groupId,
                    userId,
                    userName 
                }
            )
        })
    }


    const getMember = async() =>{
        await axios.get(`https://chatsbot-rwv2.onrender.com/get-group-member/${groupId}`).then((res)=>{
            if(res){
                setMember(res.data)
                
            }
        })
    }



    const clickOn = () =>{
        let count =0
    for(let i=0;i<checkUser.length;i++){

        if(checkUser[i].email===email){
            count++
        }
    } 

    if(count===0){
          
            inviteHandle()
        }
        else{
            alert('user already exists in group');
            setInviteVisibility('hidden')
            
        }; 
    
}


const exitGroup = async() =>{
    await axios.delete(`https://chatsbot-rwv2.onrender.com/exit-from-group/${exitId}`)
  }
  

  const groupExitConform = (e) =>{
    e.preventDefault()
    exitGroup()
    window.location.reload()
  }


   let newDate = ''
    return (
        <>
            <div className="groupsDiv">

                <div className="groups" style={{ height: window.innerWidth>550?(window.innerHeight)/1.165 + "px":(window.innerHeight) - 80 + "px", maxWidth:window.innerWidth>550?(window.innerWidth)/2.4+'px':'-webkit-fill-available'}}>
                    <div className="yourGroups" style={{maxWidth:window.innerWidth>550?(window.innerWidth)/2.4+'px':'-webkit-fill-available'}}>

                        {groups.length > 0 ? groups.map((item, index) =>
                            <ul key={item._id} onClick={async (e) => {getMember();setItem(item); getChatData(); setExitId(item._id); messagesEndRef.current?.scrollIntoView(); }} style={{maxWidth:window.innerWidth>550?(window.innerWidth)/2.4+'px':'-webkit-fill-available'}}>
                                <li><img alt='...' src={item.image} /></li>
                                <li><span>{item.groupName}</span></li>
                            </ul>
                        )
                            : <h1>no group</h1>}
                    </div>
                </div>

                <div className="group-chat" style={{ height: window.innerWidth>550?(window.innerHeight)/1.165 + "px":(window.innerHeight) - 80 + "px", marginTop: window.innerWidth>550?("-" + (((window.innerHeight)/1.165) + (window.innerWidth>=551&&window.innerWidth<=768?9:window.innerWidth>=769&&window.innerWidth<=1024?14:20))) + "px":0 ,width:window.innerWidth>550?(window.innerWidth)/1.8+'px':'-webkit-fill-available'}}>
                    <div>
                        <div className="chatDiv">
                            {item === '' ? <h1 className="ifChat">Display chat</h1>
                                : <><ul>
                                    <li onMouseLeave={() => { setVisibility('hidden') }}><img alt="..." src={item.image} onMouseOver={() => { setVisibility('visible') }} />
                                        <div className="groupMenu" style={{ visibility: visibility }} >
                                            <div className="invite" onClick={() => { setInviteVisibility('visible') }} style={{ cursor: 'pointer' }}>invite</div>
                                            <div className="members"  onClick={() => { setMemberVisibility('visible'); getMember() }} style={{ cursor: 'pointer' }}>Members</div>
                                            <div className="exitGroup" onClick={()=>{setExitVisibility('visible')}}  style={{ cursor: 'pointer',color:'red'}}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" style={{    position: 'relative',top: '.3rem', right: '.5rem'}} fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
  <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
</svg>
Exit</div>
                                        </div>
                                    </li>
                                    <li><span>{item.groupName}</span></li>
                                    <li style={{    position: 'relative',left: '25%'}}>online members
                                        <div className="onlineMember">
                                            {
                                            
                                                onlineUsers.map((item)=>(
                                                
                                                    (item.userName !== userName?
                                                        
                                                        
                                                        (<>
                                                       <ul>
                                                        <li><div className="onlineCircle"></div><div>{item.userName}</div></li>
                                                       </ul>
                                                        </>)
                                                     :'')
                                                
                                                
                                            )  
                                                )
                                            }
                                        </div>
                                    </li>
                                </ul>
                                    <div className="chatSection">
                                        <div className="messageDiv" style={{ maxHeight:window.innerWidth>550? ((window.innerHeight )/1.41)+(window.innerWidth>=551&&window.innerWidth<=768?9:window.innerWidth>=769&&window.innerWidth<=1024?14:-50)+ "px": (window.innerHeight ) - 160 + "px"}} ref={ref} >
                                            {

                                                chatId.length > 0 ? chatId.map((item, index) =>(
                                                    
                                                    (item.groupId === groupId ?
                                                        <>
                                        
                                                        {item.date !== newDate ? <div className="chatDate">{(newDate=item.date)===date?'Today':newDate=item.date}</div>:''}
                                                            <div className={userId === item.userId ? 'messages' : 'otherMessage'}>
                                                                <div className="userName">{userId !== item.userId ?item.userName:''}</div>
                                                                <div className="msg">{item.message}</div>
                                                                <div className="msgTime">{item.time}</div>
                                                            </div>
                                                            <div ref={messagesEndRef} />
                                                        </> : '')
                                                ))
                                                    : ''
                                            }
                                        </div>
                                        <textarea placeholder="type a massage" value={message}  onChange={(e) => { setMessage(e.target.value) }} />
                                        {message !== "" ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill sendIcon" style={{ color: '#8c60ff' }} viewBox="0 0 16 16" onClick={(e) => { sendChat(e);getChatData()}}>
                                            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
                                        </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill sendIcon" viewBox="0 0 16 16">
                                            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
                                        </svg>}
                                    </div>
                                </>}
                            <div className="inviteDiv" style={{ top: '25%', left:'25%', visibility: inviteVisibility }}>
                                <input type="email" className="inviteEmail" placeholder="example@gmail.com" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                                <div className="btnDiv">
                                    <button className="inviteBtn" ref={inviteRef} onClick={() => { setInviteVisibility('hidden'); setEmail('');clickOn();inviteRef.current.innertext = 'please wait ...' }}  disabled={email === userEmail ? true : false}>Invite</button>
                                    <button className="cancelBtn" onClick={() => { setInviteVisibility('hidden') }}>Cancel</button>
                                </div>
                            </div>
                            <div className="memberDiv" style={{height:window.innerWidth>550? ((window.innerHeight )/1.41)+(window.innerWidth>=551&&window.innerWidth<=768?9:window.innerWidth>=769&&window.innerWidth<=1024?14:0)+ "px": (window.innerHeight ) - 160 + "px",top:window.innerWidth>550?(window.innerWidth)/18+'px':'8rem',visibility:memberVisibility,width:window.innerWidth>550?(window.innerWidth)/1.8+'px':'-webkit-fill-available'}}>
                            <div className="closeBtnDiv" style={{float:'inline-end'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" color="red" fill="currentColor" style={{cursor: 'pointer',position: 'relative',float: 'inline-end',top: '1rem',right:'1rem'}} className="bi bi-x-lg closeBtn" viewBox="0 0 16 16" onClick={()=>{setMemberVisibility('hidden')}} >
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
</svg>
                </div>
                <div className="memberList">
                    {
                        member.length>0? member.map((item,index) =>
                            <div className="members">
                            {item.email} <span style={{position:'absolute',right:0}}>~{item.userName}</span>
                            </div>
                        ):''
                    }
                </div>
                            </div>
                            {/* groupexit conform */}
                            <div className="exitConform" style={{ top: '25%', left:'25%', visibility: exitVisibility }}>
                                <div className="text">{userName} are sure exit from this group</div>
                                <div className="btnDiv">
                                    <button className="okBtn" ref={okRef} onClick={(e)=>{setExitVisibility('hidden');groupExitConform(e);okRef.current.innertext = 'please wait ...'}}>ok</button>
                                    <button className="cancelBtn" onClick={()=>{setExitVisibility('hidden')}}>cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;
