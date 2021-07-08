import React, { useEffect, useState } from 'react'
import { Form, Spinner, Col, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap'
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

export default function Profile() {
    
    const [ update,setUpdate ]=useState({
        branch:'',address:'',hospital_id:'',hospital_name:'',
        pincode:'',logo:'',mobile_no:0,user_id:'',email:''
    })
    
    const [modalShow, setModalShow] = React.useState(false);
    const [show, setShow] = useState(false)
    const [editField,setEditField]=useState("")
    const [editCurrentValue,setEditCurrentValue]=useState("")
    const [operation,setOperation]=useState("")
    const [isImgClicked,setIsImgClicked]=useState(false)
    // const { enqueueSnackbar } = useSnackbar();

    const [{alt, src}, setImg] = useState({
        src: "https://www.shareicon.net/data/2016/07/26/801997_user_512x512.png",
        alt: 'Logo',
    });

    const handleImg = (e) => {
        if(e.target.files[0]) {
            setImg({
                src: URL.createObjectURL(e.target.files[0]),
                alt: e.target.files[0].name,
            });   
            setIsImgClicked(true) 
        }  
        setUpdate({
            branch:update.branch,email:update.email,
            hospital_id:update.hospital_id,hospital_name:update.hospital_name,
            user_id:update.user_id,mobile_no:update.mobile_no,
            address:update.address,pincode:update.pincode,logo:e.target.files[0]
        });
    }

    useEffect(()=>{
        getAdminDetails();
    },[])

    let getAdminDetails =async()=>{

        let response=await fetch('http://localhost:8000/api/hospital-admin/',{
            headers:{'Content-Type': 'application/json'},
            credentials:'include'
        })

        let content=await response.json()

        setUpdate({
            branch:content.branch,email:content.email,
            hospital_id:content.hospital_id,hospital_name:content.hospital_name,
            user_id:content.user_id,mobile_no:content.mobile_no,
            address:content.address,pincode:content.pincode,logo:content.logo
        })
        if(content.logo){
            let imgLogo=content.logo
            console.log(imgLogo)
            // let imgLogoModified=imgLogo.replaceAll("/media/media", "/media")// imgLogo.replace("/media", "")
            // imgSRC = require("./../../../../backend"+imgLogoModified).default
            setTimeout(()=>{
                // let imgLogoModified=imgLogo.replace("/media/media", "/media")// imgLogo.replace("/media", "")
                // console.log(imgLogoModified)
                setImg({
                    src: "http://localhost:8000"+imgLogo,
                    alt: content.hospital_name
                })
                // console.log(src)

            },500)
        }
    }

    let updateAdminProfile=async (e)=>{
        e.preventDefault();
        let formField=new FormData()
        formField.append('branch',update.branch)
        formField.append('email',update.email)
        formField.append('hospital_id',update.hospital_id)
        formField.append('hospital_name',update.hospital_name)
        formField.append('mobile_no',update.mobile_no)
        formField.append('address',update.address)
        formField.append('pincode',update.pincode)

        if(isImgClicked){
            formField.append('logo',update.logo)
            setIsImgClicked(false) 
        }

        let response=await fetch("http://localhost:8000/api/hospital-update/",{
            method:"PUT",
            credentials:'include',
            body:formField
        })
        let content=await response.json()
        document.querySelector('.update-snack-btn').click()
    }

    const handleClose = () => setShow(false);
    const handleShow = () =>  setShow(true);

    let selectedValue=(e)=>{
        setEditCurrentValue("")
        setEditField(e.target.value)
        let op = editField==="branch" ? update.branch : editField==="hospital_name" ? update.hospital_name : editField==="hospital_id" ? update.hospital_id : editField==="address" ? update.address : editField==="pincode" ? update.pincode : ''
        setOperation(op)
    }

    let setEditValue=(e)=>{
        setUpdate({...update,[editField]:e.target.value})
        setEditCurrentValue(e.target.value)
    }

    // const handleClickVariant = (variant) => () => {
    //     enqueueSnackbar('This is a success message!', { variant });
    // };
    const [open, setOpen] = React.useState(false);
    const [transition, setTransition] = React.useState(undefined);

    const handleClick = (Transition) => () => {
        setTransition(() => Transition);
        setOpen(true);
    };

    const handleCloseUpdate = () => {
        setOpen(false);
    };

    return (
        <div className="admin-profile-content">
            <Form method="POST" style={{padding:"20px"}} encType="multipart/form-data" onSubmit={updateAdminProfile}>
                <div className="profile-card">
                        <i variant="primary" onClick={handleShow} style={{fontSize:"25px",position: "absolute",right:"0"}} className='fa fa-edit m-2'></i>
                        <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title id="contained-modal-title-vcenter">
                                    Update
                                </Modal.Title>
                            </Modal.Header>
                                <Form.Group controlId="exampleForm.SelectCustom"  className="p-4">
                                    <Form.Label>Edit</Form.Label>
                                    <select onSelect={selectedValue} onInput={selectedValue} onChange={selectedValue} className="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
                                        <option value="">Click Here to Select</option>
                                        <option name="branch" value="branch">Branch</option>
                                        <option name="hospital_name" value="hospital_name">Hospital Name</option>
                                        <option name="hospital_id" value="hospital_id">Registeration Number</option>
                                        <option name="address" value="address">Address</option>
                                        <option name="pincode" value="pincode">pincode</option>
                                    </select>
                                </Form.Group>
                            <Modal.Body>
                                <Row>
                                    <Col xs={5}>
                                       <Form.Group>
                                            <Form.Label>Current Value</Form.Label>
                                            <Form.Control disabled style={{height:"45px"}} value={operation} placeholder="Previous Value" name="profile-edit-info" id="profile-edit-info" type="text" className="profile-edit-info" />
                                            <Form.Control.Feedback type="invalid">
                                                Please Enter a valid email.
                                            </Form.Control.Feedback>
                                        </Form.Group>   
                                    </Col>
                                    <Col style={{textAlign:"center"}}>
                                        <br />
                                        <i style={{paddingTop:"10px"}} className='fas fa-arrow-right glow-exchange'></i>
                                        <p style={{fontSize:"16px"}}>convert to</p>
                                    </Col>
                                    <Col xs={5}>
                                        <Form.Group>
                                            <Form.Label>New Value</Form.Label>
                                            <Form.Control style={{height:"45px"}} value={editCurrentValue} onInput={setEditValue} onChange={setEditValue} placeholder="Enter new value" name="convert-valur" id="convert-valur" type="text" className="convert-valur" />
                                            <Form.Control.Feedback type="invalid">
                                                Please Enter a valid email.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>Modify</Button>
                            </Modal.Footer>
                        </Modal>
                    <div className="profile-img">
                        <input type="file" accept=".png, .jpg, .jpeg" name="logo" id="photo" className="profile-img-change visually-hidden" onChange={handleImg} />
                        <img src={src} alt={alt} style={{display:"inline-block"}} onClick={(e)=>{
                                document.querySelector('.profile-img-change').click()
                            }} className="logo-img-admin"
                        />
                    </div>
                    <div className="profile-cnt js-profile-cnt">
                        <div className="profile-name">{update.hospital_name}</div>
                        <div className="profile-txt">{update.branch} {update.pincode==="null" ? '' : <strong>, {update.pincode}</strong>}</div>
                        {update.address==="null" ? '' :
                        <div className="profile-card-loc">
                            <span className="profile-card-loc__icon">
                                <i className="fa fa-street-view" aria-hidden="true"></i>
                            </span>
                            <span className="profile-card-loc__txt">
                                {update.address}
                            </span>
                        </div>
                        }
                    </div>
                    <div className="form-sections">
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control disabled style={{height:"45px"}} placeholder="Enter Hospital name" value={update.email} name="hospital_name" id="HospitalName" type="text" className="Hospital-Name" />
                                    <Form.Control.Feedback type="invalid">
                                        Please Enter a valid email.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Registration Number</Form.Label>
                                    <Form.Control disabled style={{height:"45px"}} placeholder="Enter Registeration number" name="hospital_id" value={update.hospital_id} id="HospitalRegister" type="text" className="Hospital-Register"/> {/*isInvalid*/} 
                                    <Form.Control.Feedback type="invalid">
                                        Please Enter a valid email.
                                    </Form.Control.Feedback> 
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Mobile Number</Form.Label>
                                    <Form.Control disabled style={{height:"45px"}} placeholder="Enter Mobile number" name="mobile_no" value={update.mobile_no} id="mobile_no" type="text" className="mobile_no"/> {/*isInvalid*/} 
                                    <Form.Control.Feedback type="invalid">
                                        Please Enter a valid email.
                                    </Form.Control.Feedback> 
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>
                    <div className="update-btn">
                        <LoadingButton />
                    </div>
                    {/* <Button onClick={handleClickVariant('success')}>Show success snackbar</Button> */}
                    <Button style={{display:"none"}} className="update-snack-btn" onClick={handleClick(TransitionUp)}>Down</Button>
                    <Snackbar
                        open={open}
                        onClose={handleCloseUpdate}
                        TransitionComponent={transition}
                        message="Changes Updated"
                        key={transition ? transition.name : ''}
                    />
                </div> 
            </Form>
        </div>
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
        setLoading(true)
        e.target.click()
    }

    return (
        <Button type="submit" className='update-admin-profile-btn update-btn-view' variant="primary" disabled={isLoading} onClick={!isLoading ? handleClick : null}>
            {isLoading ?  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Save'}
        </Button>
    )
}

function simulateNetworkRequest() {
    return new Promise((resolve) => setTimeout(resolve, 2000));
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

{/* <label  className="form-img__file-label"> */}
    {/* <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="#56ceef" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3" />
        <circle cx="12" cy="10" r="3" />
        <circle cx="12" cy="12" r="10" />
    </svg> */}
{/* </label> */}
