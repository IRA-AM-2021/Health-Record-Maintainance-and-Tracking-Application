import React, { useEffect, useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap'
import { Tooltip } from 'reactstrap';
import { Route, BrowserRouter, Link, NavLink, Switch } from 'react-router-dom'
import { DefaultContent, ProfileContent, SettingsContent, BloodBankContent, DoctorContent, PatientContent, DepartmentContent, Footer, Greet, NotFound } from './Admin'
import Working from './Working'

export default function NavSection(props){

    const [ isSuccess, setIsSuccess ]=useState(false)
    const { buttonLabel, className } = props;
    const [modal, setModal] = useState(false);
    const [ visibleContent, setVisibleContent ]=useState("Default")
    const [adminLogoPath,setAdminLogoPath] = useState("")

    useEffect(() => {
        setAdminLogoPath("https://www.shareicon.net/data/2016/07/26/801997_user_512x512.png")
    },[])
    
    useEffect(()=>{
        (
            async()=>{
                let response=await fetch('http://localhost:8000/api/hospital-admin/',{
                    headers:{'Content-Type': 'application/json'},
                    credentials:'include'
                })
                let content=await response.json()
                let isErr=content.detail
                if(isErr==="Unauthenticated"){
                    logout();
                }
                else{
                    let imgLogo=content.logo
                    setAdminLogoPath("http://localhost:8000"+imgLogo)
                    // let imgLogoModified=imgLogo.replaceAll("/media/media", "/media")// imgLogo.replace("/media", "")
                    // setAdminLogoPath(require("./../../../../backend"+imgLogoModified).default)
                }
            }
        )()
    })

    const toggle = (e) => {
        setModal(!modal);
        if(e.target.name==="logout"){
            logout()
        }
    }

    let logout=async ()=>{
        handleClose()
        let response=await fetch('http://localhost:8000/api/hospital-logout/',{
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

    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [tooltipOpen2, setTooltipOpen2] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () =>  setShow(true);

    const toggleTooltipClose = () => setTooltipOpen(!tooltipOpen);
    const toggleTooltipLogout = () => setTooltipOpen2(!tooltipOpen2);

    let maxNav=()=>{
        let sideNavBar=document.querySelector(".sidebar-nav-main")
        sideNavBar.classList.toggle('active-nav')
    }

    // let activeTab=(e)=>{
    //     let modify=e.target.getAttribute("datatarget")-1
    //     let count=listItems.length
    //     console.log(modify)
    //     document.querySelectorAll('.nav-list-section .alink')[modify].classList.add('active')
    //     for(let i=0;i<count;i++)
    //         if(i!=modify)
    //             document.querySelectorAll('.nav-list-section .alink')[i].classList.remove('active')
    //         else
    //             continue;
    // }

    // let listItems=document.querySelectorAll('.nav-list-section .alink');
    // for(let i=0;i<listItems.length;i++){
    //     listItems[i].addEventListener('click',activeTab)
    // }

    return(
        <BrowserRouter>
            <div className="admin-container">
                <div className="sidebar-nav-main">
                    <div className="logo-content">
                        <div className="logo" style={{textAlign: 'center'}} >
                            {/* <i className="fas fa-hospital-alt" aria-hidden="true"></i> */}
                            {/* <i className="fas fa-hospital-user" aria-hidden="true"></i> */}
                            <i className="fa fa-hospital-o" aria-hidden="true"></i>
                            {/* <div className="logo-name">Admin</div> */}
                        </div>
                        <i className="bx bx-menu" onClick={maxNav} id="btn"></i>
                        {/* <Tooltip placement="right" isOpen={tooltipOpen} target="btn" toggle={toggleTooltipClose}>
                            Close
                        </Tooltip> */}
                    </div>
                    <ul style={{userSelect:"none"}} className="nav-list-section">
                        {/* <li>
                            <i className='bx bx-search' onClick={maxNav} ></i>
                            <input type="text" placeholder="Search..." />
                            <span className="tooltip">Dashboard</span>
                        </li> */}
                        <li>
                            <NavLink datatarget="1" activeClassName="active-admin-link" className="alink" to="/admin/dashboard">
                                <i datatarget="1" className="bx bx-grid-alt"></i>
                                <span datatarget="1" className="links-name">Dashboard</span>
                            </NavLink>
                            <span className="tooltip">Dashboard</span>
                        </li>
                        <li>
                            <NavLink datatarget="2" activeClassName="active-admin-link" className="alink" to="/admin/profile">
                                <i datatarget="2" className="fa fa-user" aria-hidden="true"></i>
                                <span datatarget="2" className="links-name">Profile</span>
                            </NavLink>
                            <span className="tooltip">Profile</span>
                        </li>
                        <li>
                            <NavLink datatarget="5" activeClassName="active-admin-link" className="alink" to="/admin/dept">
                                <i datatarget="5" className="far fa-address-card"></i>
                                <span datatarget="5" className="links-name">Departments</span>
                            </NavLink>
                            <span className="tooltip">Departments</span>
                        </li>
                        <li>
                            <NavLink datatarget="3" activeClassName="active-admin-link" className="alink" to="/admin/doctors">
                                <i datatarget="3" className='fas fa-user-md'></i>
                                <span datatarget="3" className="links-name">Doctors</span>
                            </NavLink>
                            <span className="tooltip">Doctors</span>
                        </li>
                        <li>
                            <NavLink datatarget="4" activeClassName="active-admin-link" className="alink" to="/admin/patients">
                                <i datatarget="4" className="fab fa-accessible-icon"></i>
                                <span datatarget="4" className="links-name">Patients</span>
                            </NavLink>
                            <span className="tooltip">Patients</span>
                        </li>
                        {/* <li>
                            <NavLink datatarget="6" activeClassName="active-admin-link" className="alink" to="/admin/blood-bank">
                                <i datatarget="6" className='bx bxs-bank'></i>
                                <span datatarget="6" className="links-name">Blood Bank</span>
                            </NavLink>
                            <span className="tooltip">Blood Bank</span>
                        </li> */}
                        <li>
                            <NavLink datatarget="8" activeClassName="active-admin-link" className="alink" to="/admin/infra">
                                <i datatarget="8" className="far fa-object-ungroup"></i>
                                <span datatarget="8" className="links-name">Infrastructure</span>
                            </NavLink>
                            <span className="tooltip">Infrastructure</span>
                        </li>
                        <li>
                            <NavLink datatarget="9" activeClassName="active-admin-link" className="alink" to="/admin/calendar">
                                <i datatarget="9" className="far fa-calendar-alt"></i>
                                <span datatarget="9" className="links-name">Calendar</span>
                            </NavLink>
                            <span className="tooltip">Calendar</span>
                        </li>
                         <li>
                            <NavLink datatarget="7" activeClassName="active-admin-link" className="alink" to="/admin/settings">
                                <i datatarget="7" className='fas fa-cogs'></i>
                                <span datatarget="7" className="links-name">Settings</span>
                            </NavLink>
                            <span className="tooltip">Settings</span>
                        </li>
                        <li>
                            <NavLink datatarget="10" activeClassName="active-admin-link" className="alink" to="/admin/help">
                                <i datatarget="10" className='bx bxs-help-circle'></i>
                                <span datatarget="10" className="links-name">Help</span>
                            </NavLink>
                            <span className="tooltip">Help</span>
                        </li>
                    </ul>
                    <div className="profile-content">
                        <div className="profile">
                            <div className="profile-details">
                                <img src={adminLogoPath} loading="lazy" alt="" />
                                <div style={{textAlign:"center"}} className="name-job"> 
                                    <div className="name">Admin</div>
                                    <div className="job">{props.userid}</div>
                                </div>                           
                            </div>
                            <i className="bx bx-log-out" onClick={handleShow} id="log-out"></i>
                            {/* <Tooltip placement="right" isOpen={tooltipOpen2} target="log-out" toggle={toggleTooltipLogout}>
                                Logout
                            </Tooltip> */}
                        </div>
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
                    </div>
                </div>
                <div className="main-container">
                    {/* <h2 className="text"> Future strong Memorial Hospital - 629200 </h2> */}
                    <div className="content-admin"> 
                        <Switch>
                            {/* <Route exact path="/admin" component={DefaultContent} /> */}
                            <Route path="/admin/dashboard" component={()=><DefaultContent hospitalid={props.hospitalid} />} />
                            <Route path="/admin/profile" component={()=><ProfileContent hospitalid={props.hospitalid} />} /> 
                            <Route path="/admin/doctors" component={()=><DoctorContent hospitalid={props.hospitalid} />} /> 
                            <Route path="/admin/settings" component={Working} /> 
                            <Route path="/admin/patients" component={()=><PatientContent hospitalid={props.hospitalid} />} /> 
                            <Route path="/admin/help" component={Working} /> 
                            <Route path="/admin/calendar" component={Working} /> 
                            <Route path="/admin/infra" component={Working} /> 
                            <Route path="/admin/blood-bank" component={Working} /> 
                            <Route path="/admin/dept" component={DepartmentContent} />
                            <Route path="*" component={()=><DefaultContent hospitalid={props.hospitalid} />} /> 
                        </Switch>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    )
}