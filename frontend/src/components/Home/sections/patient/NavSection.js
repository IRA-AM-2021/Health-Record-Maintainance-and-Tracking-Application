import React, { useEffect, useState } from 'react'
import { Route, BrowserRouter, Link, NavLink, Switch } from 'react-router-dom'
import { Button, Modal, ModalHeader, Row, Col, ModalBody, ModalFooter } from 'react-bootstrap'

let NavSection=(props)=>{
    
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () =>  setShow(true);

    let logout=async ()=>{
        let response=await fetch('http://localhost:8000/api/patient/logout/',{
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
        <div>
            <button className="btn btn-primary" onClick={handleShow}>
                <i className="bx bx-log-out" id="log-out"></i>
                <span className="links-name">Logout</span>
            </button>
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
    )
}

export default NavSection