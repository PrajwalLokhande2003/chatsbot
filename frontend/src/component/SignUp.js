/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { io } from 'socket.io-client'
import { toast } from 'react-toastify';

const SignUp = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL
    const socket = io.connect(`${BASE_URL}`)

    const navigate = useNavigate()
    useEffect(() => {
        const authn = localStorage.getItem('user');
        if (authn) {
            navigate('/')
        }
    }, [])

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [checkEmail, setCheckEmail] = useState('')
    const [visibility, setVisibility] = useState('')
    const [color, setColor] = useState('')
    const [check, setCheck] = useState(false)
    const [text,setText] = useState('')

    const div = useRef(null)





    useEffect(() => {
        if (email !== '') {
            getEmailId();
        }

        socket.on('connection', null);
        socket.on('getEmailId', data => {
            setCheckEmail(data)


        })
        return () =>
            socket.off('getMessage');

    }, [email])



    const getEmailId = async () => {
        await axios.get(`${BASE_URL}/check-email-account/${email}`).then((res) => {
            if (res) {
                socket.emit('addEmailId', res.data)
            }
        })
    }

    const nameEvent = (e) => {
        setName(e.target.value)
    }
    const emailEvent = (e) => {
        setEmail(e.target.value)
    }
    const passwordEvent = (e) => {
        setPassword(e.target.value)
    }


    const signUp = async (e) => {

        setCheck(true)

        const formData = new FormData()
        formData.append('name', name)
        formData.append('email', email)
        formData.append('password', password)

        await axios.post(`${BASE_URL}/signup`, formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async (res) => {
            if (res) {
                localStorage.setItem('user', JSON.stringify(res.data))
                localStorage.setItem('notification', JSON.stringify({ 'display': 'd-none' }))
                navigate('/')
                toast.success("You Registered Successfully")
            }

        })
    }

    const clickOn = (e) => {
        e.preventDefault()

        if (checkEmail.length > 0) {
            setText("this email already use plese try another")
            setVisibility('visible')
            setColor('#fa2c2c')
        } else {
            setVisibility('visible')
            setText('available')
            setColor('green')
            signUp()
        }
    }


    return (
        <>
            <div className="container-fluid row d-flex align-items-center h-50 m-auto justify-content-center position-absolute">
                <div className="card col-md-6">
                    <div className=" card-header">
                        <h1>SignIn</h1>
                    </div>
                    <div className="card-body">
                        <label className=" form-label fs-3">Enter name <span className="fs-3 text-danger">*</span></label>
                        <input type="name" className=" form-control mb-3 text-center fs-3" value={name} onChange={nameEvent} placeholder="enter name" required={true} />
                        <label className=" form-label fs-3">Enter email <span className="fs-3 text-danger">*</span></label>
                        <input type="email" className="form-control mb-3 text-center fs-3" value={email} onChange={(e) => { emailEvent(e); setVisibility('hidden') }} placeholder="enter email" required={true} />
                        <label className=" form-label fs-3">Enter password <span className="fs-3 text-danger">*</span></label>
                        <div className="check d-flex justify-content-center mt-n4 mb-4" ref={div} style={{ visibility: visibility, color: color }}><div className=" bg-white">{text}</div></div>
                        <input type="password" className="form-control mb-3 text-center fs-3 " value={password} onChange={passwordEvent} placeholder="enter password" required={true} />
                        <div className=" d-flex justify-content-center">
                        <div type="submit" className={"btn btn-outline-primary mb-3 text-center fs-3 "+(name!==''? email!=='' ? password!==''?'d-flex':'d-none':'d-none':'d-none')} onClick={(e) => { clickOn(e) }} disabled={check}>{check ? <div class="spinner-border spinner-border-sm" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div> : "SignUp"}
                        </div>
                        </div>
                    </div>
                    <div className=" card-footer">
                        <div className="text-danger text-center mt-2 mb-3 fs-4">If you have already account? <Link to={'/login'} className=" text-secondary fw-bolder cursor-pointer">LogIn</Link></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignUp;
