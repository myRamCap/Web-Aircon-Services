import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import React, { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Autocomplete, Card, CardMedia, TextField } from '@mui/material';
import NoImage from '../../assets/images/No-Image.png';
import axiosClient from '../../axios-client';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';

export default function ServicesModal(props) {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState(null)
  const id = props.Data?.id ?? null;
  const [serviceLogo, setServiceLogo] = useState([])
  const [service, setService] = useState({
    id: null,
    name: "",
    details: "",
    image_id: "",
    image_url: "",
  })
 
  const getServiceLogo = async () => {
    try {
      const response = await axiosClient.get('/web/serviceslogo');
      setServiceLogo(response.data.data);
    } catch (err) {
      console.error(err);
      // Handle error as needed
    }
  }

  const onSubmit = async (ev) => {
      ev.preventDefault()
      setErrors(null)
      setIsSubmitting(true);
      const payload = {...service}

      try {
        const response = id
          ? await axiosClient.put(`/web/services/${id}`, payload)
          : await axiosClient.post('/web/services', payload);
        response
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Your data has been successfully saved!',
        }).then(() => {
          setIsSubmitting(false);
          navigate('/services', { state: 'success' });
        });
      } catch (err) {
        const response = err.response;
        if (response && response.status === 422) {
          setIsSubmitting(false);
          setErrors(response.data.errors);
        }
      }
  }

  const handleChange = (event, newValue) => {
    setService({
      ...service,
      name: newValue.title,
      details: newValue.description,
      image_id: newValue.id,
      image_url: newValue.image_url,
    })
  }

  useEffect(() => {
    if (id) { 
      setService({
        ...service,
        id: props.Data.id,
        name: props.Data.name,
        details: props.Data.details,
        image_id: props.Data.image_id,
        image_url: props.Data.image_url,
      })
    }
  }, [id])

  useEffect(() => {
    getServiceLogo()
    if (props.show == false) {
      setService({
        ...service,
        id: null,
        name: "",
        details: "",
        image_id: "",
        image_url: "",
      })
      setErrors(null)
    }
  },[props.show])

  return (
    <div id="servicesModal">
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
                    <Col xs={12} md={12}>
                    <Autocomplete
                        freeSolo
                        disableClearable
                        onChange={handleChange}
                        options={serviceLogo}  
                        value={service.name}
                        getOptionLabel={(options) => options.title ? options.title.toString() : service.name}
                        renderInput={(params) => (
                            <TextField
                            {...params}
                            label="Name" 
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                            />
                        )}
                        />
                    </Col>
                    <Col xs={12} md={12} className="mt-5">
                        <TextField 
                          type="text" 
                          value={service.details} 
                          id="description" 
                          label="Description" 
                          variant="outlined" 
                          fullWidth
                        />
                    </Col>
                </Col>

                <Col xs={12} md={6}> 
                    <Card raised >
                        <CardMedia 
                          image={service.image_url ? service.image_url : NoImage}
                          component="img"
                          height="250"
                          alt={"alt"}
                          sx={{ padding: "1em 1em 0 1em", objectFit: "contain" }}/>
                    </Card>
            
                </Col>
              </Row>
            </Form.Group>
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
