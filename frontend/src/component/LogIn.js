/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

const LogIn = () => {
    const navigate = useNavigate()
    // useEffect(()=>{
    //     const authn = localStorage.getItem('user');
    //     if(authn){
    //         navigate('/')
    //     }
    // },[])

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [check, setCheck] = useState(false)

    const BASE_URL = process.env.REACT_APP_BASE_URL

    const emailEvent = (e) => {
        setEmail(e.target.value)
    }
    const passwordEvent = (e) => {
        setPassword(e.target.value)
    }

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)


    const logIn = async (e) => {
        e.preventDefault()
        setCheck(true)

        await axios.post(`${BASE_URL}/login`, formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async (res) => {

            if (res.data) {
                toast.success("Your login successfully ")
                localStorage.setItem('user', JSON.stringify(res.data))
                localStorage.setItem('notification', JSON.stringify({ 'display': 'd-none' }))
                navigate('/')
            }else{
                toast.error('Sorry! user not found please check email or password')
                setCheck(false)
            }

        })
    }
    return (
        <>
            <div className=" container-fluid row d-flex align-items-center h-50 m-auto justify-content-center position-absolute">
                <div className="card col-md-6">
                    <div className=" card-header">
                        <h1>Login</h1>
                    </div>
                    <div className="card-body fs-3">
                    <label className=" form-label fs-3">Enter email <span className="fs-3 text-danger">*</span></label>
                        <input type="email" className=" form-control mb-3 text-center fs-3" placeholder="enter email" value={email} onChange={emailEvent} />
                        <label className=" form-label fs-3">Enter password <span className="fs-3 text-danger">*</span></label>
                        <input type="password" className="form-control mb-3 text-center fs-3" placeholder="enter password" value={password} onChange={passwordEvent} />
                        <div className="d-flex justify-content-center">
                            <div type="submit" className={"btn btn-outline-primary mb-3 fs-3 "+( email!=='' ? password!==''?'d-flex':'d-none':'d-none')} onClick={logIn} disabled={check}>
                                {check ? <div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>
                                    : "LogIn"}
                            </div>
                        </div>
                    </div>
                    <div className=" card-footer">
                        <div className="text-danger text-center mt-2 mb-3 fs-4">Don't have account? <Link to={'/signup'} className=" text-secondary fw-bolder cursor-pointer">SignUp</Link></div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default LogIn;
