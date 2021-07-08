import React, { useEffect, useState } from 'react'
import { Link, useHistory, Redirect } from 'react-router-dom'
import { Form, Container, Row, Col } from 'react-bootstrap'
import NavSection from './sections/admin/NavSection'
import './../../styles/app.css'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import emailImg from './../../images/email.jpg';

let HospitalAdminHomePage=()=>{

    const history=useHistory()

    const [ userID, setUserID ]=useState()
    const [ hospitalID, setHospitalID ]=useState()
    const [ logo,setLogo ]=useState("")
    const [ email,setEmail ]=useState("")
    const [ is_email_Verified, setIsEmailVerified ]=useState(false)
    const [isLoading,setIsLoading]=useState(false);

    useEffect(()=>{
        (
            async()=>{
                if(!localStorage.getItem('JAM_DISPLAY_CONTENT')){
                    window.location.href="/"
                }

                if(localStorage.getItem('JAM_DISPLAY_CONTENT')!=="Hospital"){
                    history.push('/')
                }

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
                    setUserID(content.user_id)
                    setLogo(content.logo)
                    setHospitalID(content.hospital_id)
                    setIsEmailVerified(content.is_email_Verified)
                    setEmail(content.email)
                    setIsLoading(true)
                }
            }
        )()
    })

    let logout=async ()=>{
        let response=await fetch('http://localhost:8000/api/hospital-logout/',{
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
        <div className="admin-page">
            { 
                isLoading ? is_email_Verified ? <NavSection adminLogo={logo} hospitalid={hospitalID} userid={userID}/> : <VerifyEmail mailVerify={is_email_Verified} email={email} /> : ''
            }
            {/* <Footer /> */}
            {/* <h5>{userID ? 'Logged In' : 'Expired'}</h5> */}
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
        let is_email_Verified=props.mailVerify

        let response=await fetch("http://localhost:8000/api/email-verify/",{
            method:"POST",
            headers:{'Content-Type':'application/json'},
            credentials:'include',
            body:JSON.stringify({
                email,is_email_Verified
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
        <div className="email-verify-message-popup" style={{height:"100vh",paddingTop:"8%"}}>
            <Container>
                <Row>                
                    <Col className="col-md-6 col-md-offset-3">
                        { props.is_email_Verified ? '' :
                            <Form onSubmit={sendVerifyMail} method="POST">
                                <Card className="form-email-sent-card animate__animated animate__zoomInDown" style={{boxShadow:"0 6px 14px rgba(0,0,0,0.2)"}}>
                                    <CardActionArea>
                                        <CardMedia
                                        component="img"
                                        alt="Email Verification"
                                        height="250"
                                        image={emailImg}
                                        title="Email Verification"
                                        />
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
                                    </CardActionArea>
                                    <CardActions className="d-flex justify-content-center">
                                        <Button type="submit"
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                        ><i className="fa fa-send"></i> &nbsp; {btnStatus}</Button>
                                    </CardActions>
                                </Card>
                            </Form>
                        }
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

// https://www.benin2009.com/wp-content/uploads/2015/11/hospital.png
// https://png.pngtree.com/png_detail/20181019/hospital-png-clipart_2548239.png
//https://img.pngio.com/hospitals-icons-png-of-hospital-building-256_256.png

export default HospitalAdminHomePage;