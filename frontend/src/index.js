import React, { useEffect, useState, createContext } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import { Route, BrowserRouter } from 'react-router-dom'
import "regenerator-runtime/runtime.js"
import App from './App'
import Login from './components/Login'
import { HospitalRegisterForm, HospitalLoginForm } from'./components/forms/Form'
import reportWebVitals from './reportWebVitals';
import './styles/app.css'
import './styles/style.css'
import './styles/app.scss'
import './styles/doctor.scss'
import { enableSite } from './components/Storage.js'
import HospitalAdminHomePage from './components/Home/HospitalAdminHomePage'
import DoctorHomePage from './components/Home/DoctorHomePage'
import PatientHomePage from './components/Home/PatientHomePage'
import verifyDoctorEmail from './components/Home/sections/doctor/VerifyEmail'

export const ActiveSite=React.createContext();

let Router=()=>{
    
    const [site,setSite]=useState(enableSite());

    return(
        <ActiveSite.Provider value={site}>
            <React.Fragment>
                <BrowserRouter>
                    <Route exact path="/" component={App} />
                    <Route path="/admin" component={HospitalAdminHomePage} />
                    <Route path="/doctor" component={DoctorHomePage} />
                    <Route path="/patient" component={PatientHomePage} />
                    <Route path="/login" component={Login} /> 
                    <Route path="/Hospital-Registration" component={HospitalRegisterForm} />
                    <Route path="/Hospital-Login" component={HospitalLoginForm} />
                    <Route path="/verify-token" component={verifyDoctorEmail} />
                </BrowserRouter>
            </React.Fragment>  
        </ActiveSite.Provider>   
    )
}

ReactDOM.render(<Router/>, document.getElementById('root'))

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
// Illustration by <a href="https://icons8.com/illustrations/author/5eb29f8301d0360018f18b01">Maria Shukshina</a> from <a href="https://icons8.com/illustrations">Ouch!</a>