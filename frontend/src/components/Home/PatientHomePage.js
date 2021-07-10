import React, { useEffect, useState } from 'react';
import NavSection from './sections/patient/NavSection'

let PatientHomePage=()=>{

    const [ userID, setUserID ]=useState()
    const [ hospitalID, setHospitalID ]=useState()
    const [ logo,setLogo ]=useState("")
    const [ name,setName ]=useState("")
    const [ email,setEmail ]=useState("")
    const [show, setShow] = useState(false);

    useEffect(()=>{
        (
            async()=>{
                if(!localStorage.getItem('JAM_DISPLAY_CONTENT')){
                    window.location.href="/"
                }
                let response=await fetch('http://localhost:8000/api/patient/patient-login-verify/',{
                    headers:{'Content-Type': 'application/json'},
                    credentials:'include'
                })
                let content=await response.json()
                // console.log(content)
                let isErr=content.detail
                if(isErr==="Unauthenticated"){
                    logout();
                }
                else{
                    setUserID(content.aadhar_number)
                    setLogo(content.logo)
                    setHospitalID(content.account_created_hospital_id)
                    setEmail(content.email)
                    setName(content.patient_name)
                }
            }
        )()
    })

    let logout=async ()=>{
        let response=await fetch('http://localhost:8000/api/patient/logout/',{
            method:"POST",
            headers:{'Content-Type': 'application/json'},
            credentials:'include'
        })

        let content=await response.json()
        if(content.message==='success'){
            localStorage.removeItem('JAM_DISPLAY_CONTENT')  
            window.location.href='/'    
        }
    }

    return(
        <div className="patient-page">
            {
                <NavSection userlogo={logo} hospitalid={hospitalID} userid={userID} name={name} />
            }
        </div>
    );
}

export default PatientHomePage;