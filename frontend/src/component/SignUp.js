import React, { useEffect , useRef, useState } from "react";
import { useNavigate} from 'react-router-dom'
import axios from 'axios'
import {io} from 'socket.io-client'

const SignUp = () =>{
    const socket = io.connect('http://localhost:5080')
    
    const navigate = useNavigate()
    useEffect(()=>{
        const authn = localStorage.getItem('user');
        if(authn){
            navigate('/')
        }
    },[])

    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [checkEmail,setCheckEmail] = useState('')
    const [visibility,setVisibility] = useState('')
    const [color,setColor] = useState('')
    const [check,setCheck] = useState(false)

    const div = useRef(null)

    

    

    useEffect(()=>{
        if(email !== ''){
            getEmailId();
        }
        
        socket.on('connection',null);
            socket.on('getEmailId',data =>{
               setCheckEmail(data) 
                
                
            })
            return()=>
                socket.off('getMessage');
        
    },[email])


    
    const getEmailId = async()=>{
        await axios.get(`https://chatsbot-rwv2.onrender.com/check-email-account/${email}`).then((res)=>{
            if(res){
                socket.emit('addEmailId',res.data)
                console.log(res.data);
                
               
            }
        })
    }

    const nameEvent = (e) =>{
        setName(e.target.value)
    }
    const emailEvent = (e) =>{
        setEmail(e.target.value)
    }
    const passwordEvent = (e) =>{
        setPassword(e.target.value)
    }


    const signUp = async(e) =>{

        setCheck(true)

        const formData = new FormData()
    formData.append('name',name)
    formData.append('email',email)
    formData.append('password',password)
        
        await axios.post('https://chatsbot-rwv2.onrender.com/signup',formData,{
            headers:{
                'Content-Type':'application/json'
            }
        }).then(async (res)=>{   
        if(res){
            localStorage.setItem('user',JSON.stringify(res.data))
            navigate('/')
        }
        
        })
    }

    const clickOn = (e) =>{
        e.preventDefault()
        
        if(checkEmail.length>0){
            div.current.innerText = 'this email already use plese try another';
            setVisibility('visible')
            setColor('#fa2c2c')
        }else{
            setVisibility('visible')
            div.current.innerText = 'available';
            setColor('green')
            signUp()
        }
    }


    return(
    <>
    <div className="signupMain" style={{margin:window.innerWidth>550?"5% 25%":"25% 5%"}}>
        <form className="signupForm">
            <input type="name" className="name" value={name} onChange={nameEvent} placeholder="enter name" required/>
            <input type="email" className="email" value={email} onChange={(e)=>{emailEvent(e);setVisibility('hidden')}} placeholder="enter email" required/>
            <div className="check" ref={div} style={{visibility:visibility,color:color}}></div>
            <input type="password" className="password" value={password} onChange={passwordEvent} placeholder="enter password" required/>
            <button type="submit" className="submitBtn" onClick={(e)=>{clickOn(e)}} disabled={check}>{check?<div class="spinner-border spinner-border-sm" role="status">
  <span class="visually-hidden">Loading...</span>
</div>:"SignUp"}</button>
        </form>
    </div>
    </>
    )
}

export default SignUp;