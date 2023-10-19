import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {FiEdit} from "react-icons/fi"
import {MdDeleteOutline} from "react-icons/md"
import './Crud.css'

import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";

const Crud = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // const empData = [
  //   {
  //     EmployeeId: 1,
  //     Name: "chulbul",
  //     Email: "cs@gmail.com",
  //   },
  //   {
  //     EmployeeId: 2,
  //     Name: "rahul",
  //     Email: "rahul@gmail.com",
  //   },
  //   {
  //     EmployeeId: 3,
  //     Name: "arul",
  //     Email: "arul@gmail.com",
  //   },
  // ];
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get("https://localhost:7201/api/Employee")
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleEdit = (id) => {
    //alert(id);
    handleShow();
    axios.get(`https://localhost:7201/api/Employee/${id}`)
    .then((result) => {
        setEditName(result.data.name)
        setEditEmail(result.data.email)
        setEditId(id)
    })
    .catch((error) => {
        console.log(error)
    })
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this Employee") === true) {
      axios.delete(`https://localhost:7201/api/Employee/${id}`)
      .then((result) => {
        if(result.status === 200){
            toast.success('Employee has been deleteed successfully')
            getData();
        }
      })
      .catch((error) => {
        toast.error(error)
      })
    }
  };

  const handleUpdate = () => {
    const url = `https://localhost:7201/api/Employee/${editId}`
    const data = {
        "id":editId,
        "name": editName,
        "email": editEmail,
      };
      axios.put(url,data)
      .then((result) => {
        handleClose();
          getData();
          cleanData();
          toast.success("Employee has been updated successfully")
      }).catch((error) => {
          toast.error(error)
      })
  };

  const handleSubmit = () => {
    const url = "https://localhost:7201/api/Employee";
    const data = {
      "name": name,
      "email": email,
    };
    axios.post(url,data)
    .then((result) => {
        getData();
        cleanData();
        toast.success('Employee has been deleted successfully', {
          className: 'custom-toast-success',
        });
    }).catch((error) => {
        toast.error(error)
    })
  };


  const cleanData = () => {
    setName('')
    setEmail('')
    setEditName('')
    setEditEmail('')
    setEditId('')
  }

  return (
    <>
    <ToastContainer/>
      <Container style={{marginTop:"30px"}}>
        <Row style={{backgroundColor:"#7416CC",borderRadius:"5px"}}>
          <Col style={{padding:"20px",margin:"5px"}}>
            <input
              type="text"
              className="form-control "
              style={{border:"2px solid",outline:"none"}}
              value={name}
              placeholder="Enter name here..."
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
          <Col style={{padding:"20px",margin:"5px"}}>
            <input
              type="email"
              className="form-control"
              value={email}
              placeholder="Enter email here..."
              style={{border:"2px solid",outline:"none"}}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Col>
          <Col style={{padding:"20px",margin:"5px"}}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleSubmit()}
            >
              submit
            </button>
          </Col>
        </Row>
      </Container>
      <br />
      <Table striped bordered hover >
        <thead >
          <tr style={{backgroundColor:"red"}}>
            <th style={{backgroundColor:"gray"}}>#</th>
            <th style={{backgroundColor:"gray"}}>EmployeeId</th>
            <th style={{backgroundColor:"gray"}}>Name</th>
            <th style={{backgroundColor:"gray"}}>Email</th>
            <th style={{backgroundColor:"gray"}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0
            ? data.map((ele, index) => {
                return (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#8BAC9B" : "#A0736A" }}>
                    <td>{index + 1}</td>
                    <td style={{ backgroundColor: "#8BAC9B" }}>{ele.id}</td>
                    <td style={{ backgroundColor: "#A0736A" }}>{ele.name}</td>
                    <td style={{ backgroundColor: "#A0736A" }}> {ele.email}</td>
                    {/* <td  > */}
                      {/* <Button
                        variant="primary"
                        onClick={() => handleEdit(ele.id)}
                      >
                        Edit
                      </Button> */}
                      <button onClick={() => handleEdit(ele.id)}>
                        <FiEdit size={25} style={{backgroundColor:"#8BAC9B"}}/>
                      </button>
                      {/* <Button
                        variant="danger"
                        onClick={() => handleDelete(ele.id)}
                      >
                        delete
                      </Button> */}
                      <button onClick={() => handleDelete(ele.id)}>
                        <MdDeleteOutline size={25} style={{backgroundColor:"#A0736A"}}/>
                      </button>
                    {/* </td> */}
                  </tr>
                );
              })
            : "Loading....."}
        </tbody>
      </Table>
      <Modal show={show} onHide={handleClose}  style={{backgroundColor:""}}>
        <Modal.Header closeButton>
          <Modal.Title style={{backgroundColor:"#6c499e",color:"white"}}>Modify/Update Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{backgroundColor:"#6c499e",color:"white"}}>
          <Row>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter name here..."
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email here..."
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </Col>
            <Col></Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Crud;
