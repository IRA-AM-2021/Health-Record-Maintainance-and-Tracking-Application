import React, { useEffect, useState, useRef, Component } from 'react'
import AddInfo from './AddInfo'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { Container, Button, Form, Badge, InputGroup, Row, Col, Spinner, Popover, OverlayTrigger } from 'react-bootstrap'
import Chip from '@material-ui/core/Chip'
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ScheduleIcon from '@material-ui/icons/Schedule';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SaveIcon from '@material-ui/icons/Save'
import dateFormat from 'dateformat'
import Scroll from 'react-scroll'
import { scrollToTop } from 'react-scroll/modules/mixins/animate-scroll'
import { uniqId } from './../../../Unique.js'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import { Editor } from "react-draft-wysiwyg"
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import AddPrescriptionDetails from './AddPrescriptionDetails'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import draftToHtml from 'draftjs-to-html'
import draftToMarkdown from 'draftjs-to-markdown';

var Link = Scroll.Link;
var DirectLink = Scroll.DirectLink;
var Element = Scroll.Element;
var Events = Scroll.Events;
var scroll = Scroll.animateScroll;
var scrollSpy = Scroll.scrollSpy;

const useStyles = makeStyles((theme) => ({
    root: {
        width: 500,
        '& > * + *': {
        marginTop: theme.spacing(3),
        },
    },
}))

const linkStyle = {
  color: 'white',
  textTransform:"Capitalize",
  fontSize:"1.1em",
  cursor:"pointer",
};

const useStyles1 = makeStyles((theme) => ({
    root: {
        maxWidth: 405,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));

const useStyles2 = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
}));

