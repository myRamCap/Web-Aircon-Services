import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import React, { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Autocomplete, TextField } from '@mui/material';
import axiosClient from '../../axios-client';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';

export default function UserModal(props) {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState([])
  const [hide, setHide] = useState(true)
  const [service_center, setService_Center] = useState([])
  const [branchManager, setBranchManager] = useState([])
  const [errors, setErrors] = useState(null)
  const id = props.Data?.id ?? null
  const [user, setUser] = useState({
    id: null,
    first_name: "",
    last_name: "",
    fullname: "",
    email: "",
    contact_number: "",
    role_id: "",
    role_name: "",
    service_center_id: "",
    service_center: "",
    allowed_sc: "1",
    allowed_bm: "5",
    branch_manager_id: "0",
    branch_manager: "",
    user_role: props.userRole,
    user_id: props.userID
  })

  const getRoles = async () => {
    try {
      //master
      const response = await axiosClient.get(`/web/roles/${props.userID}`)
      setRoles(response.data.data)
    } catch (error) {
      // Handle error
    }
  }

  const getServiceCenter = async () => {
    try {
      //master
      const response = await axiosClient.get(`/web/corporateservicecenter/${props.userID}`)
      setService_Center(response.data.data)
    } catch (error) {
      // Handle error 
    }
  }

  const getBranchManager = async () => {
    try {
      const response = await axiosClient.get(`/web/branchmanager/${props.userID}`)
      setBranchManager(response.data)
    } catch (error) {
      // Handle error
    }
  }

  const handleChangeRole = (event, newValue) => {
    setUser({
      ...user,
      role_id: newValue?.id,
      role_name: newValue?.name,
    })
    if (props.userRole == 2) {
      if (newValue.name === "Branch Advisor") {
        setHide(true)
      } else {
        setHide(false)
      }
    }
  }

  const handleChangeServiceCenter = (event, newValue) => {
    setUser({
      ...user,
      service_center_id: newValue?.id,
      service_center: newValue?.name,
    })
  }

  const handleChangeBranchManager= (event, newValue) => {
    setUser({
      ...user,
      branch_manager_id: newValue?.id,
      branch_manager: newValue?.fullname,
    })
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    setIsSubmitting(true);
    const payload = {...user}

    try {
      const response = id
        ? await axiosClient.put(`/web/users/${id}`, payload)
        : await axiosClient.post('/web/users', payload);
      response
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: id ? 'Your data has been successfully updated!' : 'Your data has been successfully saved!',
      }).then(() => {
        setIsSubmitting(false);
        navigate('/users', { state: 'success' });
      });
    } catch (err) {
      const response = err.response;
      if (response && response.status === 422) {
        setIsSubmitting(false);
        setErrors(response.data.errors);
      }
    }
  }

  useEffect(() => {
    if (id) {
      setUser({
        ...user,
        id: props.Data.id,
        first_name: props.Data.first_name,
        last_name: props.Data.last_name,
        fullname: props.Data.fullname,
        email: props.Data.email,
        contact_number: props.Data.contact_number,
        role_id: props.Data.role_id,
        role_name: props.Data.role_name,
        service_center_id: props.Data.service_center_id,
        service_center: props.Data.service_center,
        branch_manager: props.Data.branch_manager,
        allowed_sc: props.Data.allowed_sc,
        allowed_bm: props.Data.allowed_bm,
      })

      if (props.Data.role_id == 4) {
        setHide(true)
      }
    }
 
  }, [id])

  useEffect(() => {
    getRoles()
    getServiceCenter()
    getBranchManager()
    if (props.show == false) {
      setUser({
        ...user,
        id: null,
        first_name: "",
        last_name: "",
        email: "",
        contact_number: "",
        service_center_id: "",
        service_center: "",
        branch_manager_id: "0",
        branch_manager: "",
        role_id: "",
        role_name: "",
        allowed_sc: "1",
        allowed_bm: "5"
      })
      setErrors(null)
      setHide(false)
    }
  },[props.show])

  return (
    <div id="servicesModal">
        <Modal show={props.show} onHide={props.close} backdrop="static" size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{id ? 'Edit User' : 'Add User'}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-main">
            {errors && 
              <div className="sevices_logo_errors">
                {Object.keys(errors).map(key => (
                  <p key={key}>{errors[key][0]}</p>
                ))}
              </div>
            }
            <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Row>
                <Col xs={12} md={6}>
                  <TextField 
                    type="text"
                    value={user.first_name}
                    onChange={ev => setUser({...user, first_name: ev.target.value})}
                    id="fname"
                    label="First Name"
                    variant="outlined"
                    fullWidth
                  />
                </Col>
                <Col xs={12} md={6}> 
                  <TextField 
                    type="text"
                    value={user.last_name}
                    onChange={ev => setUser({...user, last_name: ev.target.value})}
                    id="lname"
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                  />
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Row>
                <Col xs={12} md={6}>
                  <TextField
                    type="email"
                    value={user.email}
                    onChange={ev => setUser({...user, email: ev.target.value})}
                    id="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                  />
                </Col>
                <Col xs={12} md={6}> 
                <TextField
                  type="text"
                  value={user.contact_number}
                  onChange={ev => setUser({...user, contact_number: ev.target.value})}
                  id="number"
                  label="Contact Number"
                  variant="outlined"
                  fullWidth
                />
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Row>
                <Col xs={12} md={6}>
                <Autocomplete
                    disableClearable
                    onChange={handleChangeRole}
                    options={roles}
                    value={user.role_name}
                    getOptionLabel={(options) => options.name ? options.name.toString() : user.role_name}
                    isOptionEqualToValue={(option, value) => option.name ?? "" === user.role_name}
                    renderInput={(params) => (
                        <TextField
                        {...params}
                        label="Role"
                        InputProps={{
                            ...params.InputProps,
                            type: 'search',
                        }}
                        />
                    )}
                  />
                </Col>
                <Col xs={12} md={6}>
                { props.userRole == 2 &&
                  <Autocomplete
                    disableClearable
                    onChange={handleChangeServiceCenter}
                    options={service_center}
                    value={user.service_center}
                    getOptionLabel={(options) => options.name ? options.name.toString() : user.service_center}
                    isOptionEqualToValue={(option, value) => option.name ?? "" === user.service_center}
                    renderInput={(params) => (
                        <TextField
                        {...params}
                        label="Service Center"
                        InputProps={{
                            ...params.InputProps,
                            type: 'search',
                        }}
                        />
                    )}
                  />
                }
                </Col>
              </Row>
            </Form.Group>
            { props.userRole == 1 &&
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Row>
                  <Col xs={12} md={6}>
                    <TextField
                      type="number"
                      value={user.allowed_sc}
                      onChange={ev => setUser({...user, allowed_sc: ev.target.value})}
                      label="Number of Service Center"
                      variant="outlined"
                      fullWidth
                    />
                  </Col>
                  <Col xs={12} md={6}> 
                  <TextField
                    type="number"
                    value={user.allowed_bm}
                    onChange={ev => setUser({...user, allowed_bm: ev.target.value})}
                    label="Number of Branch Manager"
                    variant="outlined"
                    fullWidth
                  />
                  </Col>
                </Row>
              </Form.Group>
            }
            { hide  &&
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Row>
                  <Col xs={12} md={6}>
                  <Autocomplete
                    disableClearable
                    onChange={handleChangeBranchManager}
                    options={branchManager}
                    value={user.branch_manager}
                    getOptionLabel={(options) => options.fullname ? options.fullname.toString() : user.branch_manager}
                    isOptionEqualToValue={(option, value) => option.fullname ?? "" === user.branch_manager}
                    renderInput={(params) => (
                        <TextField
                        {...params}
                        label="Branch Manager"
                        InputProps={{
                            ...params.InputProps,
                            type: 'search',
                        }}
                        />
                    )}
                  />
                  </Col>
                </Row>
              </Form.Group>
            }
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Row >
                <Col xs={12} md={12}>
                  <Button variant="success"  type="submit" disabled={isSubmitting}>Save Changes</Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
            </Modal.Body>
        </Modal>
    </div>
  )
}
