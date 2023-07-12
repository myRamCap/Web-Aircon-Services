import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import React, { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Autocomplete, Card, CardMedia, TextField } from '@mui/material';
import { useStateContext } from '../../contexts/ContextProvider';
import axiosClient from '../../axios-client';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';

export default function ServiceCostModal(props) {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState(null)
    const [serviceCenter, setServiceCenter] = useState([])
    const [services, setServices] = useState([])
    const {user_ID, role} = useStateContext()
    const id = props.Data?.id ?? null;
    const [cost, setCost] = useState({
        id: null,
        service_center_id: "",
        service_center: "",
        service_id: "",
        service: "",
        cost: "",
        markup: "",
        notes: "",
      })

    const getServiceCenter = async () => {
        try {
          const response = await axiosClient.get(`/web/servicecenter/${user_ID}`);
          setServiceCenter(response.data.data);
        } catch (err) {
        //   console.error(err);
          // Handle error as needed
        }
      }

    const onSubmit = async (ev) => {
        ev.preventDefault()
        setErrors(null)
        setIsSubmitting(true);
        const payload = {...cost}

        try { 
          const response = id
            ? await axiosClient.put(`/web/servicecost/${id}`, payload)
            : await axiosClient.post('/web/servicecost', payload);
          response
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Your data has been successfully saved!',
          }).then(() => {
            setIsSubmitting(false);
            navigate('/servicecost', { state: 'success' });
          });
        } catch (err) {
          const response = err.response;
          if (response && response.status === 422) {
            setIsSubmitting(false);
            setErrors(response.data.errors);
          }
        }
    }

    const handleChangeSC = async (event, newValue) => {
        setCost({
            ...cost,
            service_center_id: newValue.id,
            service_center: newValue.name
        })

        try {
            const response = await axiosClient.get(`/web/service_center/service/${newValue.id}`);
            setServices(response.data.data);
        } catch (err) {
            // console.error(err);
            // Handle error as needed
        }
    }
    
    const handleChangeService = async (event, newValue) => {
        setCost({
            ...cost,
            service_id: newValue.id,
            service: newValue.name
        })
    }

    useEffect(() => {
        if (id) {
            setCost({
            ...cost,
            id: props.Data.id,
            service_center_id: props.Data.service_center_id,
            service_center: props.Data.service_center,
            service_id: props.Data.service_id,
            service: props.Data.service,
            cost: props.Data.cost,
            markup: props.Data.markup,
            notes: props.Data.notes,
          })
        }
      }, [id])

    useEffect(() => {
        getServiceCenter()
        if (props.show == false) {
          setCost({
            ...cost,
            id: null,
            service_center_id: "",
            service_center: "",
            service_id: "",
            service: "",
            cost: "",
            markup: "",
            cost: "",
          })
          setErrors(null)
          setServices([])
          setServiceCenter([])
        }
    },[props.show])

    return (
        <div id="servicecostModal">
            <Modal show={props.show} onHide={props.close} backdrop="static" size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{id ? 'Edit Services' : 'Add Services'}</Modal.Title>
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
                                    <Autocomplete
                                        disableClearable
                                        value={cost.service_center}
                                        options={serviceCenter}
                                        onChange={handleChangeSC}
                                        getOptionLabel={(options) => options.name ? options.name.toString() : cost.service_center}
                                        isOptionEqualToValue={(option, value) => option.name ?? "" === cost.service_center}
                                        renderInput={(params) => (
                                            <TextField
                                            {...params}
                                            label="Service Centers"
                                            InputProps={{
                                                ...params.InputProps,
                                                type: 'search',
                                            }}
                                            />
                                        )}
                                    />
                                </Col>
                                <Col xs={12} md={6}>
                                    <Autocomplete
                                        disableClearable
                                        value={cost.service}
                                        options={services}
                                        onChange={handleChangeService}
                                        getOptionLabel={(options) => options.name ? options.name.toString() : cost.service}
                                        isOptionEqualToValue={(option, value) => option.name ?? "" === cost.service}
                                        renderInput={(params) => (
                                            <TextField
                                            {...params}
                                            label="Service"
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
                            <Row>
                                <Col xs={12} md={6}>
                                    <TextField 
                                        type="number" 
                                        onChange={ev => setCost({...cost, cost: ev.target.value})} 
                                        value={cost.cost} 
                                        label="Cost" 
                                        variant="outlined" 
                                        fullWidth
                                    />
                                </Col>
                                <Col xs={12} md={6}>
                                    <TextField 
                                        type="number" 
                                        onChange={ev => setCost({...cost, markup: ev.target.value})} 
                                        value={cost.markup} 
                                        label="Mark Up" 
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
                                        type="text" 
                                        value={cost.notes} 
                                        onChange={ev => setCost({...cost, notes: ev.target.value})} 
                                        id="notes" 
                                        label="Notes.." 
                                        variant="outlined" 
                                        fullWidth 
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Row >
                            <Col xs={12} md={12}>
                            <Button variant="success"  type="submit" disabled={isSubmitting} > {id ? 'Save Changes' : 'Save'}</Button>
                            </Col>
                        </Row>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}
