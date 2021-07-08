import React,{ useEffect, useState } from 'react'
import { Route, BrowserRouter, Link, NavLink, Switch } from 'react-router-dom'
import { Button, Modal, ModalHeader, Row, Col, ModalBody, ModalFooter } from 'react-bootstrap'
import { DefaultContent, PatientContent, DoctorContent, Footer, NotFound } from './Doctor'
import img from './../../../../images/verify.jpg'

export default function NavSection() {

    const [ isSuccess, setIsSuccess ]=useState(false)  
    const [ userID, setUserID ]=useState()
    const [ hospitalID, setHospitalID ]=useState()
    const [ logo,setLogo ]=useState("")
    const [ email,setEmail ]=useState("")
    const [ is_email_Verified, setIsEmailVerified ]=useState(false)
    const [isLoading,setIsLoading]=useState(false);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () =>  setShow(true);

    useEffect(()=>{
        (
            async()=>{
                if(!localStorage.getItem('JAM_DISPLAY_CONTENT')){
                    window.location.href="/"
                }
                let response=await fetch('http://localhost:8000/api/doctor/profile/',{
                    headers:{'Content-Type': 'application/json'},
                    credentials:'include'
                })
                let content=await response.json()
                console.log(content)
                let isErr=content.detail
                if(isErr==="Unauthenticated"){
                    logout();
                }
                else{
                    setUserID(content.app_id)
                    setLogo("http://localhost:8000"+content.logo)
                    setHospitalID(content.hospital_id)
                    setIsEmailVerified(content.email_Verified)
                    setEmail(content.email)
                    setIsLoading(true)
                    // console.log(logo)
                }
            }
        )()
    })

    let logout=async ()=>{
        handleClose()
        let response=await fetch('http://localhost:8000/api/doctor/logout/',{
            method:"POST",
            headers:{'Content-Type': 'application/json'},
            credentials:'include'
        })

        let content=await response.json()
        if(content.message==='success'){
            localStorage.removeItem('JAM_DISPLAY_CONTENT')  
            window.location.href='/'    
            setIsSuccess(true)
        }
    }

    let maxNav=()=>{
        let sideNavBar=document.querySelector(".sidebar-nav-main")
        sideNavBar.classList.toggle('active-nav')
    }

    return (
        <BrowserRouter>
            <div className="doctor-container">
                <div className="sidebar-nav-main">
                    <div className="logo-content">
                        <div className="logo" style={{userSelect:"none", textAlign: 'center'}} >
                            <img src={logo} style={{cursor:"pointer"}} className="doctor-profile-img" />
                            <div className="logo-name"><span>Dr. </span> Admin</div> 
                        </div>
                        <i className="bx bx-menu" onClick={maxNav} style={{fontSize:"35px"}} id="btn"></i>
                    </div>
                    <hr style={{border:"2px solid white"}} />
                    <ul style={{userSelect:"none"}} className="nav-list-section">
                        <li>
                            <NavLink activeClassName="active-admin-link" className="alink" to="/doctor/dashboard">
                                <i className="bx bx-grid-alt"></i>
                                <span className="links-name">Dashboard</span>
                            </NavLink>
                            <span className="tooltip">Dashboard</span>
                        </li>
                        <li>
                            <NavLink activeClassName="active-admin-link" className="alink" to="/doctor/patients">
                                <i className="fab fa-accessible-icon"></i>
                                <span className="links-name">Patients</span>
                            </NavLink>
                            <span className="tooltip">Patients</span>
                        </li>
                        <li>
                            <NavLink activeClassName="active-admin-link" className="alink" to="/doctor/lists">
                                <i className='fas fa-user-md'></i>
                                <span className="links-name">Doctors</span>
                            </NavLink>
                            <span className="tooltip">Doctors</span>
                        </li>
                        <li>
                            <NavLink activeClassName="active-admin-link" className="alink" to="/admin/calendar">
                                <i className="far fa-calendar-alt"></i>
                                <span className="links-name">Calendar</span>
                            </NavLink>
                            <span className="tooltip">Calendar</span>
                        </li>
                         <li>
                            <NavLink activeClassName="active-admin-link" className="alink" to="/admin/settings">
                                <i className='fas fa-cogs'></i>
                                <span className="links-name">Settings</span>
                            </NavLink>
                            <span className="tooltip">Settings</span>
                        </li>
                        <li>
                            <NavLink activeClassName="active-admin-link" className="alink" to="/admin/help">
                                <i className='bx bxs-help-circle'></i>
                                <span className="links-name">Help</span>
                            </NavLink>
                            <span className="tooltip">Help</span>
                        </li>
                        <li>
                            <Link onClick={handleShow} className="alink" to="/admin/help">
                                <i className="bx bx-log-out" id="log-out"></i>
                                <span className="links-name">Logout</span>
                            </Link>
                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                <Modal.Title>Confirm</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>Are You sure about to Logout of the Application ?</Modal.Body>
                                <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    No
                                </Button>
                                <Button variant="danger" name="logout" onClick={logout}>
                                    Yes! Logout
                                </Button>
                                </Modal.Footer>
                            </Modal>
                        </li>
                    </ul>
                </div>
                <div className="main-container">
                    <div className="content-admin my-3" > 
                        <Switch>
                            <Route exact path="/doctor" component={DefaultContent} />
                            <Route path="/doctor/dashboard" component={DefaultContent} />
                            {/* <Route path="/admin/profile" component={()=><ProfileContent hospitalid={props.hospitalid} />} /> 
                            <Route path="/admin/doctors" component={()=><DoctorContent hospitalid={props.hospitalid} />} /> 
                            <Route path="/admin/settings" component={SettingsContent} /> */}
                            <Route path="/doctor/patients" component={()=><PatientContent appid={userID} hospitalid={hospitalID} />} /> 
                            <Route path="/doctor/lists" component={()=><DoctorContent appid={userID} hospitalid={hospitalID} />} /> 
                            {/*<Route path="/admin/help" component={ProfileContent} /> 
                            <Route path="/admin/calendar" component={ProfileContent} /> 
                            <Route path="/admin/infra" component={ProfileContent} /> 
                            <Route path="/admin/blood-bank" component={BloodBankContent} /> 
                            <Route path="/admin/dept" component={DepartmentContent} /> 
                            <Route path="*" component={DefaultContent} />  */}
                        </Switch>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    )
}
