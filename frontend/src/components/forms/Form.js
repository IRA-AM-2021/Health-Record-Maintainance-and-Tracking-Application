import React,{ useEffect, useState, useRef, createRef, useContext } from 'react'
import axios from 'axios'
import { uniqId } from '../Unique.js'
import { Link, useHistory, Redirect } from 'react-router-dom'
import LocalHospitalRoundedIcon from '@material-ui/icons/LocalHospitalRounded'
import NotListedLocationSharpIcon from '@material-ui/icons/NotListedLocationSharp'
import HowToRegRoundedIcon from '@material-ui/icons/HowToRegRounded'
import CreateRoundedIcon from '@material-ui/icons/CreateRounded'
import EmailIcon from '@material-ui/icons/Email'
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid'
import HttpsIcon from '@material-ui/icons/Https'
import './../../styles/form.css'
import Tooltip from "@material-ui/core/Tooltip"
import { ActiveSite } from './../../index'
import { Container, Button, Form, InputGroup, Row, Col, Spinner, Popover, OverlayTrigger } from 'react-bootstrap'
import LockOpenIcon from '@material-ui/icons/LockOpen';
import NoEncryptionIcon from '@material-ui/icons/NoEncryption';
import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';
import { HospitalLoginForm } from './HospitalLoginForm'
import { DoctorLoginForm } from './DoctorLoginForm'
import vid from './../../videos/vid4.mp4'

export default function Forms(props){
    
    let formType=props.type;
        
    if(formType==="HospitalLoginForm")
        return <HospitalLoginForm />;
    else if(formType==="DoctorLoginForm")
        return <DoctorLoginForm />;
    else if(formType==="PatientLoginForm")
        return <PatientLoginForm />;
}

const btnStyle={
    padding:"20px",
    fontSize:"15px"
};

