import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Form, Button, InputGroup, Navbar, Col, Row, FormControl } from 'react-bootstrap'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import axios from 'axios'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
        marginTop: theme.spacing(2),
        },
    },
    table: {
        minWidth: 650,
    },
}));

/* 
function createData(name, calories, fat) {
  return { name, calories, fat };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
]; */

export default function Department() {
    const [ tableData, setTableData ]=useState([])
    const classes = useStyles();
    const [ department, setDepartment ]=useState("");
    const [ deptErr, setDeptErr ]=useState(false);
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    let saveDept=async(e)=>{
        e.preventDefault();
        if(department===""){
            setDeptErr(true)
        }
        else{
            setDeptErr(false)

            let res=await fetch('http://localhost:8000/api/hospital-admin/',{
                headers:{'Content-Type': 'application/json'},
                credentials:'include'
            })
            let con=await res.json()

            let formField=new FormData()
            formField.append('user_id',con.user_id)
            formField.append('department',department)

            let send=await axios({
                method:"POST",
                url:"http://localhost:8000/api/hospital-dept-add/",
                data:formField,
                headers:{'Content-Type':'application/json'},
                credentials:'include'
            }).then((response)=>{
                let status=response.data.message
                if(status==="success"){
                    setDepartment("")
                    getDepartments()
                    document.querySelector('.dept-added').click()
                }    
                else{
                    // setDepartment("")
                    console.log("D")
                }
            })
        }
    }
    
    useEffect(()=>{
        getDepartments()
    },[])

    const getDepartments=async()=>{
        let response=await fetch('http://localhost:8000/api/hospital-dept/',{
            headers:{'Content-Type': 'application/json'},
            credentials:'include'
        })
        let content=await response.json()
        setTableData(content)
        // console.log(tableData)
    }

    return (
        <div className={classes.root} style={{width:"80%",margin:"auto"}}>
            <h3 style={{textAlign:"center",height:"60px",marginTop:"30px"}}>List of Departments</h3>
            <Row>
                <Col>
                    <Form onSubmit={saveDept} style={{maxWidth:"70%",margin:'auto'}} inline method="POST">
                        <Form.Group>
                            <InputGroup hasValidation>
                                <InputGroup.Prepend>
                                    <label htmlFor="dept-name" style={{cursor:"pointer"}}>
                                        <InputGroup.Text style={{height:"45px"}}><i className='far fa-address-card'></i></InputGroup.Text>
                                    </label>
                                </InputGroup.Prepend>
                                <Form.Control isInvalid={deptErr} style={{height:"45px"}} onChange={(e)=>setDepartment(e.target.value)} onInput={(e)=>setDepartment(e.target.value)} value={department} placeholder="Enter Department Name" name="dept" id="dept-name" type="text" className="dept-name-info" />
                                <br />
                                <Form.Control.Feedback type="invalid">
                                    Field is Empty.
                                </Form.Control.Feedback>
                                <Button type="submit" size="lg" variant="primary">Add New</Button>
                            </InputGroup>                                               
                        </Form.Group>  
                    </Form>
                </Col>
            </Row>
            <TableContainer style={{width:"60%",margin:"auto",overflow:"hidden",marginTop:"20px"}} component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        {/* <TableCell style={{fontSize:"22px"}} className="text-center">Departments</TableCell> */}
                        {/* <TableCell align="right">Total Doctors</TableCell> */}
                        {/* <TableCell align="right"></TableCell> */}
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {tableData.slice(0).reverse().map((data) => (
                        <TableRow key={data.id}>
                            <TableCell style={{fontSize:"18px"}} component="th" scope="row">
                                {data.department}
                            </TableCell>
                            {/* <TableCell align="right"></TableCell> */}
                            {/* <TableCell align="right">}</TableCell> */}
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>     
            <Button variant="outlined" className="dept-added" style={{display:"none"}} onClick={handleClick}>
                Open success snackbar
            </Button>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Department Added Successfully
                </Alert>
            </Snackbar>
        </div>
    )
}
