import React, { useEffect, useState } from 'react';
import Profile from './Profile'
import Settings from './Settings'
import BloodBank from'./BloodBank'
import Doctor from'./Doctor'
import Patient from'./Patient'
import Department from'./Department'
import Dashboard from './Dashboard'
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
        marginTop: theme.spacing(2),
        },
    },
}))

let DefaultContent=(props)=>{
    const [ verifyStatus, setVerifyStatus ]=useState("")
    const classes = useStyles();

    useEffect(()=>{
        const queryParams = new URLSearchParams(window.location.search);
        const status = queryParams.get('status');
        setVerifyStatus(status)
        setTimeout(()=>{
            setVerifyStatus("")
        },10000)
    },[])

    return(
        <div className={classes.root} >
            {
                verifyStatus==="success" ?
                    <Alert className="email-success-alert animate__animated" variant="filled" severity="success">
                        Email Verified and Account Activated Successfully
                    </Alert>
                : ''
            }
            <div className="default-content">
                <Dashboard hospitalid={props.hospitalid} />
            </div>
        </div>
    )
}

let ProfileContent=(props)=>{
    useEffect(()=>{
        // document.querySelector('.main-container').style.background="linear-gradient(-20deg, #7f2de6 0%, #03f6d9 100%)";  
    },[])
    return(
        <div className="profile-content">
            <Profile hospitalid={props.hospitalid} />
        </div>
    )
}

let DoctorContent=(props)=>{
    return( 
        <div className="doctor-content">
            <Doctor hospitalid={props.hospitalid} />
        </div>
    )
}

let PatientContent=(props)=>{
    useEffect(()=>{
        document.querySelector('body').style.overflow="hidden"
    })
    return( 
        <div className="patient-content">
            <Patient hospitalid={props.hospitalid} />
        </div>
    )
}

let SettingsContent=()=>{
    return(
        <div className="settings-content">
            <Settings />
        </div>
    )
}

let DepartmentContent=()=>{
    return( 
        <div className="bloodbank-content">
            <Department />
        </div>
    )
}

let BloodBankContent=()=>{
    return( 
        <div className="bloodbank-content">
            <BloodBank />
        </div>
    )
}

let Footer=()=>{
    return(
        <footer>
            <h4>footer</h4>
        </footer>
    );
}

let NotFound=()=>{
    return(
        <div>
            <h1>Not Found</h1>
        </div>
    )
}

export { DefaultContent, ProfileContent, SettingsContent, BloodBankContent, DoctorContent, PatientContent, DepartmentContent, Footer, NotFound }