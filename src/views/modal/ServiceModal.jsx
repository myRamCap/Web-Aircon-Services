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
import { useStateContext } from '../../contexts/ContextProvider';

export default function ServicesModal(props) {
  const {user_ID, role} = useStateContext()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState(null)
  const id = props.Data?.id ?? null;
  const [serviceLogo, setServiceLogo] = useState([])
  const [servicecenter, setServiceCenter] = useState([])
  const [service, setService] = useState({
    id: null,
    name: "",
    aircon_type: "",
    details: "",
    service_center_id: "",
    service_center: "",
    image_id: "",
    image_url: "",
    created_by: user_ID,
    updated_by: user_ID,
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
 
  const getServiceCenter = async () => {
    try {
      const response = await axiosClient.get(`/web/servicecenter/${user_ID}`);
      setServiceCenter(response.data.data);
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
      aircon_type: newValue.aircon_type,
      details: newValue.description,
      image_id: newValue.id,
      image_url: newValue.image_url,
    })
  }
  
  const handleChangeSC = (event, newValue) => {
    setService({
      ...service,
      service_center_id: newValue.id,
      service_center: newValue.name
    })
  }

  useEffect(() => {
    if (id) { 
      setService({
        ...service,
        id: props.Data.id,
        name: props.Data.name,
        aircon_type: props.Data.aircon_type,
        details: props.Data.details,
        image_id: props.Data.image_id,
        image_url: props.Data.image_url,
        service_center_id: props.Data.service_center_id,
        service_center: props.Data.service_center,
      })
    }
  }, [id])

  useEffect(() => {
    getServiceLogo()
    getServiceCenter()
    if (props.show == false) {
      setService({
        ...service,
        id: null,
        name: "",
        aircon_type: "",
        details: "",
        image_id: "",
        image_url: "",
        service_center_id: "",
        service_center: "",
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
                        getOptionLabel={(options) => options.title ? options.title + " - " + options.aircon_type : service.name + " - " + service.aircon_type }
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
                    <Col xs={12} md={12} className="mt-3">
                        <TextField 
                          type="text" 
                          value={service.details} 
                          label="Description" 
                          variant="outlined" 
                          fullWidth
                        />
                    </Col>
                    <Col xs={12} md={12} className="mt-3 ">
                      { role == 2 || role == 1 &&
                        <Autocomplete
                          disableClearable
                          value={service.service_center}
                          options={servicecenter}
                          onChange={handleChangeSC}
                          getOptionLabel={(options) => options.name ? options.name.toString() : service.service_center}
                          isOptionEqualToValue={(option, value) => option.name ?? "" === service.service_center}
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
                  <Button variant="success"  type="submit" disabled={isSubmitting}>{id ? 'Save Changes' : 'Save'}</Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
            </Modal.Body>
        </Modal>
    </div>
  )
}
