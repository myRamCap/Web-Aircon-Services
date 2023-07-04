import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import React, { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Autocomplete,  TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Status from '../../data/JSON/dummy/refStatus.json'
import axiosClient from '../../axios-client';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2'
import dayjs from 'dayjs';

export default function ServiceCenterBookingsModal(props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState(null)
  const [disabledAircon, setDisabledAircon] = useState(true)
  const [disabledTime, setDisabledTime] = useState(true)
  const [services, setServices] = useState([])
  const [timeSlot, setTimeSlot] = useState([])
  const [aircon, setAircon] = useState([])
  const [clients, setClients] = useState([])
  const navigate = useNavigate()
  const param = useParams()
  const id = props.Data?.id ?? null
  const [booking, setBooking] = useState({
    id: null,
    client_id: "",
    client_name: "",
    aircon_id: "",
    aircon_name: "",
    services_id: "",
    service: "",
    estimated_time: "",
    service_center_id: param.id,
    contact_number: null,
    status: "",
    booking_date: null,
    time: "",
    estimated_time_desc: "",
    notes: "",
  })
 
  const getServices = async () => {
    try {
      const response = await axiosClient.get(`/web/service_center/services/${param.id}`);
      setServices(response.data.data);
    } catch (error) {
      // Handle error if needed
    }
  }

  const getClients = async () => {
    try {
      const response = await axiosClient.get('/web/client');
      setClients(response.data.data);
    } catch (error) {
      // Handle error if needed
    }
  }

  const handleChangeCustomer = async (event, newValue) => {
    setDisabledAircon(true)
    setBooking({
      ...booking,
      client_id: newValue.id,
      client_name: newValue.fullname,
      aircon_name: "",
      aircon_id: "",
    })

    try {
      const response = await axiosClient.get(`/web/service_center/aircon/${newValue.id}`);
      setAircon(response.data);
      setDisabledAircon(false);
    } catch (error) {
      // Handle error if needed
    }
  }

  const handleChangeDate = async (date) => {
    setDisabledTime(true)
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const convertedDate = `${year}/${month}/${day}`;
    setBooking({
      ...booking,
      booking_date: convertedDate,
    })

    try {
      const response = await axiosClient.get(`/web/service_center/timeslot/${param.id}/${convertedDate}`);
      setTimeSlot(response.data.data);
      setDisabledTime(false);
    } catch (error) {
      // Handle error if needed
    }

  }

  const handleChangeService = (event, newValue) => {
    setBooking({
      ...booking,
      services_id: newValue.service_id,
      service: newValue.name,
      estimated_time: newValue.estimated_time,
      estimated_time_desc: newValue.estimated_time_desc,
    })
  }
  
  const handleChangeTime = (event, newValue) => {
    setBooking({
      ...booking,
      time: newValue.time,
    })
  }

  const handleChangeAircon = (event, newValue) => {
    console.log(newValue)
    setBooking({
      ...booking,
      aircon_id: newValue.id,
      aircon_name: newValue.aircon_name,
    })
  }

  const handleChangeStatus = (event, newValue) => {
    setBooking({
      ...booking,
      status: newValue.name,
    })
  }

  const optionsCustomer = clients.map((option) => {
    const firstLetter = option.fullname[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  })

  const optionsServices = services.map((option) => {
    const firstLetter = option.name[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  })

  const optionsStatus = Status.RECORDS.map((option) => {
    const firstLetter = option.name[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  })

  const optionsTime = timeSlot.map((option) => {
    const firstLetter = option.time[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  })

  const onSubmit = async (ev) => {
    ev.preventDefault()
    setIsSubmitting(true);
    const payload = { ...booking }

    try {
      const response = id
      ? await axiosClient.put(`/web/service_center/booking/${id}`, payload)
      : await axiosClient.post('/web/service_center/booking', payload);
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

  useEffect(() => {
    if (id) {
      const [year, month, day] =  props.Data.booking_date.split('-')
      const date = `${year}/${month}/${day}` 
      setBooking({
        ...booking,
        id: props.Data.id,
        client_id: props.Data.client_id,
        client_name: props.Data.client_name,
        aircon_id: props.Data.aircon_id,
        aircon_name: props.Data.aircon_name,
        services_id: props.Data.services_id,
        service: props.Data.service,
        estimated_time: props.Data.estimated_time,
        contact_number: props.Data.contact_number,
        status: props.Data.status,
        booking_date: date,
        time: props.Data.time,
        estimated_time_desc: props.Data.estimated_time_desc,
        notes: props.Data.notes,
      })
      setDisabledTime(false)
      setDisabledAircon(false)
    }
  }, [id])

  useEffect(() => {
    getServices()
    getClients()
    if (props.show == false) {
      setBooking({
        ...booking,
        id: null,
        client_id: "",
        client_name: "",
        aircon_id: "",
        aircon_name: "",
        services_id: "",
        service: "",
        estimated_time: "",
        service_center_id: param.id,
        contact_number: null,
        status: "",
        booking_date: null,
        time: "",
        estimated_time_desc: "",
        notes: "",
      })
      setErrors(null)
    }
  },[props.show])
  
  return (
    <div id="servicesModal">
      <Modal show={props.show} onHide={props.close} backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{id ? 'Edit Booking' : 'Add Booking'}</Modal.Title>
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
                    id="customerName"
                    disableClearable
                    options={optionsCustomer.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                    onChange={handleChangeCustomer}
                    value={booking.client_name}
                    getOptionLabel={(options) => options.fullname ? options.fullname.toString() : booking.client_name}
                    isOptionEqualToValue={(option, value) => option.fullname ?? "" === booking.client_name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Client Name"
                        InputProps={{
                          ...params.InputProps,
                          type: 'search',
                        }}
                      />
                    )}
                  />
                </Col>

                <Col xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DatePicker 
                      disablePast
                      value={booking.booking_date ? dayjs(booking.booking_date) : null}
                      className='datePicker' 
                      label="Date"
                      onChange={handleChangeDate}
                    />
                  </LocalizationProvider>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Row>
                <Col xs={12} md={6}>
                  <Autocomplete
                    id="service"
                    disableClearable
                    onChange={handleChangeService}
                    value={booking.service}
                    options={optionsServices.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                    getOptionLabel={(options) => options.name ? options.name+' - '+options.estimated_time_desc : booking.service+' - '+booking.estimated_time_desc}
                    isOptionEqualToValue={(option, value) => option.name ?? "" === booking.service}
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
                <Col xs={12} md={6}>
                  <Autocomplete
                    id="time"
                    disableClearable
                    disabled={disabledTime}
                    onChange={handleChangeTime}
                    value={booking.time}
                    options={optionsTime.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                    getOptionLabel={(options) => options.time ? options.time.toString() : booking.time}
                    isOptionEqualToValue={(option, value) => option.time ?? "" === booking.time}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Time"
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
                  <Autocomplete
                    id="aircon"
                    disableClearable
                    disabled={disabledAircon}
                    value={booking.aircon_name}
                    onChange={handleChangeAircon}
                    options={aircon.data || []}
                    getOptionLabel={(options) => options.aircon_name ? options.aircon_name.toString() : booking.aircon_name} 
                    isOptionEqualToValue={(option, value) => option.aircon_name ?? null === booking.aircon_name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Aircon"
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
                    id="status"
                    disableClearable
                    onChange={handleChangeStatus}
                    options={optionsStatus.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                    value={booking.status}
                    getOptionLabel={(options) => options.name ? options.name.toString() : booking.status}
                    isOptionEqualToValue={(option, value) => option.name ?? "" === booking.status}
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
              <Row>
                <Col xs={12} md={6}>
                  <TextField 
                    value={param.name} 
                    disabled 
                    type="text" 
                    id="service_center" 
                    label="Service Center" 
                    variant="outlined" 
                    fullWidth 
                  />
                </Col>
                <Col xs={12} md={6}>
                  <TextField 
                    type="text" 
                    value={booking.notes} 
                    onChange={ev => setBooking({...booking, notes: ev.target.value})} 
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
                  <Button 
                    variant="success" 
                    type="submit" 
                    disabled={isSubmitting} 
                  >
                    {id ? 'Save Changes' : 'Save'}
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
