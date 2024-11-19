import React, { useState } from "react";
import { Link } from "react-router-dom";

const Invite = () =>{
    const[email,setEmail] = useState('')
    
    return(
        <>
        <div className="menuDiv">
            <div className="inviteDiv">
                <input type="text" placeholder="enter email"/>
            </div>
        </div>
        </>
    )
}

export default Invite;