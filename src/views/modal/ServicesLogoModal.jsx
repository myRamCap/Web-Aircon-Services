import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import React, { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Card, CardMedia, TextField } from '@mui/material';
import NoImage from '../../assets/images/No-Image.png';
import axiosClient from '../../axios-client';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router';

export default function ServicesLogoModal(props) {
  const [errors, setErrors] = useState(null)
  const navigate = useNavigate() 
  const id = props.Data?.id ?? null
  const [servicesLogo, setServicesLogo] = useState({
    id: null,
    title: "",
    description: "",
    image: "",
    image_url: "",
  })

  useEffect(() => {
    if(id) {
      setServicesLogo({
        ...servicesLogo,
        id: props.Data.id,
        title: props.Data.title,
        description: props.Data.description,
        image: props.Data.image,
        image_url: props.Data.image_url,
      })
    }
  }, [id])

 
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
 
  const onSubmit = async (ev) => {
      ev.preventDefault()
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
          navigate('/serviceslogo' , {state:  'success' })
        })
      } catch (err) {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      }
  }

  useEffect(() => {
    if (props.show == false) {
      setServicesLogo({
        ...servicesLogo,
        id: null,
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
                    <TextField type="text" value={servicesLogo.title} onChange={ev => setServicesLogo({...servicesLogo, title: ev.target.value})} id="title" label="Title" variant="outlined" fullWidth/>
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
                  <Button variant="success"  type="submit">Save Changes</Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
            </Modal.Body>
        </Modal>
    </div>
  )
}