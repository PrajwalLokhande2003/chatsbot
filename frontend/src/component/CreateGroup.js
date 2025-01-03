import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const CreateGroup = () =>{

    const [groupName,setGroupName] = useState('')
    const [image,setImage] = useState('')
    const [groupImage,setGroupImage] = useState('')
    const [check,setCheck] = useState(false)

    const Navigate = useNavigate()

    useEffect(()=>{
        setGroupImage(`https://www.shutterstock.com/image-vector/default-avatar-profile-icon-transparent-600nw-2463868853.jpg`)
        
    },[])
const userId = JSON.parse(localStorage.getItem('user'))._id
const email = JSON.parse(localStorage.getItem('user')).email
const userName = JSON.parse(localStorage.getItem('user')).name
    const createGroup = async (e) =>{
        e.preventDefault()

        setCheck(true)

        const formData = new FormData()
        formData.append('groupName',groupName)
        formData.append('image',image)
        formData.append('userId',userId)

        await axios.post('https://chatsbot-rwv2.onrender.com/creategroup',formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }).then(async(res)=>{
            if(res){
                alert('group create successfully...')
                Navigate('/')
                window.location.reload()
                const formData = new FormData()
  formData.append('groupId',res.data._id)
  formData.append('userId',userId)
  formData.append('image',res.data.image)
  formData.append('groupName',res.data.groupName)
  formData.append('email',email)
  formData.append('userName',userName)

<<<<<<< HEAD
  await axios.post(`https://chatsbot-rwv2.onrender.com/accept-invite`,formData,{
    headers:{
      "Content-Type":"application/json"
    }
  })
=======
//   await axios.post(`http://localhost:5000/accept-invite`,formData,{
//     headers:{
//       "Content-Type":"application/json"
//     }
//   })
>>>>>>> 8a6b32c9a9684257411c0d7261be41b47d412a57
                
            }
        })
    }

    

    return(
        <>
        <div className='createGroupMain' style={{margin : window.innerWidth>550?'10rem 50rem':'25% 2rem'}}>
            <div className='uDiv'>
            <input type='file' className='upload'  style={{background:`url(${groupImage}) 0% 0% / cover`}}   onChange={(e)=>{setImage(e.target.files[0]);setGroupImage(URL.createObjectURL(e.target.files[0]))}} />
            </div>
            <input type='text' className='groupName' placeholder='enter group name' value={groupName} onChange={(e)=>{setGroupName(e.target.value)}}/>
            <button className='createBtn' onClick={createGroup} style={{marginLeft:window.innerWidth>550?'30%':'35%'}} disabled={check}>{check?<div class="spinner-border spinner-border-sm" role="status">
  <span class="visually-hidden">Loading...</span>
</div>:"Create Group"}</button>
        </div>
        </>
    )
}

export default CreateGroup;
