import React, { useEffect, useState } from 'react'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dateFormat from 'dateformat'

let Timeline = (props) => {

    const [timeline,setTimeline]=useState([])
    const [doctor,setDoctor]=useState("")

    const animateFromTo = (elem, direction) => {
        const offset = 1000;
        let x = 0;
        let y = direction * offset;

        direction = direction | 1;

        if(elem.classList.contains("slide_from_left")) {
            x = -offset;
            y = 0;
        } 
        else if(elem.classList.contains("slide_from_right")) {
            x = offset;
            y = 0;
        }

        gsap.fromTo(elem,{ 
                x: x, 
                y: y, 
                autoAlpha: 0 
            },
            {
                duration: 1.25,
                x: 0,
                y: 0,
                autoAlpha: 1,
                ease: "expo",
                overwrite: "auto",
            }
        );
    };

    const hide = (elem) => {
        gsap.set(elem, { autoAlpha: 0 });
    };

    useEffect(() => {
        setTimeout(()=>{
          
            gsap.registerPlugin(ScrollTrigger);

            gsap.utils.toArray(".animate").forEach(function (elem) {
                hide(elem);

                ScrollTrigger.create({
                    trigger: elem,
                    onEnter: function () {
                        animateFromTo(elem);
                    },
                    onEnterBack: function () {
                        animateFromTo(elem, -1);
                    },
                    onLeave: function () {
                        hide(elem);
                    },
                })
            })
        },500)
        getHistoryInfo()

    },[props.userid])

    let getHistoryInfo=async()=>{
        if(!localStorage.getItem('JAM_DISPLAY_CONTENT')){
            window.location.href="/"
        }
        else{
            let response=await fetch(`http://localhost:8000/api/patient/patients-prescription-history/?aadhar_number=${props.userid}`,{
                headers:{'Content-Type': 'application/json'}
            })
            let content=await response.json()
            setTimeline(content)
        }
    }

    let getDoctorName=(name)=>{

        let doctorName=''

        fetch(`http://localhost:8000/api/doctor/doctors-details/?doctor_id=${name}`)
        .then(response => response.json())
        .then(data => {
            setDoctor(data.name)
        })
        return doctor
    }

    return(
        <div className="timeline">
            <ul>
                {timeline.map((history, idx) => {
                    return (
                        <li key={`${history.id}_${history.entered_date}`}>
                            <div className={`content animate ${idx % 2 === 0 ? "slide_from_left" : "slide_from_right"}`}>
                                <h3
                                    className={`animate ${
                                    idx % 2 === 0 ? "slide_from_left" : "slide_from_right"
                                    }`}
                                >
                                    {history.cause}
                                </h3>
                                <p
                                    className={`animate ${
                                    idx % 2 === 0 ? "slide_from_left" : "slide_from_right"
                                    }`}
                                >
                                    {history.description}

                                    <br /><span className="text-success">Revisit Date : {history.revisit_date}</span>
                                    <br /><span className="text-danger">By <span style={{fontFamily:"jokerman"}}>Dr.{getDoctorName(history.doctor_id)}</span></span>
                                </p>
                            </div>
                            <div
                            className={`time animate ${
                                idx % 2 === 0 ? "slide_from_right" : "slide_from_left"
                            }`}
                            >
                            <h4>{dateFormat(history.entered_date, "mmmm dS, yyyy")}</h4>
                            </div>
                        </li>
                    );
                })}
                <div style={{ clear: "both" }}></div>
            </ul>
        </div>
    )
}
export default Timeline