export default function Patient(props) {

    const classes = useStyles();
    const classes1 = useStyles2();
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const [patientData, setPatientData]=useState([])
    const [patientID, setPatientID]=useState("")
    const [currentPatientInfo, setCurrentPatientInfo]=useState([])
    const [historyInfo, setHistoryInfo]=useState([])
    const [isModalOpen,setIsModalOpen]=useState(false)
    const [isTodoViewOpen,setIsTodoViewOpen]=useState(false)
    const [refresh,setRefresh]=useState(false)
    let count=0

    useEffect(()=>{
        (
            async()=>{
                let response=await fetch('http://localhost:8000/api/patient/patients-lists/',{
                    headers:{'Content-Type': 'application/json'}
                })
                let content=await response.json()
                setPatientData(content)
                
                // console.log(patientData)
            }
        )()
    },[])

    const options = patientData.map((option) => {
        const firstLetter = option.aadhar_number[0].toUpperCase();
        return {
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
            ...option,
        }
    })

    let getPatientsData=async(value)=>{
        if(value!==null && value!=="props"){
            setPatientID(value.aadhar_number)
            setCurrentPatientInfo(value)
        }
        else if(value==="props"){
            setPatientID(patientID)
            setCurrentPatientInfo(currentPatientInfo)
        }
        else{
            setPatientID("")
            setCurrentPatientInfo("")
        }

        let response=await fetch(`http://localhost:8000/api/patient/patients-prescription-history/?aadhar_number=${patientID}`,{
            headers:{'Content-Type': 'application/json'}
        })
        let content=await response.json()

        // console.log(convertToRaw(this.state.editorState.getCurrentContent()))
        // console.log(content[0].description.getCurrentContent())
        setHistoryInfo(content)

    }

    const scrollToBottom=()=>{
        window.scrollTo({
            top:document.documentElement.scrollHeight,
            behavior:"smooth"
        })
        getPatientsData("props")
        document.querySelector('.patient-doctor-history').style.display="block"
    }

    const scrollToBottomAdd=()=>{        
        setIsModalOpen(true)
        if(isModalOpen){
            window.scrollTo({
                top:document.documentElement.scrollHeight,
                behavior:"smooth"
            })     
        }
    }

    return (
        <div className="search-content">
            <Autocomplete
                id="grouped-demo"
                options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                groupBy={(option) => option.firstLetter}
                getOptionLabel={(option) => option.aadhar_number}
                getOptionSelected={(option, value) => option.aadhar_number === value.aadhar_number }
                onChange={(event, newValue) => {
                    getPatientsData(newValue);
                }}
                style={{ width: "60%", margin:"auto" }}
                renderInput={(params) => <TextField {...params} placeholder="Find Patients using their ID" variant="outlined" />}
            />
            <div className="patient-details-content">
                <div className="patients-history-edit-details">
                    {
                        patientID!=="" ? 
                            <div className="content-info">
                                <div className="info">
                                    <div className="content">
                                        <div className="card">
                                            <div className="firstinfo">
                                                <img src={"http://localhost:8000"+currentPatientInfo.logo} />
                                                <div className="profileinfo">
                                                    <h1>{currentPatientInfo.patient_name}</h1>
                                                    <h6>{currentPatientInfo.aadhar_number}</h6>
                                                    <h5>DOB : {currentPatientInfo.date_of_birth}</h5>                                                
                                                    <h3>{currentPatientInfo.email}</h3>
                                                    <h3>{currentPatientInfo.mobile_no}</h3>
                                                    <p className="bio">
                                                        {currentPatientInfo.email_verified.toString()==="true" ? <span className="p-2 badge bg-success text-light" >Email Verified</span> : <span className="p-2 badge bg-warning text-dark">Email Not Verified</span>} &nbsp; 
                                                        {currentPatientInfo.mobile_verified.toString()==="true" ? <span className="p-2 badge bg-success text-light" >Mobile Verified</span> : <span className="p-2 badge bg-warning text-dark">Mobile Not Verified</span>}
                                                    </p>
                                                    <center>
                                                        <Link activeClass="active" to="addInsideContainer" onClick={scrollToBottomAdd} variant="primary" className="clickScroll btn btn-primary" style={linkStyle} smooth={true} duration={5000} containerId="containerElement">Add</Link> &nbsp; &nbsp;
                                                        <Link activeClass="active" onClick={scrollToBottom} variant="primary" to="secondInsideContainer" className="clickScroll btn btn-primary" style={linkStyle} smooth={true} duration={5000} containerId="containerElement">View</Link>
                                                    </center>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div><br /><br />
                                <section>
                                    <AddInfo open={isModalOpen}> 
                                        <button style={{border:"none",background:"transparent",float:"right",fontSize:"20px"}} onClick={()=>{document.querySelector('.patient-info').classList.add('patient-info-hide');setTimeout(()=>{document.querySelector('.patient-info').classList.remove('patient-info-hide');setIsModalOpen(false)},200)}}><i className="fas fa-times"></i></button>
                                            <div className="add-patient-info">
                                                <h4 style={{textAlign:"Center",lineHeight:"60px"}} className="hospital-register-header">Add Prescription Details</h4>  
                                                <Container>
                                                    <AddPrescriptionDetails hospitalid={props.hospitalid} getHistory={getPatientsData} appid={props.appid} aadharnumber={currentPatientInfo.aadhar_number} />
                                                </Container> 
                                            </div>
                                    </AddInfo>
                                </section>
                                <Element name="addInsideContainer">
                                </Element>
                                <section>
                                    <Element name="test7" className="element live-updates-section patient-doctor-history" id="containerElement" style={{overflow:"hidden", width:"80%", display:"none", position: 'relative',margin:"20px auto",paddingTop:"-20px",height: '100%'}} >
                                        <div className="patient-history-content">
                                            <div className={classes1.root}>
                                                {
                                                    historyInfo.slice(0).reverse().map((history)=>(
                                                        // {count=count+1}
                                                        <Accordion key={history.id} expanded={expanded === `panel${count=count+1}`} onChange={handleChange(`panel${count}`)}>
                                                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
                                                                <Typography style={{color:"black"}} className={classes1.heading}>{dateFormat(history.entered_date, "mmmm dS, yyyy")}</Typography>
                                                                <Typography style={{color:"black"}} className={classes1.secondaryHeading}>{history.cause}</Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                <Typography>
                                                                    {/* <GetHistoryInfo desc={history.description} /> */}
                                                                    {history.description}
                                                                    {/* <textarea value={draftToHtml(convertToRaw(prescription.getCurrentContext()))} className="form-control" name="description" placeholder="Prescription" rows="6"></textarea> */}
                                                                </Typography>
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        <Element name="secondInsideContainer">
                                        </Element>
                                    </Element>
                                </section>
                            </div>
                        : ''
                    }        
                                                            
                </div>
            </div>
        </div>
    )
}
