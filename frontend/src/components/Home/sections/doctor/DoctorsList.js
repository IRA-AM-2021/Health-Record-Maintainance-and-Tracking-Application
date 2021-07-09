import React, { useEffect, useState } from 'react'

export default function DoctorsList(props) {

    const [doctorsList,setDoctorsList]=useState([])

    useEffect(()=>{
        (
            async()=>{
                let response=await fetch('http://localhost:8000/api/doctor/doctors-lists/',{
                    headers:{'Content-Type': 'application/json'}
                })
                let content=await response.json()
                setDoctorsList(content)
            }
        )()
    },[])

    let redirectURL=(event)=>{
        console.log(event.target.getAttribute('data-target'))
        // window.location.href="/"
    }

    return (
        <div className="doctors-list-grid-content">
            <div className="container-card">
                <div className="heading">Doctors</div>
                <div className="cards-wrapper">
                    {
                        doctorsList.map((doctor)=>(
                            <div className="card" key={doctor.id}>
                                <img src="https://images.unsplash.com/photo-1551554781-c46200ea959d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80" alt="top1" className="image-top" />
                                <img src={"http://localhost:8000" + doctor.logo} alt="image1" className="profile-image" />
                                <h1 className="fullname">{doctor.name}</h1>
                                <h3 className="job">{doctor.dept}</h3>
                                <p className="about-me">
                                    {/* {doctorHospitalDetails.hospital_name}<br/>
                                    {doctorHospitalDetails.branch},<br />
                                    {doctorHospitalDetails.pincode} */}

                                    {/* {getLists(doctor.hospital_id)} */}

                                    <DoctorHospitalDetails hospitalid={doctor.hospital_id} />
                                </p>
                                <a className="mobile-btn" href={"tel:"+doctor.mobile_no}><i className="fas fa-phone-volume"></i> Contact me</a>
                                <ul className="social-icons">
                                    { 
                                        doctor.fb_url!=="" ? 
                                        <li>
                                            <p onClick={redirectURL}><i data-target={doctor.fb_url} className="fab fa-facebook-f"></i></p>
                                        </li> : ''
                                    }
                                    {
                                        doctor.tweet_url!=="" ?
                                        <li>
                                            <p onClick={redirectURL}><i data-target={doctor.tweet_url} className="fab fa-twitter"></i></p>
                                        </li> : ''
                                    }
                                    {
                                        doctor.insta_url!=="" ?
                                        <li>
                                            <p onClick={redirectURL}><i data-target={doctor.insta_url} className="fab fa-instagram"></i></p>
                                        </li> : ''
                                    }
                                    <li title="email">
                                        <a href={"mailto:"+doctor.email}><i className="far fa-envelope-open"></i></a>
                                    </li>
                                </ul>
                            </div>     
                        ))
                    }             
                </div>
            </div>
        </div>
    )
}


let DoctorHospitalDetails=(props)=>{

    const [hospitalDetails, setHospitalDetails]=useState([])

    useEffect(()=>{
        (
            async()=>{    
                let response=await fetch(`http://localhost:8000/api/hospital-details/?hospital_id=${props.hospitalid}`)
                let content=await response.json()
                setHospitalDetails(content)
            }
        )()
    },[])

    return (
        <p>
            {hospitalDetails.hospital_name} ,
            {hospitalDetails.branch} ,<br />
            {hospitalDetails.pincode} <br />

            <b>Email</b> : {hospitalDetails.email}
        </p>
    )
}