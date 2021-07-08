import React,{ useEffect, useState, useRef, createRef, useContext } from 'react'
import { TransitionGroup } from 'react-transition-group'
import { makeStyles } from '@material-ui/core/styles'
import Badge from '@material-ui/core/Badge'
import MailIcon from '@material-ui/icons/Mail';
import { patientID, doctorPassword } from './../../../Unique.js'
import { Container, Button, Form, InputGroup, Row, Col, Spinner, Popover, OverlayTrigger } from 'react-bootstrap'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import FingerprintIcon from '@material-ui/icons/Fingerprint'
import EventNoteIcon from '@material-ui/icons/EventNote'
import ContactMailIcon from '@material-ui/icons/ContactMail'
import ContactPhoneIcon from '@material-ui/icons/ContactPhone'
import PersonIcon from '@material-ui/icons/Person'
import LiveUpdates from './LiveUpdates'

var validator = require('aadhaar-validator')

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

export default function Patient(props) {
    const inputFocusRef=useRef()
    
    const [patientData, setPatientData]=useState([])

    const [patientAccount,setPatientAccount]=useState({
        patient_name:'',email:'',account_created_hospital_id:props.hospitalid,address:'',
        password:doctorPassword(),aadhar_number:'',app_id:patientID(),mobile_no:0,date_of_birth:''
    })

    const [valid,setValid]=useState(false)
    const [open, setOpen] = React.useState(false);
    const [transition, setTransition] = React.useState(undefined);
    const [isAadharErr,setIsAadharErr]=React.useState(false)
    const [aadharMsg,setAadharMsg]=React.useState("")
    const [isMobileErr,setIsMobileErr]=React.useState(false)
    const [mobileMsg,setMobileMsg]=React.useState("")
    const [isEmailErr,setIsEmailErr]=React.useState(false)
    const [emailMsg,setEmailMsg]=React.useState("")

    let collectData=(event)=>{
        if(event.target.name==="aadhar_number"){
            let isValid=validator.isValidNumber(event.target.value)
            if(isValid){
                setIsAadharErr(false)
                setValid(true)
                setIsAadharErr(false)
                setAadharMsg("")

            }
            else{
                setValid(false)
                setIsAadharErr(true)
                setAadharMsg("Aadhar Card Number is not Valid")
            }
        }
        else{
            setValid(true)
        }
        setIsMobileErr(false)
        setIsEmailErr(false)
        // setValid(true)
        setPatientAccount({...patientAccount,[event.target.name]:event.target.value})
    }

    let createPatientAccount=async (e)=>{
        e.preventDefault()
        // let formField=new FormData()
        // formField.append() 
        let isValid=validator.isValidNumber(patientAccount.aadhar_number)
        if(isValid){
            setIsAadharErr(false)
            setValid(true)
            setIsAadharErr(false)
            setAadharMsg("")

            setPatientAccount({
                patient_name:patientAccount.patient_name,email:patientAccount.email,account_created_hospital_id:props.hospitalid,address:patientAccount.address,
                password:doctorPassword(),aadhar_number:patientAccount.aadhar_number,app_id:patientID(),mobile_no:patientAccount.mobile_no,date_of_birth:patientAccount.date_of_birth
            })

            let response=await fetch("http://localhost:8000/api/patient/account-create/",{
                headers:{'Content-Type':'application/json'},
                method:"POST",
                credentials:'include',
                body:JSON.stringify(patientAccount)
            })
            let content=await response.json()
            if(content.aadhar_number){
                setValid(false)
                setIsAadharErr(true)
                setAadharMsg("Aadhar Card Number is already Registeed")
            }
            if(content.mobile_no){
                setValid(false)
                setIsMobileErr(true)
                setMobileMsg("Mobile Number is already taken")
            }
            if(content.email){
                setValid(false)
                setIsEmailErr(true)
                setEmailMsg("Email is already taken")
            }
            if(content.message){
                getPatientList()
                setPatientAccount({
                    patient_name:'',email:'',account_created_hospital_id:'',address:'',
                    password:doctorPassword(),aadhar_number:'',app_id:patientID(),mobile_no:0,date_of_birth:''
                })
                document.querySelector('.update-snack-btn').click() 
            }
            console.log(content)
        }
        else{
            setValid(false)
            setIsAadharErr(true)
            setAadharMsg("Aadhar Card Number is not Valid")
        }
    }

    const handleClick = (Transition) => () => {
        setTransition(() => Transition);
        setOpen(true);
    }

    const handleCloseUpdate = () => {
        setOpen(false);
    }
    
    useEffect(()=>{
        getPatientList()
        setTimeout(()=>{
            if(document.querySelector('.clickScroll'))
                document.querySelector('.clickScroll').click()
        },3000)
    },[])

    let getPatientList=async()=>{
        let response=await fetch('http://localhost:8000/api/patient/lists/',{
            headers:{'Content-Type': 'application/json'},
            credentials:'include'
        })
        let content=await response.json()
        setPatientData(content)
        // console.log(content)
    }

    return (
        <Container>
            <Row>
                <Col xs={10} md={8}>
                    <div>
                        {/* <h3 className="text-center">Create Unique ID for People</h3> */}
                        <div className="patients-account-creation-form">
                            <h4 style={{textAlign:"Center",lineHeight:"60px"}} className="hospital-register-header">Patient Registration</h4>  
                            <Container>
                                <Form style={{padding:"20px"}} onSubmit={createPatientAccount}>
                                    <Form.Group>
                                        <InputGroup hasValidation>
                                            <InputGroup.Prepend>
                                                <label htmlFor="patientName" style={{cursor:"pointer"}}>
                                                    <InputGroup.Text style={{height:"45px"}}><PersonIcon /></InputGroup.Text>
                                                </label>
                                            </InputGroup.Prepend>
                                            <Form.Control style={{height:"45px"}} placeholder="Enter Patient name" name="patient_name" onChange={collectData} onKeyUp={collectData} ref={inputFocusRef} value={patientAccount.patient_name} id="patientName" type="text" className="Patient-Name" required /> {/*isInvalid*/} 
                                            <Form.Control.Feedback type="invalid">
                                                Please Enter a valid email.
                                            </Form.Control.Feedback>
                                        </InputGroup>
                                    </Form.Group><br />
                                    <Row>
                                        <Col>
                                            <Form.Group>
                                                <InputGroup hasValidation>
                                                    <InputGroup.Prepend>
                                                        <label htmlFor="aadhar" style={{cursor:"pointer"}}>
                                                            <InputGroup.Text style={{height:"45px"}}><FingerprintIcon /></InputGroup.Text>
                                                        </label>
                                                    </InputGroup.Prepend>
                                                    <Form.Control isInvalid={isAadharErr} style={{height:"45px"}} placeholder="Enter Aadhar Number" name="aadhar_number" onChange={collectData} onKeyUp={collectData} value={patientAccount.aadhar_number} id="aadhar" type="number" className="aadhar-number" required /> {/*isInvalid*/} 
                                                    <Form.Control.Feedback style={{padding:"5px 0"}} type="invalid">
                                                        {aadharMsg}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <InputGroup hasValidation>
                                                    <InputGroup.Prepend>
                                                        <label htmlFor="dob" style={{cursor:"pointer"}}>
                                                            <InputGroup.Text style={{height:"45px"}}><EventNoteIcon /></InputGroup.Text>
                                                        </label>
                                                    </InputGroup.Prepend>
                                                    <Form.Control style={{height:"45px"}} placeholder="Enter Date of Birth" name="date_of_birth" onChange={collectData} onKeyUp={collectData} value={patientAccount.date_of_birth} type="date" id="dob" className="dob form-control" required /> {/*isInvalid*/} 
                                                    <Form.Control.Feedback type="invalid">
                                                        Please Enter a valid email.
                                                    </Form.Control.Feedback> 
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                    </Row><br /> 
                                    <Row>
                                        <Col>
                                            <Form.Group>
                                                <InputGroup hasValidation>
                                                    <InputGroup.Prepend>
                                                        <label htmlFor="email" style={{cursor:"pointer"}}>
                                                            <InputGroup.Text style={{height:"45px"}}><ContactMailIcon /></InputGroup.Text>
                                                        </label>
                                                    </InputGroup.Prepend>
                                                    <Form.Control style={{height:"45px"}} isInvalid={isEmailErr} placeholder="Enter Email" name="email" onChange={collectData} onKeyUp={collectData} value={patientAccount.email} id="email" type="email" className="mail" required /> {/*isInvalid*/} 
                                                    <Form.Control.Feedback style={{padding:"5px 0"}} type="invalid">
                                                        {emailMsg}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                                {/* <Form.Text style={{padding:"5px 0"}} className="text-muted">
                                                    We'll share this email with only Doctors.
                                                </Form.Text> */}
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <InputGroup hasValidation>
                                                    <InputGroup.Prepend>
                                                        <label htmlFor="phonenumber" style={{cursor:"pointer"}}>
                                                            <InputGroup.Text style={{height:"45px"}}><ContactPhoneIcon /></InputGroup.Text>
                                                        </label>
                                                    </InputGroup.Prepend>
                                                    <Form.Control style={{height:"45px"}} isInvalid={isMobileErr} placeholder="Enter Mobile number" name="mobile_no" onChange={collectData} onKeyUp={collectData} value={patientAccount.mobile_no===0 ? "" : patientAccount.mobile_no} type="tel" id="phonenumber" className="mobile-number form-control" required /> {/*isInvalid*/} 
                                                    <Form.Control.Feedback style={{padding:"5px 0"}} type="invalid">
                                                        {mobileMsg}
                                                    </Form.Control.Feedback> 
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                    </Row><br />                    
                                    <Row>
                                        <Col>
                                            <div className="mb-3">
                                                <textarea value={patientAccount.address} className="form-control" name="address" placeholder="Enter the Address"  onChange={collectData} onKeyUp={collectData} rows="5" required></textarea>
                                            </div>
                                        </Col>
                                    </Row><br />
                                    <Row>
                                        <div className="d-flex justify-content-around">
                                            { valid ?  <LoadingButton/> : <Button type="button" disabled varint="primary">Register</Button> }                           
                                            <Button style={{display:"none"}} className="update-snack-btn animate__animated" onClick={handleClick(TransitionUp)}>Down</Button>
                                            <Snackbar
                                                open={open}
                                                onClose={handleCloseUpdate}
                                                TransitionComponent={transition}
                                                message="Account Created Successfully"
                                                key={transition ? transition.name : ''}
                                            />
                                        </div>  
                                    </Row> 
                                </Form>
                            </Container> 
                            <br/>
                        </div>
                    </div>
                </Col>
                <Col xs={6} md={4}>
                    <LiveUpdates patientData={patientData} />
                </Col>
            </Row>
        </Container>
    )
}

function LoadingButton() {
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (isLoading) {
        simulateNetworkRequest().then(() => {
            setLoading(false);
        });
        }
    }, [isLoading]);

    const handleClick = (e) => {
        setLoading(true);
        e.target.click()
    }

    const popover = (
        <Popover id="popover-basic">
            <Popover.Title className="text-center" as="h3">Are You Sure ?</Popover.Title>
            <Popover.Content>
                Check the Provided Details <strong>Once again</strong> before clicking this button
            </Popover.Content>
        </Popover>
    );

    return (
        <OverlayTrigger trigger={["hover", "hover"]} placement="top" overlay={popover}>
            <Button size="lg" variant="primary" type="submit" disabled={isLoading} onClick={!isLoading ? handleClick : null}>
                {isLoading ? <Spinner
                as="span"
                animation="border"
                size="lg"
                role="status"
                aria-hidden="true"
                /> : 'Register'}
            </Button>
        </OverlayTrigger>
    );
}

function simulateNetworkRequest() {
    return new Promise((resolve) => setTimeout(resolve, 2000));
}
