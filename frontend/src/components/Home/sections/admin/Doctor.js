import React, { useEffect, useState } from 'react';
import { Form, Spinner, Container, Col, Row, InputGroup, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap'
import { doctoruniqId, doctorPassword } from './../../../Unique.js'
import Chip from '@material-ui/core/Chip';
import MUIDataTable, { TableFilterList } from "mui-datatables";
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import axios from 'axios'

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

export default function Doctor(props) {

    const [doctor,setDoctor] = useState({
        dept:'',email:'',doctor_id:'',name:'',hospital_id:props.hospitalid,joined_date:'',
        password_before_verification:doctorPassword(),app_id:doctoruniqId(),mobile_no:0
    })
    const [modalShowRemove, setModalShowRemove] = React.useState(false)
    const [modalShowAdd, setModalShowAdd] = React.useState(false)
    const [tableData, setTableData] = React.useState([])
    const [errText,setErrText] = React.useState([])
    const [doctorData, setDoctorData] = React.useState([])
    const [muiData, setMuiData] = React.useState([])
    const [open, setOpen] = React.useState(false);
    const [transition, setTransition] = React.useState(undefined);
    const hospital_id=doctor.hospital_id

    const handleClick = (Transition) => () => {
        setTransition(() => Transition);
        setOpen(true);
    };
    
    const handleCloseAdd = () => {
        setOpen(false);
    };

    let hideAddDoctor=()=>{
        setDoctor({
                dept:'',email:'',doctor_id:'',name:'',hospital_id:props.hospitalid,joined_date:'',
                password_before_verification:doctorPassword(),app_id:doctoruniqId(),mobile_no:0
            }) 
        setErrText([]) 
        document.querySelector('.create-doctor-modal').classList.add('animate__backOutDown')
        setTimeout(()=>{
            setModalShowAdd(false)
        },1000)
    }

    useEffect(()=>{
        getDepartments()
        getDoctorData()
    },[])

    let getDepartments = async () => {

        let response=await fetch('http://localhost:8000/api/hospital-dept/',{
            headers:{'Content-Type': 'application/json'},
            credentials:'include'
        })
        let content=await response.json()
        setTableData(content)
    }

    let getDoctorData=async ()=>{
        let response=await fetch(`http://localhost:8000/api/doctor/lists/?hospital_id=${hospital_id}`)
        let content=await response.json()
        setDoctorData(content)
        // console.log(content)   
        let doctorArr=[]
        content.slice(0).reverse().map((data) => (
            doctorArr.push({
                "Doctor":data.name,
                "Email":data.email,
                "Password":data.password_before_verification,
                "Status":data.email_Verified.toString(),
            })  
        ))
        setMuiData(doctorArr)
    }

    const columns = [
    {
        name: "Doctor",
        label: "Doctor",
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: "Email",
        label: "Email",
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: "Password",
        label: "Password",
        options: {
            filter: true,
            sort: false,
        }
    },
    {
        name: "Status",
        label: "Status",
        options: {
            filter: true,
            sort: false,
        }
    },
    ];

    /* const data = [
        { Doctor: "Joe James", Email: "Test Corp", Password: "Yonkers", Status: "NY" },
        { Doctor: "John Walsh", Email: "Test Corp", Password: "Hartford", Status: "CT" },
        { Doctor: "Bob Herm", Email: "Test Corp", Password: "Tampa", Status: "FL" },
        { Doctor: "James Houston", Email: "Test Corp", Password: "Dallas", Status: "TX" },
    ]; */

    const options = {
        filterType: 'checkbox',
    };

    let collectData=(event)=>{
        setDoctor({...doctor,[event.target.name]:event.target.value})
        if(doctor.name !== "" && doctor.dept !== "" && doctor.email !== "" && doctor.doctor_id  !== "" && doctor.mobile_no  !== ""){
            document.querySelector('.create-doctor-btn').removeAttribute('disabled')
        }
        else{
            document.querySelector('.create-doctor-btn').setAttribute('disabled',true)
        }
    }

    let createDoctorsAccount=async (e)=>{
        e.preventDefault();
        setDoctor({
            dept:doctor.dept,email:doctor.email,doctor_id:doctor.doctor_id,name:doctor.name,hospital_id:doctor.hospital_id,
            joined_date:doctor.joined_date,password_before_verification:doctorPassword(),app_id:doctoruniqId(),mobile_no:doctor.mobile_no
        })
        let response=await fetch("http://localhost:8000/api/doctor/account-create/",{
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(doctor)
        })
        let content=await response.json()
        let response_length=Object.keys(content).length
        let response_status=response.status
        if(response_status===400){
            setErrText(content)
            document.querySelector('.create-doctor-modal').classList.add('animate__tada')
            setTimeout(()=>{
                document.querySelector('.create-doctor-modal').classList.remove('animate__tada')
            },1000)
        }
        else if(response_status===200){
            setDoctor({
                dept:'',email:'',doctor_id:'',name:'',hospital_id:props.hospitalid,joined_date:'',
                password_before_verification:doctorPassword(),app_id:doctoruniqId(),mobile_no:0
            }) 
            setErrText([]) 
            getDoctorData()
            document.querySelector('.update-snack-btn').click() 
        }
        else{
            console.log("something gone wrong")
        }
    }

    return (
        <div className="doctors-details">
            <h3 className="text-center doctor-title m-4">List of Doctors</h3><br/>
            <div className="doctor-window-content">
                <div className="button-options row justify-content-around">
                    <div className="col-4">
                        <Button variant="primary" size="lg" onClick={() => setModalShowRemove(true)} type="button">Existing Doctor Account</Button>
                        <Modal show={modalShowRemove} onHide={() => setModalShowRemove(false)}
                            size="lg"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                            >
                            <Modal.Header closeButton>
                                <Modal.Title id="contained-modal-title-vcenter">
                                Modal heading
                                </Modal.Title>
                            </Modal.Header>
                            <Form>
                                <Modal.Body>
                                    <Container>
                                        <Row>
                                            <Col xs={12} md={8}>
                                                <Form.Group>
                                                    <InputGroup hasValidation>
                                                        <InputGroup.Prepend>
                                                            <label htmlFor="doctor-name" style={{cursor:"pointer"}}>
                                                                <InputGroup.Text style={{height:"45px"}}><i className='fas fa-user-md'></i></InputGroup.Text>
                                                            </label>
                                                        </InputGroup.Prepend>
                                                        <Form.Control onInput={collectData} onChange={collectData} style={{height:"45px"}} value={doctor.name} placeholder="Doctor's Name" name="name" id="doctor-name" type="text" className="doctor-name-info" />
                                                        <Form.Control.Feedback type="invalid">
                                                            Please Enter a valid email.
                                                        </Form.Control.Feedback>
                                                    </InputGroup>                                               
                                                </Form.Group>  
                                            </Col>
                                        </Row>
                                    </Container>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button onClick={() => setModalShowRemove(false)}>Close</Button>
                                </Modal.Footer>
                            </Form>
                        </Modal>
                    </div>
                    <div className="col-4">
                        <Button variant="primary" onClick={() => setModalShowAdd(true)} size="lg" type="button">New Doctor Account</Button>
                        <Modal className="animate__animated animate__faster create-doctor-modal" size="lg" show={modalShowAdd} onHide={() => setModalShowAdd(false)}  aria-labelledby="contained-modal-title-vcenter" centered >
                            <Modal.Header closeButton>
                                <Modal.Title id="contained-modal-title-vcenter">
                                    Create Account For Your Doctors
                                </Modal.Title>
                            </Modal.Header>
                            <Form onSubmit={createDoctorsAccount} method="POST">
                                <Modal.Body className="show-grid">
                                    <Container>
                                        <Row>
                                            <Col xs={12} md={8}>
                                                <Form.Group>
                                                    <InputGroup hasValidation>
                                                        <InputGroup.Prepend>
                                                            <label htmlFor="doctor-name" style={{cursor:"pointer"}}>
                                                                <InputGroup.Text style={{height:"45px"}}><i className='fas fa-user-md'></i></InputGroup.Text>
                                                            </label>
                                                        </InputGroup.Prepend>
                                                        <Form.Control onInput={collectData} onChange={collectData} style={{height:"45px"}} value={doctor.name} placeholder="Doctor's Name" name="name" id="doctor-name" type="text" className="doctor-name-info" />
                                                        <Form.Control.Feedback type="invalid">
                                                            Please Enter a valid email.
                                                        </Form.Control.Feedback>
                                                    </InputGroup>                                               
                                                </Form.Group>  
                                            </Col>
                                            <Col xs={6} md={4}>
                                                <Form.Group>
                                                    <InputGroup hasValidation>
                                                        <InputGroup.Prepend>
                                                            <label htmlFor="doctor-dept" style={{cursor:"pointer"}}>
                                                                <InputGroup.Text style={{height:"45px"}}><i className='fas fa-clinic-medical'></i></InputGroup.Text>
                                                            </label>
                                                        </InputGroup.Prepend>
                                                       {/*  <Form.Control style={{height:"45px"}} onSelect={collectData} onInput={collectData} onChange={collectData} list="department-datalist" placeholder="Enter Department" name="dept" id="doctor-dept" type="text" className="doctor-dept-info" />
                                                        <datalist id="department-datalist">
                                                            {tableData.map((data) => (
                                                                <option key={data.id} value={data.department} />
                                                            ))}
                                                        </datalist> */}
                                                        <select className="form-select form-select-lg mb-3 doctor-dept-info" style={{height:"45px"}} onSelect={collectData} onInput={collectData} onChange={collectData} 
                                                            list="department-datalist" placeholder="Enter Department" name="dept" id="doctor-dept" value={doctor.dept}
                                                            aria-label=".form-select-lg example"
                                                        >
                                                            <option value=''>Specialization</option>
                                                            {tableData.map((data) => (
                                                                <option key={data.id} value={data.department}>{data.department}</option>
                                                            ))}
                                                        </select>
                                                    </InputGroup>                                               
                                                </Form.Group> 
                                            </Col>
                                        </Row><br />
                                        <Row>
                                            <Col xs={12} md={8}>
                                                <Form.Group>
                                                    <InputGroup hasValidation>
                                                        <InputGroup.Prepend>
                                                            <label htmlFor="doctor-email" style={{cursor:"pointer"}}>
                                                                <InputGroup.Text style={{height:"45px"}}><i className="fa fa-envelope" aria-hidden="true"></i></InputGroup.Text>
                                                            </label>
                                                        </InputGroup.Prepend>
                                                        <Form.Control isInvalid={errText.email} style={{height:"45px"}} onInput={collectData} onChange={collectData} value={doctor.email} 
                                                            placeholder="Doctor's Email" name="email" id="doctor-email" type="email" className="doctor-email-info" 
                                                        />
                                                        <Form.Control.Feedback style={{padding:"5px"}} type="invalid">
                                                            { errText.email ? 'Email is already Exists' : '' }
                                                        </Form.Control.Feedback>
                                                    </InputGroup>                                               
                                                </Form.Group>  
                                            </Col>
                                            <Col xs={6} md={4}>
                                                <Form.Group>
                                                    <InputGroup hasValidation>
                                                        <InputGroup.Prepend>
                                                            <label htmlFor="doctor-mobile" style={{cursor:"pointer"}}>
                                                                <InputGroup.Text style={{height:"45px"}}><i className='bx bx-mobile'></i></InputGroup.Text>
                                                            </label>
                                                        </InputGroup.Prepend>
                                                        <Form.Control style={{height:"45px"}} onInput={collectData} onChange={collectData} type="tel" value={doctor.mobile_no===0 ? "" : doctor.mobile_no}  
                                                            isInvalid={errText.mobile_no} placeholder="Mobile Number" name="mobile_no" id="doctor-mobile" className="doctor-mobile-info" 
                                                        />
                                                        <Form.Control.Feedback style={{padding:"5px"}} type="invalid">
                                                            { errText.mobile_no ? "Mobile number not available" : '' }
                                                        </Form.Control.Feedback>
                                                    </InputGroup>                                               
                                                </Form.Group> 
                                            </Col>
                                        </Row><br />
                                        <Row>
                                            <Col xs={12} md={8}>
                                                <Form.Group>
                                                    <InputGroup hasValidation>
                                                        <InputGroup.Prepend>
                                                            <label htmlFor="doctor-id" style={{cursor:"pointer"}}>
                                                                <InputGroup.Text style={{height:"45px"}}><i className='bx bx-id-card'></i></InputGroup.Text>
                                                            </label>
                                                        </InputGroup.Prepend>
                                                        <Form.Control isInvalid={errText.doctor_id} style={{height:"45px"}} onInput={collectData} onChange={collectData} value={doctor.doctor_id} 
                                                            placeholder="Doctor's ID" name="doctor_id" id="doctor-id" type="text" className="doctor-id-info" 
                                                        />
                                                        <Form.Control.Feedback style={{padding:"5px"}} type="invalid">
                                                            { errText.doctor_id ? 'Doctor ID is already Exists' : ''}
                                                        </Form.Control.Feedback>
                                                    </InputGroup>                                               
                                                </Form.Group>  
                                            </Col>
                                            <Col xs={6} md={4}>
                                                <Form.Group>
                                                    <InputGroup hasValidation>
                                                        <InputGroup.Prepend>
                                                            <label htmlFor="doctor-joined" style={{cursor:"pointer"}}>
                                                                <InputGroup.Text style={{height:"45px"}}><i className='bx bx-calendar'></i></InputGroup.Text>
                                                            </label>
                                                        </InputGroup.Prepend>
                                                        <Form.Control style={{height:"45px"}} onInput={collectData} onChange={collectData} type="date" value={doctor.joined_date}  
                                                            placeholder="Joined Date" name="joined_date" id="doctor-joined" className="doctor-joined-info" 
                                                        />
                                                        <Form.Control.Feedback style={{padding:"5px"}} type="invalid">
                                                            Please Enter a valid email.
                                                        </Form.Control.Feedback>
                                                    </InputGroup>                                               
                                                </Form.Group> 
                                            </Col>
                                        </Row>
                                    </Container>
                                </Modal.Body>
                                <Modal.Footer className="border d-flex align-items-center justify-content-around">
                                    <Button size="lg" variant="danger" onClick={hideAddDoctor}>Close</Button>
                                    <Button size="lg" className="create-doctor-btn" disabled type="submit">Create</Button>
                                </Modal.Footer> 
                            </Form>
                        </Modal>   
                    </div>
                </div>
                <Button style={{display:"none"}} className="update-snack-btn" onClick={handleClick(TransitionUp)}>Down</Button>
                <Snackbar open={open} onClose={handleCloseAdd} TransitionComponent={transition} message="Doctor Account Created" key={transition ? transition.name : ''} />
                <div style={{ height: 400, width: '80%', margin:'auto' }}>
                    <div style={{ display: 'flex', height: '100%' }}>
                        <div style={{ flexGrow: 1 }}>
                            <MUIDataTable title={"Doctor's List"} data={muiData} columns={columns} options={options} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
