/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useId, useRef, useState } from "react";
import axios from 'axios'
import { io } from 'socket.io-client'
import ReactPlayer from 'react-player'
import { pdfjs, Document, Page } from 'react-pdf';
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { toast } from 'react-toastify';




const Home = () => {

    // const [groupsId,setGroupsId] = useState('')
    const [groups, setGroups] = useState([])
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = JSON.parse(localStorage.getItem('user'))._id
    const userName = JSON.parse(localStorage.getItem('user')).name
    const userEmail = JSON.parse(localStorage.getItem('user')).email

    const [item, setItem] = useState('')
    const [message, setMessage] = useState('')
    const [memberDisplay, setMemberDisplay] = useState('d-none')
    const [chatId, setChatId] = useState('')
    const [visibility, setVisibility] = useState('')
    const [inviteDisplay, setInviteDisplay] = useState('d-none')
    const [email, setEmail] = useState('')
    const [member, setMember] = useState([])
    const [exitId, setExitId] = useState('')
    const [exitDisplay, setExitDisplay] = useState('d-none')
    const [file, setFile] = useState('')
    const [checkUser, setCheckUser] = useState([])
    const [onlineUsers, setOnlineUsers] = useState([])
    const [loadClass, setLoadClass] = useState('d-none')
    const [clipClass, setClipClass] = useState('d-none')
    const [clipImage, setClipImage] = useState('')
    const [fileName, setFileName] = useState('')
    const [viewClass, setViewClass] = useState('d-none')
    const [ext, setExt] = useState('')
    const [size, setSize] = useState('')
    const [name, setName] = useState('')
    const [fileUrl, setFileUrl] = useState('')
    const [check, setCheck] = useState(false)
    const [error, setError] = useState('')
    const [msgEdit, setMsgEdit] = useState('d-none');
    const [replayMsg, setreplayMsg] = useState('')
    const [replayExt, setreplayExt] = useState('')
    const [replayFname, setreplayFname] = useState('')
    const [replayUerName, setreplayUerName] = useState('')
    const [msgId, setmsgId] = useState('')
    const [replayDisplay, setreplayDisplay] = useState('d-none')
    const [edit, setEdit] = useState('')
    const [editMsg, seteditMsg] = useState('')
    const [editMsgDisplay, seteditMsgDisplay] = useState('d-none')

    const inviteRef = useRef(null)
    const okRef = useRef(null)
    const BASE_URL = process.env.REACT_APP_BASE_URL;


    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    const [numPages, setNumPages] = useState();
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const messagesEndRef = useRef(null)
    const ref = useRef(null)
    const cData = useRef(null)

    const groupId = `${item.groupId}`
    const t = new Date()
    const time = `${(t.getHours() > 12 ? (t.getHours() - 12 >= 9 ? "0" + t.getHours() - 12 : t.getHours() - 12) : t.getHours()) + ":" + (t.getMinutes() <= 9 ? "0" + t.getMinutes() : t.getMinutes()) + " " + (t.getHours() >= 12 ? "PM" : "AM")}`
    const date = `${(t.getDate() < 10 ? "0" + t.getDate() : t.getDate()) + "-" + (t.getMonth() > 9 ? (t.getMonth() + 1) : "0" + (t.getMonth() + 1)) + "-" + t.getFullYear()}`


    const groupName = `${item.groupName}`
    const image = `${item.image}`

    const socket = io(`${BASE_URL}`, { autoConnect: false })

    useEffect(() => {

        socket.connect()
        // socket.on('connection', null);
        socket.on('getMessage', data => {
            setChatId((prev) => [...prev, data])
            document.getElementById(data.groupId).innerHTML = `<span class="overflow-hidden w-90 position-absolute ellipse">${data.image.name !== '' ? (`<img class=" border-0 w-auto h-auto rounded-0 pe-1" src="https://pro.alchemdigital.com/api/extension-image/${data.image.ext}" alt="..."/>` + data.image.name) : data.message}</span>` + data.view.map(m => m.id === userId ? (m.numV === 0 ? '' : `<span class="badge badge-light position-absolute end-0 bg-info ">${m.numV}</span>`) : '').join('');
            const receivedA = new Audio('audio/notification-2-269292.mp3')
            item.userId !== userId ? receivedA.pause() : receivedA.play()

        })
        return () => {
            socket.off('getMessage');
            socket.disconnect()
        }


    }, [])

    useEffect(() => {
        socket.connect()
        socket.on('get-editmsg', data => {
            if (data.update === 1) {
                getChatData()
                axios.get(`${BASE_URL}/group&useriddata/${userId}`,).then(async (res) => {
                    if (res.data) {
                        res.data.map(item => axios.get(`${BASE_URL}/chat-data/${item.groupId}`).then((res) => {
                            if (res.data.length > 0) {
                                document.getElementById(res.data[res.data.length - 1].groupId).innerHTML =
                                    `<span class="overflow-hidden w-90 position-absolute ellipse">${res.data.length > 0 ? res.data[res.data.length - 1].image.name !== '' ? (`<img class=" border-0 w-auto h-auto rounded-0 pe-1" src="https://pro.alchemdigital.com/api/extension-image/${res.data[res.data.length - 1].image.ext}" alt="..."/>` + res.data[res.data.length - 1].image.name) : res.data[res.data.length - 1].message : ''}</span>` +
                                    res.data[res.data.length - 1].view.map(m => m.id === userId ? (m.numV === 0 ? '' : `<span class="badge badge-light position-absolute end-0 bg-info ">${m.numV}</span>`) : '').join('')
                            }
        
                        })
                        )
                    }
                })
            }

        })

        return () => {
            socket.off('get-editmsg')
            socket.disconnect()
        }
    }, [])



    useEffect(() => {

        socket.connect()
        socket.on('get-chats', data => {
            // setId(data.allChats)

        })
        return () => {
            socket.off('get-chats');
            socket.disconnect()
        }
    }, [])


    useEffect(() => {
        if (groups.length === 0) {
            getGroups()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        getChatData()

    }, [cData])


    useEffect(() => {

        socket.connect()

        if (email !== '') {
            getGroupId();
        }
        socket.on('getUserId', data => {
            setCheckUser((prev) => [...prev, data])


        })
        return () => {
            socket.off('getUserId');
            socket.disconnect()
        }

    }, [])


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })

    }, [chatId])




    useEffect(() => {

        socket.connect()

        socket.emit("new-user-add", user);
        socket.on("get-users", (users) => {
            setOnlineUsers(users);
        });

        return () => {
            socket.off('get-users');
            socket.disconnect()
        }

    }, []);



    useEffect(() => {

        socket.connect()

        // Tab has focus
        const handleFocus = async () => {
            socket.emit("new-user-add", user);
            socket.on("get-users", (users) => {
                setOnlineUsers(users);

            });
        };// Tab closed
        const handleBlur = () => {
            if (userId) {
                socket.emit("offline")
            }
        };

        // Track if the user changes the tab to determine when they are online
        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);

        return () => {
            socket.off('get-users');
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
            socket.disconnect()
        };
    }, []);



    const getGroupId = async () => {

        socket.connect()
        await axios.get(`${BASE_URL}/get-groupid-for-invite/${groupId}`).then((res) => {
            if (res) {
                socket.emit('addUserId', res.data)

            }
        })
        return () => {
            socket.disconnect()
        }
    }

    const getGroups = async (e) => {
        await axios.get(`${BASE_URL}/group&useriddata/${userId}`,).then(async (res) => {
            if (res.data) {
                setGroups(res.data)

                res.data.map(item => axios.get(`${BASE_URL}/chat-data/${item.groupId}`).then((res) => {
                    if (res.data.length > 0) {
                        document.getElementById(res.data[res.data.length - 1].groupId).innerHTML =
                            `<span class="overflow-hidden w-90 position-absolute ellipse">${res.data.length > 0 ? res.data[res.data.length - 1].image.name !== '' ? (`<img class=" border-0 w-auto h-auto rounded-0 pe-1" src="https://pro.alchemdigital.com/api/extension-image/${res.data[res.data.length - 1].image.ext}" alt="..."/>` + res.data[res.data.length - 1].image.name) : res.data[res.data.length - 1].message : ''}</span>` +
                            res.data[res.data.length - 1].view.map(m => m.id === userId ? (m.numV === 0 ? '' : `<span class="badge badge-light position-absolute end-0 bg-info ">${m.numV}</span>`) : '').join('')
                    }

                })
                )
            }


        })
            .catch((err) => {
                console.log(err);

            })


    }


    const searchHandel = async (e) => {
        let key = e.target.value
        if (key) {
            await axios.get(`${BASE_URL}/search/${key}`).then((res) => {

                if (res.data) {
                    setGroups(res.data)
                }
            })

        } else {
            setGroups('no group')
        }
    }

    const sendChat = async (e) => {
        e.preventDefault();
        const updatedView = member.map((m, i) => (m.userId === userId ? { id: '', numV: 0 } : { id: m.userId, numV: chatId.length > 0 ? (!chatId[chatId.length - 1].view[i] ? 1 : chatId[chatId.length - 1].view[i].numV + 1) : 1 }));

        setTimeout(async () => {
            socket.connect();

            const formData = new FormData();
            formData.append("message", message);
            formData.append("time", time);
            formData.append("userId", userId);
            formData.append("groupId", groupId);
            formData.append("userName", userName);
            formData.append("date", date);
            formData.append("image", fileName);
            formData.append("ext", ext);
            formData.append("size", size);
            formData.append("name", name);
            formData.append("view", JSON.stringify(updatedView));
            formData.append("replayMsg", replayMsg);
            formData.append("replayExt", replayExt);
            formData.append("replayFname", replayFname);
            formData.append("replayUerName", replayUerName);
            formData.append("msgId", msgId);
            formData.append("edit", 0);

            await axios.post(`${BASE_URL}/send-chat`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then((res) => {

                    if (res.data.image.ext !== "") {
                        let fileName = res.data.image.fileName
                        if (res.data.image.fileName !== "") {
                            socket.emit("addMessage", {
                                message,
                                time,
                                date,
                                groupId,
                                userId,
                                userName,
                                image: {
                                    ext,
                                    size,
                                    fileName,
                                    name
                                },
                                view: updatedView,
                                replay: {
                                    replayMsg,
                                    replayExt,
                                    replayFname,
                                    replayUerName,
                                    msgId
                                },
                                edit
                            });

                            socket.emit('add-editmsg', { update: 1 })

                            // axios.put(`${BASE_URL}/update-view/${res.data._id}`, { view: updatedView }, {
                            //     headers: { "Content-Type": "application/json" },
                            // })
                            // .then((res) => {
                            //     if (res) {
                            //         setView([]);
                            //     }
                            // });

                            const sendA = new Audio("audio/notification-1-269296.mp3");
                            if (userId === item.userId) {
                                sendA.play();
                            } else {
                                sendA.pause();
                            }

                            setFileName('')
                            setExt('')
                            setName('')
                            setSize('')
                            setreplayExt('')
                            setreplayMsg('')
                            setreplayFname('')
                            setreplayUerName('')
                            seteditMsg('')
                            setmsgId('')
                        }
                    } else {
                        socket.emit("addMessage", {
                            message,
                            time,
                            date,
                            groupId,
                            userId,
                            userName,
                            image: {
                                ext,
                                size,
                                fileName,
                                name
                            },
                            view: updatedView,
                            replay: {
                                replayMsg,
                                replayExt,
                                replayFname,
                                replayUerName,
                                msgId
                            },
                            edit
                        })
                        socket.emit('add-editmsg', { update: 1 })
                        const sendA = new Audio("audio/notification-1-269296.mp3");
                        if (userId === item.userId) {
                            sendA.play();
                        } else {
                            sendA.pause();
                        }

                        setFileName('')
                        setExt('')
                        setName('')
                        setSize('')
                        setreplayExt('')
                        setreplayMsg('')
                        setreplayFname('')
                        setreplayUerName('')
                        seteditMsg('')
                        setmsgId('')
                    }
                });

            setMessage("");
        }, 100);

        return () => {
            socket.disconnect();
        };
    };

    async function updatedChat() {
        socket.connect()
        const formData = new FormData()
        formData.append('editMsg', editMsg)
        formData.append('edit', 1)
        await axios.put(`${BASE_URL}/update-chat/${msgId}`, formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res.data) {
                socket.emit('add-editmsg', { update: 1 })
                setmsgId('')
                setreplayExt('')
                setreplayMsg('')
                setreplayFname('')
                setreplayUerName('')
                seteditMsg('')
            }
        })
        return () => {
            socket.disconnect();
        };
    }

    async function deleteChat() {
        socket.connect()
        await axios.delete(`${BASE_URL}/delete-chat/${msgId}`).then((res) => {
            if (res.data) {
                socket.emit('add-editmsg', { update: 1 })
                setmsgId('')
                setreplayExt('')
                setreplayMsg('')
                setreplayFname('')
                setreplayUerName('')
                seteditMsg('')

            }
        })
        return () => {
            socket.disconnect();
        };

    }




    async function updateView() {
        const formData = new FormData()
        formData.append('numV', 0)
        await axios.put(`${BASE_URL}/update-chat-view/${groupId}/${userId}`, formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {

        })
    }


    const getChatData = async () => {
        setLoadClass('d-none')
        await axios.get(`${BASE_URL}/chat-data/${groupId}`).then(async (res) => {
            if (res) {
                setChatId(res.data)
                setLoadClass('d-none')
            }
        })

    }


    const inviteHandle = async () => {


        socket.connect()
        setCheck(true)
        let view = 1

        const formData = new FormData()
        formData.append('email', email)
        formData.append('groupId', groupId)
        formData.append('time', time)
        formData.append('groupName', groupName)
        formData.append('date', date)
        formData.append('userName', userName)
        formData.append('image', image)
        formData.append('view', view)

        await axios.post(`${BASE_URL}/send-invite`, formData, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            if (res) {
                toast('invite send successfully', {
                    autoClose: 5000
                }
                )
                setCheck(false)
                setError('')
            }
            socket.emit('sendInvite',
                {
                    email,
                    image,
                    time,
                    date,
                    groupId,
                    userId,
                    userName,
                    view
                }
            )
        })
        return () => {
            socket.disconnect()
        }

    }

    const getMember = async () => {
        await axios.get(`${BASE_URL}/get-group-member/${groupId}`).then((res) => {
            if (res) {
                setMember(res.data)

            }
        })
    }


    async function emailCheck(e) {
        return e.target.value !== '' ? await axios.get(`${BASE_URL}/search-invite-email/${groupId}/${e.target.value}`).then((res) => {

            if (res.data.length > 0) {
                if (res.data[0].email === e.target.value) {
                    setError('user already exists')
                    setCheck(true)
                } else {
                    setError('user not exists')
                    setCheck(false)
                }
            } else {
                setError('user not exists')
            }
        }) : setError('')
    }


    const clickOn = () => {
        return !check ? (inviteHandle(), setCheck(true)) : '';
    }


    const exitGroup = async () => {
        await axios.delete(`${BASE_URL}/exit-from-group/${exitId}`).then((res) => {
            if (res) {
                window.location.reload()
            }
        })
    }


    let newDate = ''
    let lastId = ''
    let lastDate = ''


