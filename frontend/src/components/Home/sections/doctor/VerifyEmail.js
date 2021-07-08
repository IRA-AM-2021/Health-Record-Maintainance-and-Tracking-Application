import React, { useEffect, useState } from 'react'

export default function VerifyEmail() {
    const [ verifyStatus, setVerifyStatus ]=useState("")
    // const classes = useStyles();
    useEffect(()=>{
        (
            async()=>{
                const queryParams = new URLSearchParams(window.location.search);
                const token = queryParams.get('token');
                const email = queryParams.get('email');
                let formField =new FormData()
                formField.append('email',email)
                formField.append('verify_token',token)

                let response=await fetch('http://localhost:8000/api/doctor/token-verify/',{
                        method: 'POST',
                        credentials:'include',
                        body:formField
                    })
                let content=await response.json()
                console.log(content)
                if(content.message==="success"){
                    window.location.href="/doctor"
                    setVerifyStatus("Email Verified Successfully")
                }
                else{
                    setVerifyStatus("Invalid Token")
                }
            }
        )()
    })

    return (
        <div>
            <h4>{verifyStatus}</h4>
        </div>
    )
}
