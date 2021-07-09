import React,{ useEffect, useState, useRef, createRef, useContext } from 'react'
import { BrowserRouter, Route ,Switch ,Link, useHistory, Redirect } from 'react-router-dom'
import { Container, Button, Form, InputGroup } from 'react-bootstrap'
import EmailIcon from '@material-ui/icons/Email'
import HttpsIcon from '@material-ui/icons/Https'
import LockOpenIcon from '@material-ui/icons/LockOpen';
import NoEncryptionIcon from '@material-ui/icons/NoEncryption';

let HospitalLoginForm=()=>{
    const [ email, setEmail ]=useState('')
    const [ password, setPassword ]=useState('')
    const [ isSuccess, setIsSuccess ]=useState(false)
    const [ isVisible, setIsVisible ]=useState(false)
    const [ err, setErr ]=useState("")
    const [ isPasswordErr, setIsPasswordErr ]=useState(false)
    const [ isMailErr, setIsMailErr ]=useState(false)

    useEffect(()=>{
        document.querySelector('.hospital-login').classList.remove('animate__bounce')
    },[email,password])

    let login=async (event)=>{
        event.preventDefault()

        let response=await fetch("http://localhost:8000/api/hospital-login/",{
            method:"POST",
            headers:{'Content-Type':'application/json'},
            credentials:'include',
            body:JSON.stringify({
                email,password
            })
        })
        let content=await response.json()
        // console.log(content)
        if(content.message === 'success'){
            localStorage.setItem('JAM_DISPLAY_CONTENT',content.interface) 
            window.location.href="/admin/dashboard"      
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
        return <Redirect to='/admin/dashboard' />
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
    }

    return(
        <div className="hospital-login animate__animated animate__faster">
            <Container>
                <Form onSubmit={login}>
                    <h4 className="card-title center-align" style={{textAlign:"Center",lineHeight:"100px"}}>Sign in (Hospital)</h4>
                    <Form.Group style={{width:"70%",margin:"auto"}}>
                        <InputGroup hasValidation>
                            <InputGroup.Prepend>
                                <label htmlFor="email" style={{cursor:"pointer"}}>
                                    <InputGroup.Text style={{height:"45px"}}><EmailIcon /></InputGroup.Text>
                                </label>
                            </InputGroup.Prepend>
                            <Form.Control isInvalid={isMailErr} style={{height:"45px"}} aria-label="email" aria-describedby="basic-addon1" name="email" onChange={e=>setEmail(e.target.value)} onInput={e=>setEmail(e.target.value)} type="email" className="mail" id="email" placeholder="Enter email" required/> {/*isInvalid*/} 
                            <Form.Control.Feedback type="invalid">
                                {err}
                            </Form.Control.Feedback> 
                        </InputGroup>
                    </Form.Group><br /><br />
                    <Form.Group style={{width:"70%",margin:"auto"}}>
                        <InputGroup hasValidation>
                            <InputGroup.Prepend>
                                <label htmlFor="paswd" onClick={showPassword} style={{cursor:"pointer"}}>
                                    <InputGroup.Text style={{height:"45px"}}>{!isVisible ? <HttpsIcon /> : <NoEncryptionIcon />}</InputGroup.Text>
                                </label>
                            </InputGroup.Prepend>
                            <Form.Control isInvalid={isPasswordErr} style={{height:"45px"}} className="paswd" id="paswd" type="password" placeholder="Enter Password" name="password" onChange={e=>setPassword(e.target.value)} onInput={e=>setPassword(e.target.value)} required />
                            <Form.Control.Feedback type="invalid">
                                {err}
                            </Form.Control.Feedback> 
                            {/* <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text> */}
                        </InputGroup>
                    </Form.Group><br />
                    <div className="text-center" style={{lineHeight:"40px"}}>
                        <LoadingButton /><br />
                        {/* <Link to='/'>Forgot password?</Link><br /> */}
                        <Link to='/Hospital-Registration' className="text-primary">Create New Account</Link>
                    </div>
                </Form>
            </Container>
            <br />
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
        {isLoading ? 'Logging In…' : 'Login'}
        </Button>
    );
}

function simulateNetworkRequest() {
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

export {HospitalLoginForm}