// console.log(chatId);


    return (
        <>
            <div className="container-fluid position-absolute h-100">
                <div className="row h-100">

                    <div className="groups col-sm-5 mb-2 h-100">
                        <div className="card h-100 rounded-4 bg-dark text-light">
                            <div className=" card-header">
                                <input type="text" className=" w-100 p-2 rounded-5 text-info fs-3 text-center" placeholder="Search Group" onChange={searchHandel} />
                            </div>
                            <div className="card-body h-100 overflow-scroll scroll-bar-none">
                                <div className="yourGroups noselect ">
                                    {groups.length > 0 ? groups.map((item, index) => (
                                        item.userName === userName ?

                                            <div className={"  cursor-pointer d-flex align-items-center mb-3 p-2 " + (item.groupId === groupId ? 'active' : '')} ref={cData} key={item._id} onClick={() => {
                                                setItem(item);
                                                getMember();
                                                getChatData();
                                                updateView()
                                                setExitId(item._id);
                                                messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                                            }}>
                                                <div className=""><img alt='...' src={item.image === '' ? "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-transparent-600nw-2463868853.jpg" : item.image} /></div>
                                                <div className="d-grid h-100 w-100 fs-2 ps-2"><div className=" w-90 overflow-hidden ellipse mt-n3">{item.groupName}</div>
                                                    <div id={item.groupId} className="fs-4 d-flex align-items-center position-relative w-100 bottom-50 pe-1 "></div>
                                                </div>
                                            </div> : '')
                                    )
                                        : <h3 className="d-flex align-items-center justify-content-center position-absolute h-75 w-100">no group</h3>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group-chat col-sm-7 mb-2 h-100">
                        <div className="card h-100 rounded-4 bg-dark text-light bg-chatDiv">
                            {member.length > 0 ? <>

                                <div className=" card-header">
                                    {item !== '' ? <div className="">
                                        <div className="chat-upper row">
                                            <div className=" img col-2 px-1 h-100 cursor-pointer" onMouseLeave={() => { setVisibility('hidden') }}><img alt="..." src={item.image === '' ? "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-transparent-600nw-2463868853.jpg" : item.image} onMouseOver={() => { member.length > 0 ? setVisibility('visible') : setVisibility('hidden') }} />
                                                <div className="groupMenu" style={{ visibility: visibility }} >
                                                    <div className="invite" onClick={() => { setInviteDisplay('d-block') }} style={{ cursor: 'pointer' }}>invite</div>
                                                    <div className="members" onClick={() => { setMemberDisplay('d-flex'); getMember() }} style={{ cursor: 'pointer' }}>Members</div>
                                                    <div className="exitGroup" onClick={() => { setExitDisplay('d-flex') }} style={{ cursor: 'pointer', color: 'red' }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" style={{ position: 'relative', top: '.3rem', right: '.5rem' }} fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
                                                            <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z" />
                                                            <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z" />
                                                        </svg>
                                                        Exit</div>
                                                </div>
                                            </div>
                                            <div className="name col-5 d-flex align-items-center fs-3 px-3 h-100"><span className="w-100 overflow-hidden ellipse">{item.groupName}</span></div>
                                            <div className="col-5 h-100">online members
                                                <div className="onlineMember">
                                                    {

                                                        onlineUsers.map((item) => (

                                                            (item.userName !== userName ?


                                                                (<>
                                                                    <div className=" d-flex align-items-center">
                                                                        {member.map(m => m.userName === item.userName ? <><div className="onlineCircle me-1"></div><div>{item.userName}</div></> : '')}
                                                                    </div>
                                                                </>)
                                                                : '')


                                                        )
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div> : ''}
                                </div>
                                <div className="card-body p-0">
                                    <div className="chatDiv">
                                        {item === '' ? <h3 className="ifChat d-flex align-items-center justify-content-center position-absolute h-75 w-100">Display chat</h3>
                                            : <>
                                                <div className="messageDiv d-grid position-absolute h-75 w-100" ref={ref} >
                                                    {

                                                        chatId.length > 0 ? chatId.map((item, index) => (

                                                            (item.groupId === groupId ?
                                                                <>
                                                                    {item.date !== newDate ? <div className="chatDate p-2 my-2">{(newDate = item.date) === date ? 'Today' : newDate = item.date}</div> : ''}
                                                                    {item.view?item.view.map((m, i) => m.id === userId ? ((m.numV !== 0) && (chatId[(index > 0 ? index - 1 : index)].view[i].numV) === 0 && (chatId[(index < chatId.length - 1 ? index + 1 : index)].view[i].numV) > 0) ? (<div className=" d-flex justify-content-center m-2 fs-5" style={{ boxShadow: "1px 1px 5px inset #000 , 1px 1px 10px inset #000" }}>unread message</div>) : '' : ''):''}
                                                                    <div id={item._id} className={(userId === item.userId ? 'messages sent ms-3 mt-2 ' : 'otherMessage sent me-3 mt-2') + " px-3 " + (item.userId === lastId ? item.date === lastDate ? 'nostyle  rounded-3' : '' : '')} onDoubleClick={() => { setMsgEdit('d-flex'); setEdit(item); seteditMsg(item.message); setreplayMsg(item.message); setreplayExt(item.image.ext); setreplayFname(item.image.name); setreplayUerName(item.userName); setmsgId(item._id) }}>
                                                                        {(lastId !== item.userId ? (lastId = item.userId).replace(item.userId, '') : '')}
                                                                        {item.date?(lastDate !== item.date ? (lastDate = item.date).replace(item.date, '') : ''):''}

                                                                        {!item.replay ?'': item.replay.msgId !== '' ?
                                                                            <>
                                                                                <div className="card w-100 h-100 bg-secondary bg-opacity-50 mt-2 ">
                                                                                    <div className="crad-body w-100 h-100 border-start border-end-0 border-top-0 border-bottom-0 border-primary border-5 rounded-2 border-solid fs-5 cursor-pointer" onClick={() => { document.getElementById(item.replay.msgId).scrollIntoView({ behavior: "smooth", block: "nearest" }) }}>
                                                                                        <div className="row w-100 mx-1 h-100">
                                                                                            <div className="col-11 row ">
                                                                                                <div className="col-12 h-25 fw-semibold" style={{ color: '#04ff04' }}>{item.replay.userName === userName ? 'You' : item.replay.userName}</div>
                                                                                                <div className="col-12 d-flex align-items-center h-75">
                                                                                                    <div className="w-100 ellipse overflow-hidden text-white-50">
                                                                                                        {item.replay.ext === '' ?'': <img src={`https://pro.alchemdigital.com/api/extension-image/${item.replay.ext}`} style={{ width: '1rem' }} alt="..." className="me-1" />}
                                                                                                        {item.replay.message !== '' ? item.replay.message :item.replay.name }
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-1 h-100 p-1">
                                                                                                <div className="d-flex w-100 h-100 align-center justify-content-center">
                                                                                                    {item.replay.ext === '' ?'': <img src={`https://pro.alchemdigital.com/api/extension-image/${item.replay.ext}`} style={{ width: '2.5rem' }} alt="..." /> }
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </> : ''
                                                                            
                                                                        }

                                                                        <div className="userName fw-semibold fs-5">{userId !== item.userId ? item.userName : ''}</div>
                                                                        <div className={"msg row py-2 " + (!item.image ? '' : item.image.fileName === '' ? '' : 'w-min-content')}>
                                                                            {!item.image ? '' : item.image.fileName === '' ? ''
                                                                                : <div className=" col-12 p-0 d-flex justify-content-center" style={{ width: '20rem' }}>
                                                                                    {/* {(item.image.ext === 'jpg' || item.image.ext === 'apng' || item.image.ext === 'png' || item.image.ext === 'avif' || item.image.ext === 'gif' || item.image.ext === 'jpeg' || item.image.ext === 'jfif' || item.image.ext === 'pjpeg' || item.image.ext === 'pjp' || item.image.ext === 'webp') ?
                                                                                <>
                                                                                    <div className=" d-grid">
                                                                                    <div className="mb-3 ">
                                                                                    <img alt="..." src={item.image.fileName} className=" w-100 rounded-3" />
                                                                                    </div>
                                                                                    <div className=" d-flex justify-content-evenly mb-2">
                                                                                        <div className="btn btn-secondary fs-4 px-4" onClick={() => { setViewClass('d-flex'); setFileUrl(item.image) }}>open</div>
                                                                                        <div className="btn btn-secondary fs-4 px-4">save</div>
                                                                                    </div>
                                                                                    </div>
                                                                                </>
                                                                                : item.image.ext === 'mp4' ?
                                                                                    <>
                                                                                        <div className=" d-grid">
                                                                                        <div className="mb-2 rounded-3">
                                                                                        <div style={{ width: '20rem' }}>
                                                                                            <ReactPlayer url={item.image.fileName} light={<video alt="..." className="w-100 rounded-3" autoPlay={false} src={item.image.fileName}></video>} playIcon={<div className=" position-absolute d-flex w-100 justify-content-center"><i className=" bi bi-play-circle fs-1 text-danger" onClick={()=>{setViewClass('d-flex'); setFileUrl(item.image)}}></i></div>} width={200} height={'auto'} >
                                                                                            </ReactPlayer>                                                                                        </div>
                                                                                        </div>
                                                                                        <div className=" d-flex justify-content-evenly mb-2">
                                                                                            <div className="btn btn-secondary fs-4 px-4" onClick={() => { setViewClass('d-flex'); setFileUrl(item.image) }}>open</div>
                                                                                            <div className="btn btn-secondary fs-4 px-4">save</div>
                                                                                        </div>
                                                                                        </div>
                                                                                    </>
                                                                                    : (item.image.ext === 'pdf' || item.image.ext === 'svg') ? <>
                                                                                        <div className=" d-grid w-100">
                                                                                            <div className=" d-flex justify-content-center mb-2" >
                                                                                                <div className=" overflow-hidden rounded-3" style={{ height: '20rem' }}>
                                                                                                    <Document file={item.image.fileName} onLoadSuccess={onDocumentLoadSuccess}>
                                                                                                        <Page pageNumber={pageNumber} width={200} height={10} className="rounded-3" />
                                                                                                    </Document>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className=" d-flex mb-2 justify-content-start px-2 mb-2">
                                                                                                <div className=" d-flex">
                                                                                                    <div className=" pe-2">{item.image.name === '' ? item.image.fileName.replace('https://firebasestorage.googleapis.com/v0/b/groupmedia-6d544.appspot.com/o/', '').replace(item.image.fileName.slice(item.image.fileName.lastIndexOf('?'), item.image.fileName.length), '').replace('%20', ' ') : item.image.name}</div>
                                                                                                    <div className="pe-2"><div className=" rounded-circle p-1"></div></div>
                                                                                                    <div>{Math.floor((item.image.size / 1024) > 999 ? ((item.image.size / 1024) / 1000) : (item.image.size / 1024))}<div>{Math.floor((item.image.size / 1024)) > 999 ? "MB" : "KB"}</div></div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className=" d-flex justify-content-evenly">
                                                                                                <div className="btn btn-secondary fs-4 px-4" onClick={() => { setViewClass('d-flex'); setFileUrl(item.image) }}>open</div>
                                                                                                <div className="btn btn-secondary fs-4 px-4">save</div>
                                                                                            </div>

                                                                                        </div>
                                                                                    </> 
                                                                                    :<>
                                                                                        <div className=" ">
                                                                                        <div className="d-flex justify-content-center w-100 mb-3">
                                                                                        <img src={`https://pro.alchemdigital.com/api/extension-image/${item.image.ext}`} className="w-25" alt="..." />
                                                                                        </div>
                                                                                        <div className=" d-flex mb-2 justify-content-start w-100 px-2">
                                                                                                <div className=" d-flex">
                                                                                                    <div className=" pe-2">{item.image.name === '' ? item.image.fileName.replace('https://firebasestorage.googleapis.com/v0/b/groupmedia-6d544.appspot.com/o/', '').replace(item.image.fileName.slice(item.image.fileName.lastIndexOf('?'), item.image.fileName.length), '').replace('%20', ' ') : item.image.name}</div>
                                                                                                    <div className="pe-2"><div className=" rounded-circle p-1 text-info"></div></div>
                                                                                                    <div>{Math.floor((item.image.size / 1024) > 999 ? ((item.image.size / 1024) / 1000) : (item.image.size / 1024))}<div>{Math.floor((item.image.size / 1024)) > 999 ? "MB" : "KB"}</div></div>
                                                                                                </div>
                                                                                            </div>
                                                                                        <div className=" d-flex justify-content-evenly w-100">
                                                                                            <div className="btn btn-secondary fs-4 px-4" onClick={() => { setViewClass('d-flex'); setFileUrl(item.image) }}>open</div>
                                                                                            <div className="btn btn-secondary fs-4 px-4">save</div>
                                                                                        </div>
                                                                                        </div>
                                                                                    </>   
                                                                            } */}
                                                                                    <div className=" ">
                                                                                        <div className="d-flex justify-content-center w-100 mb-3">
                                                                                            <img src={`https://pro.alchemdigital.com/api/extension-image/${(item.image.ext === 'jpg' || item.image.ext === 'apng' || item.image.ext === 'png' || item.image.ext === 'avif' || item.image.ext === 'gif' || item.image.ext === 'jpeg' || item.image.ext === 'jfif' || item.image.ext === 'pjpeg' || item.image.ext === 'pjp' || item.image.ext === 'webp') ? 'png' : item.image.ext}`} className="w-25" alt="..." />
                                                                                        </div>
                                                                                        <div className=" d-flex mb-2 justify-content-start w-100 px-2">
                                                                                            <div className=" d-flex">
                                                                                                <div className=" pe-2 ellipse overflow-hidden" style={{ width: '13rem' }}>{item.image.name === '' ? item.image.fileName.replace('https://firebasestorage.googleapis.com/v0/b/groupmedia-6d544.appspot.com/o/', '').replace(item.image.fileName.slice(item.image.fileName.lastIndexOf('?'), item.image.fileName.length), '').replace('%20', ' ') : item.image.name}</div>
                                                                                                <div className="pe-2"><div className=" rounded-circle p-1 text-info"></div></div>
                                                                                                <div>{Math.floor((item.image.size / 1024) > 999 ? ((item.image.size / 1024) / 1000) : (item.image.size / 1024))}<div>{Math.floor((item.image.size / 1024)) > 999 ? "MB" : "KB"}</div></div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className=" d-flex justify-content-evenly w-100">
                                                                                            <div className="btn btn-secondary fs-4 px-4" onClick={() => { setViewClass('d-flex'); setFileUrl(item.image) }}>open</div>
                                                                                            <div className="btn btn-secondary fs-4 px-4">save</div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>}
                                                                            <div className=" d-flex col-12">
                                                                                {item.message}
                                                                            </div>
                                                                        </div>
                                                                        <div className="msgTime pe-1">{item.time}</div>
                                                                    </div>
                                                                    <div ref={messagesEndRef}/>


                                                                </> : '')
                                                        )) : ''}
                                                </div>
                                                <div className={"w-100 position-absolute justify-content-center h-100 d-flex align-items-center top-0  " + (msgEdit)}>
                                                    <div className="card bg-secondary h-fit text-white">
                                                        <div className="w-100 position-absolute d-flex justify-content-end"><i className="bi bi-x-circle text-danger fs-4 cursor-pointer" onClick={() => { setMsgEdit('d-none') }}></i></div>
                                                        <div className="card-body fs-4 p-3 mt-3 ">
                                                            <div className="mb-2 mx-2 cursor-pointer" onClick={() => { setreplayDisplay('d-flex'); setMsgEdit('d-none') }}><i className="bi bi-reply"></i>Replay</div>
                                                            <div className="mb-2 mx-2 cursor-pointer" onClick={() => { setMsgEdit('d-none'); seteditMsgDisplay('d-flex') }}><i className="bi bi-pencil"></i>Edit</div>
                                                            <div className= "mb-2 mx-2 cursor-pointer " onClick={() => { setMsgEdit('d-none'); deleteChat() }}><i className="bi bi-trash"></i>Delete</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={" container position-absolute w-100 h-75 start-0 z-2 " + viewClass}>
                                                    <div className="card w-100 ">
                                                        <div className=" w-100 d-flex justify-content-end me-4">
                                                            <i className=" bi bi-x-circle text-danger fs-2 cursor-pointer" onClick={() => { setViewClass('d-none'); setFileUrl('') }}></i>
                                                        </div>
                                                        <TransformWrapper >
                                                            <TransformComponent>
                                                                {fileUrl.ext === 'pdf' ? <div className=" d-flex justify-content-center w-100 h-100 ">

                                                                    <Document file={fileUrl.fileName} onLoadSuccess={onDocumentLoadSuccess}  >
                                                                        {
                                                                            Array.apply(null, Array(numPages)).map((x, i) => i + 1).map((page) => {
                                                                                return (
                                                                                    <Page pageNumber={page} renderAnnotationLayer={false} renderTextLayer={false} width={300} />
                                                                                )
                                                                            })
                                                                        }
                                                                    </Document>
                                                                </div>
                                                                    : (fileUrl.ext === 'jpg' || fileUrl.ext === 'apng' || fileUrl.ext === 'png' || fileUrl.ext === 'avif' || fileUrl.ext === 'gif' || fileUrl.ext === 'jpeg' || fileUrl.ext === 'jfif' || fileUrl.ext === 'pjpeg' || fileUrl.ext === 'pjp' || fileUrl.ext === 'webp') ? <div className=" d-flex justify-content-center w-100 h-100 "><img alt="..." src={fileUrl.fileName} className=" w-100 " /></div>
                                                                        : fileUrl.ext === 'mp4' ? <div className=" d-flex justify-content-center w-100 h-100 "><video alt="..." className="w-100 rounded-3" controls autoPlay={true} src={fileUrl.fileName}></video></div>
                                                                            : ''}

                                                            </TransformComponent>
                                                        </TransformWrapper>
                                                    </div>
                                                </div>
                                                <div className={" position-absolute h-75 w-100 bottom-0 z-2 " + clipClass}>

                                                    <div className="card h-100 w-100 bg-dark">
                                                        <div className=" card-header d-flex">
                                                            <div className=" text-info w-75">
                                                                <h3 className=" overflow-scroll scroll-bar-none space-no-wrap">{file.name}</h3>
                                                            </div>
                                                            <div className=" d-flex justify-content-end w-25">
                                                                <i className=" bi bi-x-circle text-danger fs-3 cursor-pointer" onClick={() => { setClipClass('d-none') }}></i>
                                                            </div>
                                                        </div>
                                                        <div className="card-body text-info">
                                                            <div className=" w-100 p-4">
                                                                {file.type === 'image/jpeg' ? <img src={clipImage} alt="..." className=" avatar-xxl" />
                                                                    : file.type === 'video/mp4' ? <video src={`${clipImage}#t=10`} autoPlay={false} className=" avatar-xxl"></video>
                                                                        : <div className=" position-absolute start-0 h-75 w-100 d-flex align-items-center justify-content-center">
                                                                            <img src={`https://pro.alchemdigital.com/api/extension-image/${ext}`} className="w-25" alt="..." />
                                                                        </div>}
                                                            </div>
                                                        </div>

                                                        <div className=" card-footer">
                                                            <textarea placeholder="Add Caption " className=" fs-6 top-0 px-3" value={message} onChange={(e) => { setMessage(e.target.value) }} />
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill sendIcon" style={{ color: '#8c60ff' }} viewBox="0 0 16 16" onClick={(e) => { sendChat(e); 
                                                                getChatData(); 
                                                                setClipClass('d-none'); setFileName('') }}>
                                                                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className=" position-absolute d-flex align-items-center bottom-0 start-0 w-100 px-3">

                                                    <div className={"card w-90 ms-5 h-100 position-absolute me-4 bg-secondary " + replayDisplay} style={{ top: '-6rem' }}>
                                                        <div className="crad-body h-100 border-start border-end-0 border-top-0 border-bottom-0 border-primary border-5 rounded-2 border-solid fs-5 cursor-pointer" onClick={() => { document.getElementById(msgId).scrollIntoView({ behavior: "smooth", block: "nearest" }) }}>
                                                            <div className="row mx-1 h-100">
                                                                <div className="col-9 row ">
                                                                    <div className="col-12 h-25 fw-semibold" style={{ color: '#04ff04' }}>{replayUerName === userName ? 'You' : replayUerName}</div>
                                                                    <div className="col-12 h-75">
                                                                        <div className=" ellipse overflow-hidden text-white-50">
                                                                            {replayExt !== '' ? <img src={`https://pro.alchemdigital.com/api/extension-image/${replayExt}`} style={{ width: '1rem' }} alt="..." className="me-1" /> : ''}
                                                                            {replayMsg === '' ? replayFname : replayMsg}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-2 h-100 p-1">
                                                                    <div className="d-flex h-100 align-center justify-content-center">
                                                                        {replayExt !== '' ? <img src={`https://pro.alchemdigital.com/api/extension-image/${replayExt}`} className="w-50" alt="..." /> : ''}
                                                                    </div>
                                                                </div>
                                                                <div className="col-1 h-100 cursor-pointer" onClick={() => { setreplayDisplay('d-none') }}>
                                                                    <i className="bi bi-x-circle text-danger fs-4 h-100 d-flex justify-content-end align-items-center"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={"card start-0 w-100 z-2 position-absolute bg-secondary d-flex justify-content-center " + editMsgDisplay} style={{ height: '10rem', top: '-4rem' }}>
                                                        <div className=" card-header h-50 bg-primary fs-5">
                                                            <div className="row">
                                                                <div className="col-12 row">
                                                                    <div className="fw-semibold col-12" style={{ color: '#04ff04' }}>Edit message</div>
                                                                    <div className="col-12 text-white-50 overflow-hidden ellipse">{edit.message}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={"crad-body h-50 rounded-2 cursor-pointer"} >
                                                            <div className="row h-100 px-2 fs-5">
                                                                <div className="col-10">
                                                                    <textarea value={editMsg} className="w-100 h-100 rounded-1 scroll-bar-none bg-transparent border-0 noOutline" onChange={(e) => { seteditMsg(e.target.value) }} />
                                                                </div>
                                                                <div className="col-2 row">
                                                                    <div className="col-6">
                                                                        <i className="bi bi-check fs-1 " onClick={() => { updatedChat(); seteditMsgDisplay('d-none'); setmsgId('') }}></i>
                                                                    </div>
                                                                    <div className="col-6">
                                                                        <i className="bi bi-x fs-1" onClick={() => { seteditMsgDisplay('d-none') }}></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <span class="badge badge-light bg-info position-absolute end-0 mr-3" style={{top:'-1rem'}}> {chatId.length>0?chatId.map(item=>item.view?item.view:''):''} </span> */}
                                                    <label for='clip' onClick={() => { setClipClass('d-flex') }}><i class="bi bi-paperclip fs-1 text-primary cursor-pointer"></i></label>
                                                    <input type="file" name="image" className="content-visibility d-none" id="clip" onChange={(e) => {
                                                        (e.target.files.length > 0 ? setClipImage(URL.createObjectURL(e.target.files[0])) : setClipImage(''));
                                                        (e.target.files.length > 0 ? setFile(e.target.files[0]) : setFile(''));
                                                        (e.target.files.length > 0 ? setExt(e.target.files[0].name.substring(e.target.files[0].name.lastIndexOf('.') + 1)) : setExt(''));
                                                        (e.target.files.length > 0 ? setSize(e.target.files[0].size) : setSize(''));
                                                        (e.target.files.length > 0 ? setName(e.target.files[0].name) : setName(''));
                                                        (e.target.files.length > 0 ? setFileName(e.target.files[0]) : setFileName(''))
                                                    }} />
                                                    <textarea placeholder="type a massage" className=" pt-3 px-3" value={message} onChange={(e) => { setMessage(e.target.value) }} />
                                                    {message !== "" ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill sendIcon" style={{ color: '#8c60ff' }} viewBox="0 0 16 16" onClick={(e) => { sendChat(e); 
                                                        getChatData(); 
                                                        updateView(); setreplayDisplay('d-none') }}>
                                                        <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
                                                    </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill sendIcon" viewBox="0 0 16 16">
                                                        <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
                                                    </svg>}
                                                </div>

                                                <div className={` position-absolute h-75 align-items-center justify-content-center w-100 z-3 ${loadClass}`}>
                                                    <div class="spinner-grow m-auto" role="status">
                                                        <span class="visually-hidden">Loading...</span>
                                                    </div>
                                                </div>



                                            </>}
                                        <div className={" position-absolute w-100 row m-auto " + inviteDisplay}>
                                            <div className="card offset-sm-2 col-sm-8 offset-sm-2 bg-dark-subtle">
                                                <div className=" card-header">
                                                    <h3 className=" text-primary d-flex justify-content-center">Send invite</h3>
                                                </div>
                                                <div className="card-body fs-4">
                                                    <input type="email" className=" form-control bg-transparent text-center fs-4" ref={inviteRef} placeholder="example@gmail.com" value={email} onChange={(e) => { setEmail(e.target.value); emailCheck(e) }} />
                                                    <div className={"fs-6 justify-content-center " + (error === '' ? 'd-none ' : 'd-flex ') + (error === 'user already exists' ? 'text-danger' : 'text-success')}>{error}</div>
                                                    <div className="btnDiv d-flex align-items-center justify-content-evenly mb-2 mt-5">
                                                        <button className=" btn btn-outline-success fs-4 " onClick={() => { setInviteDisplay('d-none'); setEmail(''); clickOn() }} disabled={check}>{check ?
                                                            <div class="spinner-border spinner-border-sm" style={{ height: '2rem', width: '2rem' }} role="status">
                                                                <span class="visually-hidden">Loading...</span>
                                                            </div> : "Invite"}</button>
                                                        <button className="btn btn-outline-danger fs-4" onClick={() => { setInviteDisplay('d-none'); setError(''); setEmail(''); setCheck(false) }}>Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={" position-absolute w-100 h-75 m-auto row " + memberDisplay}>
                                            <div className="card bg-dark bg-opacity-75 text-warning" style={{ backdropFilter: 'blur(5px)' }}>
                                                <div className=" cardHeader d-flex align-items-center justify-content-between">
                                                    <div className=" d-flex fs-3">Total Members <span className=" text-danger ps-2 fw-bolder"> {" " + member.length}</span></div>
                                                    <div className=" d-flex justify-content-end" >
                                                        <i className=" bi bi-x-circle text-danger fs-3 cursor-pointer " onClick={() => { setMemberDisplay('d-none') }}></i>
                                                    </div>
                                                </div>
                                                <div className=" card-body">

                                                    <div className="fs-4">
                                                        {
                                                            member.length > 0 ? member.map((item, index) =>
                                                                <div className=" d-flex justify-content-between">
                                                                    {item.email}
                                                                    <span>~{item.userName}</span>
                                                                </div>
                                                            ) : ''
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* groupexit conform */}
                                        <div>
                                            <div className={" position-absolute w-100 row m-auto " + exitDisplay}>
                                                <div className=" card offset-sm-2 col-sm-8 offset-sm-2 bg-transparent text-info fs-3 " style={{ backdropFilter: 'blur(5px)' }}>
                                                    <div className="card-body">
                                                        <div className=" d-flex justify-content-center mb-3">{userName} are sure exit from this group</div>
                                                        <div className=" d-flex justify-content-evenly mb-3">
                                                            <button className="btn btn-danger px-4 fs-3" ref={okRef} onClick={(e) => { setExitDisplay('d-none'); exitGroup(); setCheck(true) }} disabled={check}>
                                                                {check ?
                                                                    <div class="spinner-border spinner-border-sm" style={{ height: '2rem', width: '2rem' }} role="status">
                                                                        <span class="visually-hidden">Loading...</span>
                                                                    </div> : "ok"}
                                                            </button>
                                                            <button className="btn btn-success fs-3" onClick={() => { setExitDisplay('d-none') }}>cancel</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </> : <h3 className="ifChat d-flex align-items-center justify-content-center position-absolute h-75 w-100">Display chat</h3>}
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Home;
