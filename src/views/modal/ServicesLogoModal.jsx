import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import React, { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ACType from '../../data/JSON/refACType.json' 
import { Autocomplete, Card, CardMedia, TextField } from '@mui/material';
import NoImage from '../../assets/images/No-Image.png';
import axiosClient from '../../axios-client';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router';
import { useStateContext } from '../../contexts/ContextProvider';

export default function ServicesLogoModal(props) {
  const {user_ID} = useStateContext()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState(null)
  const navigate = useNavigate() 
  const id = props.Data?.id ?? null
  const [servicesLogo, setServicesLogo] = useState({
    id: null,
    aircon_type: "",
    title: "",
    description: "",
    image: "",
    image_url: "",
    created_by: user_ID,
    updated_by: user_ID,
  })

  useEffect(() => {
    if(id) {
      setServicesLogo({
        ...servicesLogo,
        id: props.Data.id,
        aircon_type: props.Data.aircon_type,
        title: props.Data.title,
        description: props.Data.description,
        image: props.Data.image,
        image_url: props.Data.image_url,
      })
    }
  }, [id])

  const optionsACType = ACType.RECORDS.map((option) => {
    const firstLetter = option.name[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  })

  const onImageChoose = (ev) => {
    const file = ev.target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      setServicesLogo({
        ...servicesLogo,
        image: file.name,
        image_url: reader.result,
      }) 
    }
    reader.readAsDataURL(file)
  }

  const handleChangeACType = (event, newValue) => { 
    setServicesLogo({
      ...servicesLogo,
      aircon_type: newValue.name,
    }) 
  }
 
  const onSubmit = async (ev) => {
      ev.preventDefault()
      setErrors(null)
      setIsSubmitting(true);
      const payload = {...servicesLogo}

      try {
        const response = id
          ? await axiosClient.put(`/web/serviceslogo/${id}`, payload)
          : await axiosClient.post(`/web/serviceslogo`, payload);
        response
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: "Your data has been successfully saved!",
        }).then(() => {
          setIsSubmitting(false);
          navigate('/serviceslogo' , {state:  'success' })
        })
      } catch (err) {
        const response = err.response;
        if (response && response.status === 422) {
          setIsSubmitting(false);
          setErrors(response.data.errors);
        }
      }
  }

  useEffect(() => {
    if (props.show == false) {
      setServicesLogo({
        ...servicesLogo,
        id: null,
        aircon_type: "",
        title: "",
        description: "",
        image: "",
        image_url: "",
      })
      setErrors(null)
    }
  },[props.show])

  return (
    <div id="servicesModal">
      
        <Modal show={props.show} onHide={props.close} backdrop="static" size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{id ? 'Edit Service' : 'Add Service'}</Modal.Title>
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
                        value={ servicesLogo.aircon_type}
                        options={optionsACType}
                        onChange={handleChangeACType}
                        getOptionLabel={(options) => options.name ? options.name.toString() : servicesLogo.aircon_type}
                        isOptionEqualToValue={(option, value) => option.name ?? "" === servicesLogo.aircon_type}
                        renderInput={(params) => (
                            <TextField
                            {...params}
                            label="Aircon Type"
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                            />
                        )}
                      />
                    </Col>
                    <Col xs={12} md={12} className='mt-3'>
                      <TextField type="text" value={servicesLogo.title} onChange={ev => setServicesLogo({...servicesLogo, title: ev.target.value})} id="title" label="Service" variant="outlined" fullWidth/>
                    </Col>
                    <Col xs={12} md={12} className='mt-3'>
                      <TextField type="text" value={servicesLogo.description} onChange={ev => setServicesLogo({...servicesLogo, description: ev.target.value})} id="description" label="Description" variant="outlined" fullWidth/>
                    </Col>
                    <Col xs={12} md={12} className="mt-5">
                      <input 
                        accept=".jpg, .jpeg, .png" 
                        title=" " 
                        className="fileUpload" 
                        name="logo" 
                        id="logo" 
                        type="file" 
                        onChange={onImageChoose} 
                      />
                    </Col>
                </Col>
                <Col xs={12} md={6}> 
                  <Card raised >
                    <CardMedia 
                      image={servicesLogo.image_url ? servicesLogo.image_url :  NoImage}
                      component="img"
                      height="250"
                      alt={"not found"} 
                      sx={{ padding: "1em 1em 0 1em", objectFit: "contain" }}/>
                  </Card>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Row >
                <Col xs={12} md={12}>
                  <Button variant="success" disabled={isSubmitting} type="submit">{id ? 'Save Changes' : 'Save'}</Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
            </Modal.Body>
        </Modal>
    </div>
  )
}