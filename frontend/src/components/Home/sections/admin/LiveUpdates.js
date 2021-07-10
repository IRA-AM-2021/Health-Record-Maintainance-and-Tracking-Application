import React,{ useEffect, useState } from 'react'
import dateFormat from 'dateformat'
import Scroll from 'react-scroll';

var Link = Scroll.Link;
var DirectLink = Scroll.DirectLink;
var Element = Scroll.Element;
var Events = Scroll.Events;
var scroll = Scroll.animateScroll;
var scrollSpy = Scroll.scrollSpy;

export default function LiveUpdates({patientData}) {
    
    const [count, setCount]=useState(0)

    return (
        <div style={{marginTop:"45px"}} className="live-updates-under-admin">
            <h5 className="text-center" style={{fontFamily:"'Racing Sans One',cursive",fontSize:"25px",paddingBottom:"5px"}}>Recent Updates</h5>
            <Link activeClass="active" to="secondInsideContainer" className="clickScroll" smooth={true} duration={5000} containerId="containerElement" style={{ display: 'none', margin: '20px' }}>click</Link>
            <Element name="test7" className="element live-updates-section" id="containerElement" style={{ position: 'relative',marginTop:"20px",paddingTop:"-20px",paddingBottom:"65px", height: '85vh', overflow: 'scroll', marginBottom: '30px'}}>
                <div className="live-content-msg">
                    {
                        patientData.map((data) => (
                            <p onLoad={() => setCount((count+ 2))} className="list-patient-live" style={{animationDelay:`${count}+s`}} key={data.id}>
                                {data.patient_name}'s Account Created &nbsp; 
                                    <span className="live-span-top" style={{fontSize:"11px"}}><sup>{dateFormat(data.created_at, "mmmm dS, yyyy")}</sup></span>
                            </p> 
                        ))              
                    } 
                </div>
                <Element name="secondInsideContainer">
                </Element>
            </Element>
        </div>
    )
}