let HospitalRegisterForm=()=>{
    
    const history=useHistory()
    const inputFocusRef=useRef()

    const [registerArr,setRegisterArr]=useState({
        branch:'',email:'',hospital_id:'',hospital_name:'',
        password:'',user_id:uniqId(),mobile_no:0
    })
    const [repassword,setRepassword]=useState('')
    const [isRedirect,setIsRedirect]=useState(false)
    const [state, setState] = React.useState({
        checkedB: false,
    });

    useEffect(()=>{
        if(localStorage.getItem('JAM_DISPLAY_CONTENT')){
            window.location.href='/'
        }
    },[]);
    
    let collectData=(event)=>{
        if(event.target.name==="repassword")
           setRepassword(event.target.value)
        else
            setRegisterArr({...registerArr,[event.target.name]:event.target.value})
        if(event.target.name === "repassword" || event.target.name === "password")
            if(repassword !== registerArr.password)
                console.log("Passwords are not same")
            else
                console.log("Passwords are same")
    }

    let isAgree=(event)=>{
        console.log(event.target.value);
    }

    let registerHospital=async (event)=>{
        event.preventDefault()
    
        setRegisterArr({
            branch:registerArr.branch,email:registerArr.email,
            hospital_id:registerArr.hospital_id,hospital_name:registerArr.hospital_name,
            password:registerArr.password,user_id:uniqId(),mobile_no:registerArr.mobile_no
        })

        let response=await fetch("http://localhost:8000/api/hospital-register/",{
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(registerArr)
        })
        let content=await response.json()
        // console.log(content)
        if(content.user_id){
            setIsRedirect(true)
        }
    }

    if(isRedirect){
        return <Redirect to="/login" />
    }

    let goBack=()=>{
        history.push('/login')
    }

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    return(
        <div className="register-container">
            <video autoplay="true" loop muted id="myVideo">
                <source src={vid} type="video/mp4" />
            </video>
            <div className="hospital-register">
                <h4 style={{textAlign:"Center",lineHeight:"60px"}} className="hospital-register-header">Hospital Registration</h4>  
                <Container>
                    <Form style={{padding:"20px"}} onSubmit={registerHospital}>
                        <Form.Group>
                            <InputGroup hasValidation>
                                <InputGroup.Prepend>
                                    <label htmlFor="HospitalName" style={{cursor:"pointer"}}>
                                        <InputGroup.Text style={{height:"45px"}}><LocalHospitalRoundedIcon /></InputGroup.Text>
                                    </label>
                                </InputGroup.Prepend>
                                <Form.Control style={{height:"45px"}} placeholder="Enter Hospital name" name="hospital_name" onChange={collectData} onKeyUp={collectData} ref={inputFocusRef} value={registerArr.hospitalName} id="HospitalName" type="text" className="Hospital-Name" required /> {/*isInvalid*/} 
                                <Form.Control.Feedback type="invalid">
                                    Please Enter a valid email.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group><br /><br />
                        <Row>
                            <Col>
                                <Form.Group>
                                    <InputGroup hasValidation>
                                        <InputGroup.Prepend>
                                            <label htmlFor="HospitalRegister" style={{cursor:"pointer"}}>
                                                <InputGroup.Text style={{height:"45px"}}><HowToRegRoundedIcon /></InputGroup.Text>
                                            </label>
                                        </InputGroup.Prepend>
                                        <Form.Control style={{height:"45px"}} placeholder="Enter Registeration number" name="hospital_id" onChange={collectData} onKeyUp={collectData} value={registerArr.hospitalId} id="HospitalRegister" type="text" className="Hospital-Register" required /> {/*isInvalid*/} 
                                        <Form.Control.Feedback type="invalid">
                                            Please Enter a valid email.
                                        </Form.Control.Feedback> 
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <InputGroup hasValidation>
                                        <InputGroup.Prepend>
                                            <label htmlFor="HospitalBranch" style={{cursor:"pointer"}}>
                                                <InputGroup.Text style={{height:"45px"}}><NotListedLocationSharpIcon /></InputGroup.Text>
                                            </label>
                                        </InputGroup.Prepend>
                                        <Form.Control style={{height:"45px"}} placeholder="Enter Branch" name="branch" onChange={collectData} onKeyUp={collectData} value={registerArr.branch} id="HospitalBranch" type="text" className="Hospital-Branch" required /> {/*isInvalid*/} 
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
                                                <InputGroup.Text style={{height:"45px"}}><EmailIcon /></InputGroup.Text>
                                            </label>
                                        </InputGroup.Prepend>
                                        <Form.Control style={{height:"45px"}} placeholder="Enter Email" name="email" onChange={collectData} onKeyUp={collectData} value={registerArr.email} id="email" type="email" className="mail" required /> {/*isInvalid*/} 
                                        <Form.Control.Feedback type="invalid">
                                            Please Enter a valid email.
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                    <Form.Text className="text-muted">
                                        We'll never share your email with anyone else.
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <InputGroup hasValidation>
                                        <InputGroup.Prepend>
                                            <label htmlFor="phonenumber" style={{cursor:"pointer"}}>
                                                <InputGroup.Text style={{height:"45px"}}><PhoneAndroidIcon /></InputGroup.Text>
                                            </label>
                                        </InputGroup.Prepend>
                                        <Form.Control style={{height:"45px"}} placeholder="Enter Mobile number" name="mobile_no" onChange={collectData} onKeyUp={collectData} value={registerArr.mobile_no===0 ? "" : registerArr.mobile_no} type="tel" id="phonenumber" data-error="wrong" data-success="right" className="mobile-number form-control" required /> {/*isInvalid*/} 
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
                                            <label htmlFor="password1" style={{cursor:"pointer"}}>
                                                <InputGroup.Text style={{height:"45px"}}><HttpsIcon /></InputGroup.Text>
                                            </label>
                                        </InputGroup.Prepend>
                                        <Form.Control style={{height:"45px"}} placeholder="Enter Password" name="password" onChange={collectData} onKeyUp={collectData} value={registerArr.password} id="password1" type="password" className="main-password validate" required /> {/*isInvalid*/} 
                                        <Form.Control.Feedback type="invalid">
                                            Please Enter a valid email.
                                        </Form.Control.Feedback> 
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <InputGroup hasValidation>
                                        <InputGroup.Prepend>
                                            <label htmlFor="password2" style={{cursor:"pointer"}}>
                                                <InputGroup.Text style={{height:"45px"}}><CreateRoundedIcon /></InputGroup.Text>
                                            </label>
                                        </InputGroup.Prepend>
                                        <Form.Control style={{height:"45px"}} placeholder="Retype the  Password" name="repassword" onChange={collectData} onKeyUp={collectData} value={repassword} id="password2" type="password" className="re-password validate" required /> {/*isInvalid*/} 
                                        <Form.Control.Feedback type="invalid">
                                            Please Enter a valid email.
                                        </Form.Control.Feedback> 
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                        </Row>
                        <br /><br />
                       {/*  <Box display="flex" justifyContent="center" m={1} p={1} bgcolor="background.paper">
                            <Box p={1}>
                                <FormGroup>
                                        <FormControlLabel className="switch-agree" style={{color:"rgb(59, 37, 255)"}} onChange={isAgree} onClick={isAgree} control={<IOSSwitch checked={state.checkedB} onChange={handleChange} name="checkedB" />} label="Agree to terms and conditions" required />
                                </FormGroup>
                            </Box>
                        </Box> */}
                        <Row>
                            <div className="d-flex justify-content-around">
                                <OverlayTrigger trigger={["hover", "hover"]} key="top" placement="top" overlay={
                                        <Popover id={`popover-positioned-top`}>
                                        <Popover.Title as="h3">Back</Popover.Title>
                                        <Popover.Content>
                                            <strong>Click </strong>  to go back to Login Form.
                                        </Popover.Content>
                                        </Popover>
                                    }
                                >
                                    <Button className="btn btn-danger btn-lg" onClick={goBack} type="button" variant="contained">Cancel</Button>
                                </OverlayTrigger>
                                <LoadingButton />
                            </div>  
                        </Row> 
                    </Form>
                </Container> 
                <br/>
            </div>
        </div>
    );
}

