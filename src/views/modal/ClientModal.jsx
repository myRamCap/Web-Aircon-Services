import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Autocomplete, TextField } from '@mui/material';
import { useStateContext } from '../../contexts/ContextProvider';
import axiosClient from '../../axios-client';
import Swal from 'sweetalert2'
import Status from '../../data/JSON/refStatus.json'
import { useNavigate } from 'react-router-dom';

export default function ClientModal(props) {
    const {user_ID} = useStateContext()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate()
    const id = props.Data?.id ?? null
    const [client, setCLient] = useState({
        id: null,
        name: "",
        email: "",
        contact_number: "",
        address: "",
        active: "",
        status: "",
        updated_by: user_ID,
    })

    const handleChangeStatus = (event, newValue) => {
        setCLient({
            ...client,
            active: newValue.id,
            status: newValue.status,
          }) 
    }

    const onSubmit = async (ev) => {
        ev.preventDefault()
        setIsSubmitting(true);
        const payload = {...client}

        try {
            const response = await axiosClient.put(`/web/client/${id}`, payload);
            response
            Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Your data has been successfully updated!',
            }).then(() => {
                setIsSubmitting(false);
                navigate('/client', { state: 'success' });
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
        if (id && props.Data) {
          const { id, name, email, contact_number, address, active } = props.Data;
          const status = active ? 'Active' : 'In-Active';
      
          setCLient({
            ...client,
            id,
            name,
            email,
            contact_number,
            address,
            active,
            status
          });
        }
      }, [id, props.Data]);

      useEffect(() => {
        if (props.show == false) {
          setCLient({
            ...client,
            id: null,
            name: "",
            email: "",
            contact_number: "",
            address: "",
            active: "",
            status: "",
          })
          setErrors(null)
        }
      },[props.show])

    return (
        <div id="clientModal">
            <Modal show={props.show} onHide={props.close} backdrop="static" size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Client</Modal.Title>
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
                                    <TextField disabled type="text" value={client.name} label="Name" variant="outlined" fullWidth/>
                                </Col>
                                <Col xs={12} md={6}>
                                    <TextField disabled type="text" value={client.email} label="Email" variant="outlined" fullWidth/>
                                </Col> 
                            </Row>
                            <Row className='mt-3'> 
                                <Col xs={12} md={6}>
                                    <TextField disabled type="text" value={client.address} label="Address" variant="outlined" fullWidth/>
                                </Col>
                                <Col xs={12} md={6}>
                                    <TextField type="text" value={client.contact_number} onChange={ev => setCLient({...client, contact_number: ev.target.value})} label="Contact Number" variant="outlined" fullWidth/>
                                </Col> 
                            </Row>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Row className='mt-3'> 
                                <Col xs={12} md={6}>
                                    <Autocomplete
                                        disableClearable
                                        value={client.status}
                                        options={Status.RECORDS}
                                        onChange={handleChangeStatus}
                                        getOptionLabel={(options) => options.status ? options.status.toString() : client.status}
                                        isOptionEqualToValue={(option, value) => option.status ?? "" === client.status}
                                        renderInput={(params) => (
                                            <TextField
                                            {...params}
                                            label="Status"
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
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Row >
                                <Col xs={12} md={12}>
                                    <Button variant="success" type="submit" disabled={isSubmitting} >Save Changes</Button>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}
