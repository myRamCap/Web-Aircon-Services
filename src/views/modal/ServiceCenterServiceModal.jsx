import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import React, { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Autocomplete, Card, CardMedia, TextField } from '@mui/material';
import axiosClient from '../../axios-client';
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom';
import NoImage from '../../assets/images/No-Image.png';
import EstimatedTime from '../../data/JSON/refHours.json'

export default function ServiceCenterServiceModal(props) {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState(null)
  const id = props.Data?.id ?? null
  const [services, setServices] = useState([])
  const param = useParams()
  const [service, setService] = useState({
    id: null,
    customer_id: "",
    customer_name: "",
    service_center_id: param.id,
    service_id: null,
    estimated_time: null,
    estimated_time_desc: null,
    name: "",
    details: "",
    image_url: "",
  })

  const optionsEstimatedTime = EstimatedTime.RECORDS.map((option) => {
    const firstLetter = option.details[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  })

  const getService = async () => {
    try {
      const response = await axiosClient.get('/web/services');
      setServices(response.data.data);
    } catch (err) {
      console.error(err);
      // Handle error as needed
    }
  }

  const onSubmit = async (ev) => {
      ev.preventDefault()
      setIsSubmitting(true);
      const payload = {...service}

      try {
        const response = id
          ? await axiosClient.put(`/web/service_center/services/${id}`, payload)
          : await axiosClient.post('/web/service_center/services', payload);
        response
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: id
            ? 'Your data has been successfully updated!'
            : 'Your data has been successfully saved!',
        }).then(() => {
          setIsSubmitting(false);
          navigate(`/servicecenter/details/${param.name}/${param.id}`, { state: 'success' });
        });
      } catch (err) {
        const response = err.response;
        if (response && response.status === 422) {
          setIsSubmitting(false);
          setErrors(response.data.errors);
        }
      }
  }

  const handleChangeService = (event, newValue) => {
    console.log(newValue)
    setService({
      ...service,
      service_id: newValue.id,
      name: newValue.name,
      details: newValue.details,
      image_id: newValue.id,
      image_url: newValue.image_url,
    })
  }

  const handleChangeEstimatedTime = (event, newValue) => {
    setService({
      ...service,
      estimated_time: newValue.time,
      estimated_time_desc: newValue.details,
    })
  }

  useEffect(() => {
    if (id) { 
      setService({
        ...service,
        id: props.Data.id,
        service_id: props.Data.service_id,
        estimated_time: props.Data.estimated_time,
        estimated_time_desc: props.Data.estimated_time_desc,
        name: props.Data.name,
        details: props.Data.details,
        image_url: props.Data.image_url,
      })
    }
  }, [id])

  useEffect(() => {
    getService()
    if (props.show == false) {
      setService({
        ...service,
        id: null,
        service_id: null,
        estimated_time: null,
        estimated_time_desc: "",
        name: "",
        details: "",
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
                        disableClearable
                        onChange={handleChangeService}
                        options={services}  
                        value={service.name}
                        getOptionLabel={(options) => options.name ? options.name.toString() : service.name}
                        isOptionEqualToValue={(option, value) => option.name ?? "" === service.name}
                        renderInput={(params) => (
                            <TextField
                            {...params}
                            label="Service Name" 
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                            />
                        )}
                        />
                    </Col>
                    <Col xs={12} md={12} className="mt-4">
                        <TextField 
                          type="text" 
                          value={service.details} 
                          id="description" 
                          label="Description" 
                          variant="outlined" 
                          fullWidth
                        />
                    </Col>
                    <Col xs={12} md={12} className="mt-4">
                      <Autocomplete
                        disableClearable
                        options={optionsEstimatedTime.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                        onChange={handleChangeEstimatedTime}
                        value={service.estimated_time_desc}
                        getOptionLabel={(options) => options.details ? options.details.toString() : service.estimated_time_desc}  
                        isOptionEqualToValue={(option, value) => option.details ?? "" === service.estimated_time_desc}
                        renderInput={(params) => (
                            <TextField
                            {...params}
                            label="Estimated Time"
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                            />
                        )}
                      />
                    </Col>
                </Col>
                <Col xs={12} md={6}> 
                    <Card raised >
                        <CardMedia src={service.image_url ? service.image_url : NoImage}
                            component="img"
                            height="216"
                            alt={"alt"}
                            title={"titleasdasdsada"}
                            sx={{ padding: "1em 1em 0 1em", objectFit: "contain" }}/>
                    </Card>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Row >
                <Col xs={12} md={12}>
                  <Button 
                    variant="success"  
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Save Changes
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
            </Modal.Body>
        </Modal>
    </div>
  )
}