const IOSSwitch = withStyles((theme) => ({
    root: {
        width: 42,
        height: 26,
        padding: 0,
        margin: theme.spacing(1),
    },
    switchBase: {
        padding: 1,
        '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
            backgroundColor: '#52d869',
            opacity: 1,
            border: 'none',
        },
        },
        '&$focusVisible $thumb': {
        color: '#52d869',
        border: '6px solid #fff',
        },
    },
    thumb: {
        width: 24,
        height: 24,
    },
    track: {
        borderRadius: 26 / 2,
        border: `1px solid white`,
        backgroundColor: `black`,
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
    }))(({ classes, ...props }) => {
    return (
        <Switch
        focusVisibleClassName={classes.focusVisible}
        disableRipple
        classes={{
            root: classes.root,
            switchBase: classes.switchBase,
            thumb: classes.thumb,
            track: classes.track,
            checked: classes.checked,
        }}
        {...props}
        />
    );
});

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
            <Button variant="primary" type="submit" disabled={isLoading} onClick={!isLoading ? handleClick : null}>
                {isLoading ? <Spinner
                as="span"
                animation="border"
                size="lg"
                role="status"
                aria-hidden="true"
                /> : ''}
                &nbsp; {isLoading ? ' Registering…' : 'Register'}
            </Button>
        </OverlayTrigger>
    );
}

function simulateNetworkRequest() {
    return new Promise((resolve) => setTimeout(resolve, 2000));
}

let PatientLoginForm=()=>{
    return(
        <div>
            <aside className="col-sm-4">
                <div className="card">
                    <article className="card-body">
                        <h4 className="card-title mb-4 mt-1">Sign in ( Patient )</h4>
                        <form>
                            <div className="form-group">
                                <label>Unique ID</label>
                                <input name="" className="form-control" placeholder="Enter your unique ID or Email" type="text" />
                            </div> 
                            <div className="form-group">
                                <label>OTP</label>
                                <input className="form-control" placeholder="Enter the otp received on your registered mobile number" type="text" />
                                <label>Your password</label>
                                <input className="form-control" placeholder="******" type="password" />
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary btn-block"> Login  </button>
                            </div>                                                           
                        </form>
                    </article>
                </div>
            </aside>
        </div> 
    );
}

export {HospitalLoginForm,DoctorLoginForm,PatientLoginForm,HospitalRegisterForm};



/* function FormExample() {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Row>
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>First name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="First name"
            defaultValue="Mark"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>Last name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Last name"
            defaultValue="Otto"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustomUsername">
          <Form.Label>Username</Form.Label>
          <InputGroup hasValidation>
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              type="text"
              placeholder="Username"
              aria-describedby="inputGroupPrepend"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please choose a username.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} md="6" controlId="validationCustom03">
          <Form.Label>City</Form.Label>
          <Form.Control type="text" placeholder="City" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid city.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom04">
          <Form.Label>State</Form.Label>
          <Form.Control type="text" placeholder="State" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid state.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom05">
          <Form.Label>Zip</Form.Label>
          <Form.Control type="text" placeholder="Zip" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid zip.
          </Form.Control.Feedback>
        </Form.Group>
      </Form.Row>
      <Form.Group>
        <Form.Check
          required
          label="Agree to terms and conditions"
          feedback="You must agree before submitting."
        />
      </Form.Group>
      <Button type="submit">Submit form</Button>
    </Form>
  );
}

render(<FormExample />); */