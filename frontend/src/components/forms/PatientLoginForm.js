import React,{ useEffect, useState, useRef, createRef, useContext } from 'react'
import { BrowserRouter, Route ,Switch ,Link, useHistory, Redirect } from 'react-router-dom'
import { Container, Button, Form, InputGroup } from 'react-bootstrap'
import FingerprintIcon from '@material-ui/icons/Fingerprint'

let PatientLoginForm=()=>{
    const [ aadhar, setAadhar ]=useState('')
    const [ isSuccess, setIsSuccess ]=useState(false)
    const [ isVisible, setIsVisible ]=useState(false)
    const [ isOtpSent, setIsOtpSent ]=useState(false)
    const [ err, setErr ]=useState("")
    const [ msg, setMsg ]=useState("")

    /* useEffect(()=>{
        document.querySelector('.hospital-login').classList.remove('animate__bounce')
    },[email,password])

    let login=async (event)=>{
        event.preventDefault()

        let formField=new FormData()
        formField.append('email',email)
        formField.append('password',password)

        let loginResponse=await fetch("http://localhost:8000/api/doctor/login/",{
            method:"POST",
            credentials:'include',
            body:formField
        })
        let content=await loginResponse.json()
        console.log(content)

        if(content.message === 'success'){
            localStorage.setItem('JAM_DISPLAY_CONTENT',content.interface) 
            window.location.href="/doctor"      
            setIsSuccess(true)         
        }
        else if(content.detail){
            document.querySelector('.hospital-login').classList.add('animate__bounce')
            if(content.detail==="Email is not Valid"){
                setIsPasswordErr(false)
                setIsMailErr(true)
                setErr("Email is not valid")
            }
            else{
                setIsMailErr(false)
                setIsPasswordErr(true)
                setErr("Password is Incorrect")
            } 
        }
    }

    if(isSuccess){
        return <Redirect to='/doctor' />
    }

    let showPassword=()=>{
        if(isVisible){
            document.querySelector('.paswd').setAttribute('type','password')
            setIsVisible(false)
        }
        else{
            document.querySelector('.paswd').setAttribute('type','text')
            setIsVisible(true)
        }
    } */

    let sendOTP=async(e)=>{

        e.preventDefault()
        
        let formField=new FormData()
        formField.append('aadhar_number',aadhar)
        formField.append('id',aadhar)

        let response=await fetch("http://localhost:8000/api/patient/patient-login-otp/",{
            method:"POST",
            credentials:'include',
            body:formField
        })
        let content=await response.json()
        // console.log(content)
        if(content.message){
            setMsg(content.message)
            setIsOtpSent(true)
        }

    }

    return(
        <div className="patient-login animate__animated animate__faster">
            <Container>
                { isOtpSent ? <EnterOTP msg={msg} aadhar={aadhar} /> :
                    <Form method="POST" onSubmit={sendOTP}>
                        <h4 className="card-title center-align" style={{textAlign:"Center",lineHeight:"100px"}}>Sign in (Patient)</h4>
                        <Form.Group style={{width:"70%",margin:"auto"}}>
                            <InputGroup hasValidation>
                                <InputGroup.Prepend>
                                    <label htmlFor="aadhar" style={{cursor:"pointer"}}>
                                        <InputGroup.Text style={{height:"45px"}}><FingerprintIcon /></InputGroup.Text>
                                    </label>
                                </InputGroup.Prepend>
                                <Form.Control isInvalid={isOtpSent} style={{height:"45px"}} aria-describedby="basic-addon1" name="aadhar_number" onChange={e=>setAadhar(e.target.value)} onInput={e=>setAadhar(e.target.value)} type="text" className="aadhar" id="aadhar" placeholder="Enter Registered Aadhar Number" required/> {/*isInvalid*/} 
                                <Form.Control.Feedback type="invalid">
                                    {err}
                                </Form.Control.Feedback> 
                            </InputGroup>
                        </Form.Group><br /><br />
                        <div className="text-center" style={{lineHeight:"40px"}}>
                            <LoadingButton /><br />
                        </div>
                        <p>{msg}</p>
                        <br /><br />
                    </Form>   
                }
            </Container>
        </div>
    );
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
        setLoading(true)
        e.target.click()
    }

    return (
        <Button type="submit"
        variant="primary" 
        className="btn rounded-3 white-text btn-lg"
        disabled={isLoading} 
        // style={{opacity:"0.5"}}
        onClick={!isLoading ? handleClick : null}
        >
        {isLoading ? 'Sending…' : 'Send OTP'}
        </Button>
    );
}

function simulateNetworkRequest() {
  return new Promise((resolve) => setTimeout(resolve, 4000));
}

let EnterOTP=(props)=>{

    const [otp,setOTP]=useState("")
    const [err,setErr]=useState(false)
    const [msg,setMsg]=useState("")

    let clickEvent=(event)=>{
        if(event.target.value.length){

            if(event.target.getAttribute('datatarget')==="sixth"){
                setOTP((e)=>e+""+event.target.value)
                setTimeout(()=>document.querySelector('.otp-verify-btn').click(),2000)
            }
            else{
                setOTP((e)=>e+""+event.target.value)
                document.getElementById(event.target.getAttribute('datatarget')).focus();
            }
        }
    }

    let verifyOtp=async(e)=>{
        e.preventDefault()

        let formField=new FormData()
        formField.append('aadhar_number',props.aadhar)
        formField.append('otp_code',otp)

        let response=await fetch("http://localhost:8000/api/patient/patient-login-verify-otp/",{
            method:"POST",
            credentials:'include',
            body:formField
        })
        let content=await response.json()
        console.log(content)
        if(content.result==="Success"){
            setMsg(content.message)
            setErr(false)
            localStorage.setItem('JAM_DISPLAY_CONTENT',content.interface) 
            window.location.href="/patient"      
        }
        else{
            setMsg(content.message)
            setErr(true)
        }
    }

    return(
        <form onSubmit={verifyOtp}>
            <div className="container-otp">
                <h1>ENTER OTP</h1>
                <div className="userInput">
                    <input type="text" id='ist' datatarget="sec" maxLength="1" onKeyUp={clickEvent} />
                    <input type="text" id="sec" datatarget="third" maxLength="1" onKeyUp={clickEvent} />
                    <input type="text" id="third" datatarget="fourth" maxLength="1" onKeyUp={clickEvent} />
                    <input type="text" id="fourth" datatarget="fifth" maxLength="1" onKeyUp={clickEvent} />
                    <input type="text" id="fifth" datatarget="sixth" maxLength="1" onKeyUp={clickEvent} />
                </div><br />
                <button className="otp-verify-btn" type="submit">Confirm</button>
                <br/>
                <p className="text-center text-success">{msg!=="" ? msg : props.msg }</p>
                <br /><br />
            </div>
        </form>
    )
}

export { PatientLoginForm }