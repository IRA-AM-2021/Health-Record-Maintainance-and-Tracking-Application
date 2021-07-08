import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import HospitalAdminHomePage from './Home/HospitalAdminHomePage';
import PatientHomePage from './Home/PatientHomePage';
import DoctorHomePage from './Home/DoctorHomePage';
import DefaultHomePage from './Home/DefualtHomePage';

export default function HomePage(props){

    let homePageStatus=props.display;

    if(homePageStatus === "Hospital")
        return <Redirect to='/admin/dashboard' />
    else if(homePageStatus === "Patient")
        return <PatientHomePage />;
    else if(homePageStatus === "Doctor")
        return <DoctorHomePage />;
    else 
        return <DefaultHomePage />;
}
