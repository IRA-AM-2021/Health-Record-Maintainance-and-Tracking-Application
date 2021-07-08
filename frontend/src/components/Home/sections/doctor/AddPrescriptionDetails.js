import React, { Component, useEffect, useState } from 'react'
import { Container, Button, Form, Badge, InputGroup, Row, Col, Spinner, Popover, OverlayTrigger } from 'react-bootstrap'
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from 'draft-js'
import ScheduleIcon from '@material-ui/icons/Schedule';
import Snackbar from '@material-ui/core/Snackbar';
import Fade from '@material-ui/core/Fade';
import Slide from '@material-ui/core/Slide';
import Grow from '@material-ui/core/Grow';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

function GrowTransition(props) {
  return <Grow {...props} />;
}

class AddPrescriptionDetails extends Component {

    constructor(props){
        super(props)
        this.savePrescriptionDetails=this.savePrescriptionDetails.bind(this);
        this.collectData=this.collectData.bind(this);
    }

    state={
        hospital_id:this.props.hospitalid,
        aadhar_number:this.props.aadharnumber,
        doctor_id:this.props.appid,
        symptoms:"",
        cause:"",
        revisit_date:"",
        valid:false,
        description:'',
        editorState:EditorState.createEmpty(),
        open:false,
        Transition:Fade
    };

    onEditorStateChange=(editorState)=>{
        this.setState({
            editorState:editorState,
        })

        this.setState({
            description:JSON.stringify(convertToRaw(editorState.getCurrentContent())),
        })
        //console.log(convertToRaw(editorState.getCurrentContent()))
        // console.log()
    }

    savePrescriptionDetails=async (e)=>{
        e.preventDefault()

        let response=await fetch("http://localhost:8000/api/patient/patients-prescription/",{
            headers:{'Content-Type':'application/json'},
            method:"POST",
            body:JSON.stringify(this.state)
        })
        let content=await response.json()
        if(content.message==="Prescription Added successfully"){
            document.querySelector('.update-info-snack-btn').click() 
            this.props.getHistory("props")
        }
        // console.log(content)
        // console.log(this.state.editorState)
        // console.log(convertToRaw(this.state.editorState.getCurrentContent()))
    } 

    handleClick = (Transition) => () => {
        this.setState({
            open: true,
            Transition,
        });
    };

    handleClose = () => {
        this.setState({
            ...this.state,
            open: false,
        });
    };

    collectData=(event)=>{

        const {name,value}=event.target;
        this.setState({
            [name]:value
        });

        if(document.querySelector('.cause-reason').value!=='' && document.querySelector('.symptoms').value!==''){
            this.setState({valid:true})
        }
        else{
            this.setState({valid:false})
        }
        // console.log(event.target.value)
    }

    render(){
        // console.log(this.state.description.getCurrentContent())
        // let pre=this.state.description
        // this.setState({
        //     description:pre.getCurrentContent()
        // })
        // console.log(convertToRaw(this.state.description.getCurrentContent()))
        return(
            <div className="text-editor">
               <Form style={{padding:"20px"}} onSubmit={this.savePrescriptionDetails}>
                    <Form.Group>
                        <InputGroup hasValidation>
                            <InputGroup.Prepend>
                                <label htmlFor="cause" style={{cursor:"pointer"}}>
                                    <InputGroup.Text style={{height:"45px"}}><i className="fas fa-capsules"></i></InputGroup.Text>
                                </label>
                            </InputGroup.Prepend>
                            <Form.Control style={{height:"45px"}} placeholder="Enter the Reason" name="cause" onChange={this.collectData} onKeyUp={this.collectData} value={this.state.cause} id="cause" type="text" className="cause-reason" required /> {/*isInvalid*/} 
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
                                        <label htmlFor="symptoms" style={{cursor:"pointer"}}>
                                            <InputGroup.Text style={{height:"45px"}}><i className="fas fa-diagnoses"></i></InputGroup.Text>
                                        </label>
                                    </InputGroup.Prepend>
                                    <Form.Control style={{height:"45px"}} placeholder="Enter the Symptoms" name="symptoms" onChange={this.collectData} onKeyUp={this.collectData} value={this.state.symptoms} id="symptoms" type="text" className="symptoms" required /> {/*isInvalid*/} 
                                    <Form.Control.Feedback style={{padding:"5px 0"}} type="invalid">
                                        
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <InputGroup hasValidation>
                                    <InputGroup.Prepend>
                                        <label htmlFor="revisit" style={{cursor:"pointer"}}>
                                            <InputGroup.Text style={{height:"45px"}}><ScheduleIcon /></InputGroup.Text>
                                        </label>
                                    </InputGroup.Prepend>
                                    <Form.Control style={{height:"45px"}} placeholder="Revisit Date" name="revisit_date" onChange={this.collectData} onKeyUp={this.collectData} value={this.state.revisit_date} type="date" id="revisit" className="revisit form-control" required /> {/*isInvalid*/} 
                                    <Form.Control.Feedback type="invalid">
                                        Please Enter a valid email.
                                    </Form.Control.Feedback> 
                                </InputGroup>
                            </Form.Group>
                        </Col>
                    </Row><br />                   
                    <Row>
                        <Col>
                            {/* <Editor
                                editorState={this.state.editorState}
                                toolbarClassName="toolbarClassName"
                                wrapperClassName="wrapperClassName"
                                editorClassName="editorClassName"
                                onEditorStateChange={this.onEditorStateChange}
                            />; */}
                            <div className="mb-3">
                                <textarea value={this.state.description} className="form-control" name="description" placeholder="Prescription" onChange={this.collectData} onKeyUp={this.collectData} rows="6" required></textarea>
                            </div>
                        </Col>
                    </Row><br />
                    <Row>
                        <div className="d-flex justify-content-around">
                            { this.state.valid ?  <LoadingButton/> : <Button type="button" disabled varint="primary">Save</Button> }                           
                            <Button style={{display:"none"}} className="update-info-snack-btn" onClick={this.handleClick(SlideTransition)}>Slide Transition</Button>
                            <Snackbar
                                open={this.state.open}
                                onClose={this.handleClose}
                                TransitionComponent={this.state.Transition}
                                message="Prescription Saved Successfully"
                                key={this.state.Transition.name}
                            />
                        </div>  
                    </Row> 
                </Form>
            </div>
        )
    }
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
                /> : 'Save'}
            </Button>
        </OverlayTrigger>
    );
}

function simulateNetworkRequest() {
    return new Promise((resolve) => setTimeout(resolve, 2000));
}

export default AddPrescriptionDetails
