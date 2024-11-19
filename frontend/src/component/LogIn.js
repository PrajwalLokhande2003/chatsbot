/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LogIn = () =>{
    const navigate = useNavigate()
    // useEffect(()=>{
    //     const authn = localStorage.getItem('user');
    //     if(authn){
    //         navigate('/')
    //     }
    // },[])

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const emailEvent = (e) =>{
        setEmail(e.target.value)
    }
    const passwordEvent = (e) =>{
        setPassword(e.target.value)
    }

    const formData = new FormData()
    formData.append('email',email)
    formData.append('password',password)


    const logIn = async(e) =>{
        e.preventDefault()
        
        await axios.post('https://chatsbot-rwv2.onrender.com/login',formData,{
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
    return(
    <>
    <div className="loginMain" style={{margin:window.innerWidth>550?"5% 25%":"25% 5%"}}>
        <form className="loginForm">
            <input type="email" className="email" placeholder="enter email" value={email} onChange={emailEvent}/>
            <input type="password" className="password" placeholder="enter password" value={password} onChange={passwordEvent}/>
            <button type="submit" className="submitBtn" onClick={logIn}>LogIn</button>
        </form>
    </div>
    </>
    )
}

export default LogIn;
