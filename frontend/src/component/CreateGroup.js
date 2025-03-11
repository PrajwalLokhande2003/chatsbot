import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

const CreateGroup = () => {

    const [groupName, setGroupName] = useState('')
    const [image, setImage] = useState('no')
    const [groupImage, setGroupImage] = useState('')
    const [check, setCheck] = useState(false)
    const BASE_URL = process.env.REACT_APP_BASE_URL

    const Navigate = useNavigate();


    useEffect(() => {
        setGroupImage(`https://www.shutterstock.com/image-vector/default-avatar-profile-icon-transparent-600nw-2463868853.jpg`)

    }, [])
    const userId = JSON.parse(localStorage.getItem('user'))._id
    const email = JSON.parse(localStorage.getItem('user')).email
    const userName = JSON.parse(localStorage.getItem('user')).name
    const createGroup = async (e) => {
        e.preventDefault()

        setCheck(true)

        const formData = new FormData()
        formData.append('groupName', groupName)
        formData.append('image', image)
        formData.append('userId', userId)

        await axios.post(`${BASE_URL}/creategroup`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(async (res) => {
            if (res) {
                const formData = new FormData()
                formData.append('groupId', res.data._id)
                formData.append('userId', userId)
                formData.append('image', res.data.image)
                formData.append('groupName', res.data.groupName)
                formData.append('email', email)
                formData.append('userName', userName)

                await axios.post(`${BASE_URL}/accept-invite`, formData, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(res => {
                    if (res) {
                        console.log(res.data);
                        
                        toast('group create successfully...')
                        Navigate('/')
                        window.location.reload()
                    }
                })

            }
        })
    }
    console.log(image);



    return (
        <>
            <div className='row position-absolute w-100 h-100 d-flex align-items-center m-auto'>
                <div className='card offset-sm-2 col-sm-8 offset-sm-2 '>
                    <div className='card-body'>
                        <div className='uDiv d-flex justify-content-center mb-3'>
                            <input type='file' className='upload' style={{ background: `url(${groupImage}) 0% 0% / cover` }} onChange={(e) => { setImage(e.target.files[0]); setGroupImage(URL.createObjectURL(e.target.files[0])) }} />
                        </div>
                        <div className='my-3'>
                            <input type='text' className=' form-control fs-3 text-center' placeholder='enter group name' value={groupName} onChange={(e) => { setGroupName(e.target.value) }} />
                        </div>
                        <div className=' d-flex justify-content-center'>
                            <button className='createBtn' onClick={createGroup} disabled={check}>{check ?
                                <div class="spinner-border spinner-border-sm" style={{ height: '2rem', width: '2rem' }} role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div> : "Create Group"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateGroup;
