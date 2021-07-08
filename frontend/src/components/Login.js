import React,{useState,useEffect} from 'react'
import { AppBar,Tabs,Tab } from '@material-ui/core'
import Forms, { HospitalLoginForm,DoctorLoginForm,PatientLoginForm } from './forms/Form'
import image from './../images/girl_laptop.svg'
import './../styles/app.css'
import vid from './../videos/vid1.mp4'

let Login=()=>{
    const [value,setValue]=useState(0)
    useEffect(()=>{
        if(localStorage.getItem('JAM_DISPLAY_CONTENT')){
            window.location.href='/'
        }
    },[]);
    const handleChange=(e,value)=>{
        setValue(value);
    }
    
    return(
        <div className="login-options">
            <video autoplay="true" loop muted id="myVideo">
                <source src={vid} type="video/mp4" />
            </video><br /><br /><br />
            <div className="tab-container">
                <AppBar position="static">
                    <Tabs value={value} centered TabIndicatorProps={{style: { transition:"0.4s", background: "white", height: "6px", top: "58x" }}} onChange={handleChange} aria-label="simple tabs example">
                        <Tab label="Hospital" />
                        <Tab label="Doctor" />
                        <Tab label="Patient" />
                    </Tabs>
                </AppBar>
                <div className="z-depth-3 tab-panel-display">
                    <div className="tab-contents">
                        <TabPanel value={value} index={0}>
                            <Forms type="HospitalLoginForm" />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <Forms type="DoctorLoginForm" />
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <Forms type="PatientLoginForm" />
                        </TabPanel>
                    </div>
                </div>
            </div>
        </div>
    );
}

let TabPanel=(props)=>{
    const {children,value,index}=props;
    return(
        <div>
            {
                value===index && (
                <div>{children}</div>
                )
            }
        </div>
    );
}

export default Login;
