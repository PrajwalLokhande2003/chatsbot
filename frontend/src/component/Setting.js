import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Setting = () => {

    const BASE_URL = process.env.REACT_APP_BASE_URL
    const auth = localStorage.getItem('user')
    const [name,setName] = useState('')
    const [password,setPassword] = useState('')
    const [currPassword,setCurrPassword] = useState('')
    const [email, setEmail] = useState('')

    useEffect(()=>{
        if(auth){
            getUser()
        }
    },[])

    async function getUser(){
        await axios.get(`${BASE_URL}/get-user/${auth?JSON.parse(localStorage.getItem('user'))._id:''}`).then(res=>{
            if(res.data){
                setName(res.data[0].name)
            }
        })
    }

    async function updatePassword(){
        const formData = new FormData()
        formData.append('password',password)
            await axios.put(`${BASE_URL}/update-user-password/${JSON.parse(localStorage.getItem('user'))._id}/${currPassword}`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                if( res.data.acknowledged === true && res.data.modifiedCount === 1){
                    toast('password update successfully')
                }
                
            })
    }

    async function updateName() {
        const formData = new FormData()
        formData.append('name',name)
            await axios.put(`${BASE_URL}/set-user/${JSON.parse(localStorage.getItem('user'))._id}`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                console.log(res.data);
                
                if( res.data.acknowledged === true && res.data.modifiedCount === 1){
                    toast('Name update successfully')
                    axios.get(`${BASE_URL}/get-user/${auth?JSON.parse(localStorage.getItem('user'))._id:''}`).then(res=>{
                        if(res.data){
                            localStorage.setItem('user', JSON.stringify(res.data[0]))
                            console.log(res.data);
                            
                        }
                    })
                    
                }
                
            })
        }

        const deleteUser = async () => {
            await axios.delete(`${BASE_URL}/delete-user/${JSON.parse(localStorage.getItem('user'))._id}/${email}`).then((res) => {
                if (res.data) {
                    toast("Account delete successfully")
                    localStorage.clear()
                    window.location.reload()
                }
            })
        }

    

console.log(currPassword,password);

    return (
        <>
            <div className=" container-fluid row position-absolute z-3 justify-content-center m-auto setting">
                <div className="card col-md-8">
                    <div className=" card-header">
                        <div className="d-flex justify-content-between">
                        <h1>Setting</h1>
                        <div className="bi bi-x-circle text-danger fs-2" onClick={()=>{document.documentElement.setAttribute('setting','no')}}></div>
                        </div>
                    </div>

                    <div className=" card-body fs-3">
                        <div className="mb-4">
                            <label className=" form-label">Name</label>
                            <input type="text" value={name} className=" form-control fs-3 mb-2" onChange={(e)=>{setName(e.target.value)}} />
                            <div className="btn btn-primary fs-3" onClick={()=>{updateName()}}>Update</div>

                        </div>
                        <div className=" border-danger border-top pt-3 mb-4">
                            <label className=" form-label" >Enter current password</label>
                            <input type="text" className=" form-control fs-3 mb-2" value={currPassword} onChange={(e)=>{setCurrPassword(e.target.value)}} />
                            <label className=" form-label" >Enter new password</label>
                            <input type="text" className=" form-control fs-3 mb-2" value={password} onChange={(e)=>{setPassword(e.target.value)}} />
                            <div className="btn btn-primary fs-3" onClick={()=>{updatePassword()}}>Update</div>
                        </div>
                        <div className="border-danger border-top pt-3">
                            <label className=" form-label">Enter email</label>
                            <input type="text" placeholder="example@test.com" className=" form-control mb-2 fs-3 text-danger" value={email} onChange={(e)=>{setEmail(e.target.value)}} />
                            <div className="btn btn-danger fs-3" onClick={()=>{deleteUser()}}>Delete</div>
                        </div>
                    </div>



                </div>
            </div>
        </>
    )
}

export default Setting;