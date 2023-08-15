import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import React, { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ACType from '../../data/JSON/refACType.json' 
import ACHP from '../../data/JSON/refHP.json' 
import { Autocomplete, Card, CardMedia, TextField } from '@mui/material';
import NoImage from '../../assets/images/No-Image.png';
import axiosClient from '../../axios-client';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';

export default function AirconListModal(props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate()
  const [errors, setErrors] = useState(null)
  const [clients, setClients] = useState([])
  const id = props.Data?.id ?? null
  const [aircon, setAircon] = useState({
    id: null,
    client_id: "",
    client_mobile_number: "",
    aircon_name: "",
    aircon_type: "",
    make: "",
    model: "",
    horse_power: "",
    serial_number: "",
    image: "",
    notes: "",
  })

  const getClients = async () => {
    try {
      const response = await axiosClient.get('/web/client');
      setClients(response.data.data);
    } catch (err) {
      console.error(err);
      // Handle error as needed
    }
  }

  const optionsCustomer = ACType.RECORDS.map((option) => {
    const firstLetter = option.name[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  })

  const onSubmit = async (ev) => {
      ev.preventDefault()
      setIsSubmitting(true);
      const payload = {...aircon}

      try {
        const response = id
          ? await axiosClient.put(`/web/aircons/${id}`, payload)
          : await axiosClient.post('/web/aircons', payload);
        response
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: id
            ? 'Your data has been successfully updated!'
            : 'Your data has been successfully saved!',
        }).then(() => {
          setIsSubmitting(false);
          navigate('/airconlist', { state: 'success' });
        });
      } catch (err) {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      }
  }

  const handleChangeCustomer = (event, newValue) => { 
    setAircon({
      ...aircon,
      client_id: newValue.id,
      client_mobile_number: newValue.contact_number,
    }) 
  }

  const handleChangeAC = (event, newValue) => { 
    setAircon({
      ...aircon,
      aircon_type: newValue.name,
    }) 
  }

  const handleChangeHP = (event, newValue) => { 
    setAircon({
      ...aircon,
      horse_power: newValue.hp,
    }) 
  }

  const onImageChoose = (ev) => {
    const file = ev.target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      setAircon({
        ...aircon,
        image: reader.result,
      }) 
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (id) {
      setAircon({
        ...aircon,
        id: props.Data.id,
        client_id: props.Data.client_id,
        client_mobile_number: props.Data.client_mobile_number,
        aircon_name: props.Data.aircon_name,
        aircon_type: props.Data.aircon_type,
        // contact_number: props.Data.contact_number,
        make: props.Data.make,
        model: props.Data.model,
        horse_power: props.Data.horse_power,
        serial_number: props.Data.serial_number,
        image: props.Data.image,
        notes: props.Data.notes,
      })
    }
  }, [id])

  useEffect(() => {
    getClients()
    if (props.show == false) {
      setAircon({
        ...aircon,
        id: null,
        client_id: "",
        client_mobile_number: "",
        aircon_name: "",
        aircon_type: "",
        make: "",
        model: "",
        horse_power: "",
        serial_number: "",
        image: "",
        notes: "",
      })
      setErrors(null)
    }
  },[props.show])

  return (
    <div id="AirconModal">
        <Modal show={props.show} onHide={props.close} backdrop="static" size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{id ? 'Edit Aircon' : 'Add Aircon'}</Modal.Title>
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
                    value={ aircon.client_mobile_number}
                    options={clients}
                    onChange={handleChangeCustomer}
                    getOptionLabel={(options) => options.contact_number ? options.contact_number.toString() : aircon.client_mobile_number}
                    isOptionEqualToValue={(option, value) => option.contact_number ?? "" === aircon.client_mobile_number}
                    renderInput={(params) => (
                        <TextField
                        {...params}
                        label="Mobile Number"
                        InputProps={{
                            ...params.InputProps,
                            type: 'search',
                        }}
                        />
                    )}
                    />
                </Col>
                <Col xs={12} md={6}>
                    <TextField 
                      type="text" 
                      value={aircon.aircon_name} 
                      onChange={ev => setAircon({...aircon, aircon_name: ev.target.value})} 
                      id="aircon_name" 
                      label="Aircon Name / Location" 
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
                      value={ aircon.aircon_type}
                      options={optionsCustomer}
                      onChange={handleChangeAC}
                      getOptionLabel={(options) => options.name ? options.name.toString() : aircon.aircon_type}
                      isOptionEqualToValue={(option, value) => option.name ?? "" === aircon.aircon_type}
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
                <Col xs={12} md={6}>
                    <TextField 
                      type="text" 
                      value={aircon.make} 
                      onChange={ev => setAircon({...aircon, make: ev.target.value})} 
                      id="make" 
                      label="Make" 
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
                      value={aircon.model} 
                      onChange={ev => setAircon({...aircon, model: ev.target.value})} 
                      id="model" 
                      label="Model" 
                      variant="outlined" 
                      fullWidth
                    />
                </Col>
                <Col xs={12} md={6}>
                    <Autocomplete
                      disableClearable
                      value={ aircon.horse_power}
                      options={ACHP.RECORDS}
                      onChange={handleChangeHP}
                      getOptionLabel={(options) => options.hp ? options.hp.toString() : aircon.horse_power}
                      isOptionEqualToValue={(option, value) => option.hp ?? "" === aircon.horse_power}
                      renderInput={(params) => (
                          <TextField
                          {...params}
                          label="Horse Power"
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
                      type="text" 
                      value={aircon.serial_number} 
                      onChange={ev => setAircon({...aircon, serial_number: ev.target.value})} 
                      label="Serial Number" 
                      variant="outlined" 
                      fullWidth
                    />
                </Col>
                <Col xs={12} md={6}>
                    <TextField 
                      type="text" 
                      value={aircon.notes} 
                      onChange={ev => setAircon({...aircon, notes: ev.target.value})} 
                      id="notes" 
                      label="Notes" 
                      variant="outlined" 
                      fullWidth
                    />
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Row>
                <Col xs={12} md={6} className="mt-1">
                    <input 
                      accept=".jpg, .jpeg, .png" 
                      className="fileUpload" 
                      name="arquivo" 
                      id="arquivo" 
                      type="file"  
                      onChange={onImageChoose} 
                    />
                </Col>
                <Col xs={12} md={6}> 
                  <Card raised >
                    <CardMedia 
                      src={aircon.image ? aircon.image : NoImage}
                      component="img"
                      height="250"
                      alt={"not found"} 
                      sx={{ padding: "0 1em 0 1em", objectFit: "contain" }}/>
                  </Card>
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Row >
                <Col xs={12} md={6}>
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
