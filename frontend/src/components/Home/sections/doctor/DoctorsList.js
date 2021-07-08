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

    let redirectURL=()=>{
        window.location.href="/"
    }

    return (
        <div className="doctors-list-grid-content">
            <div className="container-card">
                <div className="heading">Doctors</div>
                <div className="cards-wrapper">
                    {
                        doctorsList.map((doctor)=>(
                            <div className="card" key={doctor.id}>
                                <img src="https://i.imgur.com/v1fzRXv.jpg" alt="top1" className="image-top" />
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
                                <button type="button">Contact me</button>
                                <ul className="social-icons">
                                    <li>
                                        <p  data-target="1" onClick={redirectURL}><i className="fab fa-facebook-f"></i></p>
                                    </li>
                                    <li>
                                        <p data-target="1" onClick={redirectURL}><i className="fab fa-twitter"></i></p>
                                    </li>
                                    <li>
                                        <p data-target="1" onClick={redirectURL}><i className="fab fa-instagram"></i></p>
                                    </li>
                                    <li>
                                        <p data-target="1" onClick={redirectURL}><i className="far fa-envelope-open"></i></p>
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

            Email : {hospitalDetails.email}
        </p>
    )
}