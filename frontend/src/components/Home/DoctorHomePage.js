import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter, Link, NavLink, Switch } from 'react-router-dom'
import { Form, Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap'
import NavSection from './sections/doctor/NavSection'
import './../../styles/app.css'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
// import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import emailImg from './../../images/verify.jpg';

let DoctorHomePage=()=>{

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
                // console.log(content)
                let isErr=content.detail
                if(isErr==="Unauthenticated"){
                    logout();
                }
                else{
                    setUserID(content.app_id)
                    setLogo(content.logo)
                    setHospitalID(content.hospital_id)
                    setIsEmailVerified(content.email_Verified)
                    setEmail(content.email)
                    setIsLoading(true)
                }
            }
        )()
    })

    let logout=async ()=>{
        let response=await fetch('http://localhost:8000/api/doctor/logout/',{
            method:"POST",
            headers:{'Content-Type': 'application/json'},
            credentials:'include'
        })

        let content=await response.json()
        if(content.message==='success'){
            localStorage.removeItem('JAM_DISPLAY_CONTENT')  
            window.location.href='/'    
        }
    }

    return(
        <div className="doctor-page">
            {
                isLoading ? is_email_Verified ? <NavSection adminLogo={logo} hospitalid={hospitalID} userid={userID}/> : <VerifyEmail mailVerify={is_email_Verified} email={email} /> : ''
            }
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
}))

let VerifyEmail=(props)=>{

    const [ btnStatus, setBtnStatus ] = useState("Send Link")
    const [ headStatus, setHeadStatus ] = useState("Verify Your Email")
    const [ paraContent, setParaContent ] = useState(`We're excited to have you get started. First, you need to confirm whether the Provided 
                                                    Email account is belongs to you or not . To do so, Just click the button below to get 
                                                    the Verification Link.`)

    let sendVerifyMail=async (event)=>{
        event.preventDefault()

        let email=props.email
        let email_Verified=props.mailVerify

        let response=await fetch("http://localhost:8000/api/doctor/mail-verify/",{
            method:"POST",
            headers:{'Content-Type':'application/json'},
            credentials:'include',
            body:JSON.stringify({
                email,email_Verified
            })
        })
        let content=await response.json()
        if(content){
            setBtnStatus("Resend Mail")
            setHeadStatus("Email Sent Successfully")
            setParaContent("Check You Inbox to find the Verification Link")
        }
    }

    const classes = useStyles();

    return(
        <div className="email-verify-message-popup" style={{height:"90vh",overflow:"hidden",paddingTop:"8%"}}>
            <Container>
                { props.is_email_Verified ? '' :
                    <Form onSubmit={sendVerifyMail} method="POST">
                        <Card className="form-email-sent-card animate__animated animate__zoomInDown" style={{boxShadow:"0 6px 14px rgba(0,0,0,0.2)"}}>        
                            <Row>
                                <Col xs={6}>
                                    <CardActionArea>
                                        <CardMedia
                                        component="img"
                                        alt="Email Verification"
                                        height="100%"
                                        image={emailImg}
                                        title="Email Verification"
                                        />
                                    </CardActionArea> 
                                </Col>
                                <Col xs={6} style={{paddingTop:"100px"}}>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" className="text-center" style={{fontFamily:"'Kaushan Script', cursive"}} component="h2">
                                            {headStatus}
                                        </Typography>
                                        <div style={{width:"60%",textAlign:"center",margin:"auto"}}>    
                                            <Typography variant="body2" className="para-email-admin" style={{textAlign:"center",fontFamily:"'Courgette',cursive",fontSize:"18px",}} color="textSecondary" component="p">
                                                {paraContent}
                                            </Typography>
                                        </div>
                                    </CardContent>
                                    <CardActions className="d-flex justify-content-center">
                                        <Button type="submit"
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                        ><i className="fa fa-send"></i> &nbsp; {btnStatus}</Button>
                                    </CardActions>    
                                </Col>
                            </Row>    
                        </Card>
                    </Form>
                }
            </Container>
        </div>
    );
}

export default DoctorHomePage;