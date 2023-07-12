import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import React, { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Autocomplete, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Status from '../../data/JSON/dummy/refStatus.json'
import axiosClient from '../../axios-client';
import dayjs from 'dayjs';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';

export default function Booking(props) {
  const {user_ID} = useStateContext()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState(null)
  const [disabledAircon, setDisabledAircon] = useState(true)
  const [disabledTime, setDisabledTime] = useState(true)
  const id = props.Data?.id ?? null
  const navigate = useNavigate()
  const [operation, setOperation] = useState([])
  const [services, setServices] = useState([])
  const [timeSlot, setTimeSlot] = useState([])
  const [aircon, setAircon] = useState([])
  const [clients, setClients] = useState([])
  const [booking, setBooking] = useState({
    id: null,
    client_id: "",
    contact_number: "",
    aircon_id: "",
    aircon_name: "",
    services_id: "",
    service: "",
    estimated_time: "",
    service_center_id: "",
    service_center: "",
    // contact_number: null,
    status: "",
    booking_date: null,
    time: "",
    estimated_time_desc: "",
    notes: "",
    updated_by: user_ID,
  })
 
  const getClients = async () => {
    try {
      const response = await axiosClient.get('/web/client');
      const { data } = response.data;
      setClients(data);
    } catch (error) {
      // Handle error
    }
  }

  const getOperation = async () => {
    try {
      const response = await axiosClient.get(`/web/service_center/operation/${user_ID}`);
      const { data } = response;
      setOperation(data);
    } catch (error) {
      // Handle error
    }
  }

  

  const getServices = async () => {
    try {
 
      const response = await axiosClient.get(`/web/bookings/service_center/services/${props.userID}`);
      const { data } = response.data;
      setServices(data);
    } catch (error) {
      // Handle error
    }
  }

  const service_center = async () => {
    try {
 
      if (!id) { 
     
        const { data } = await axiosClient.get(`/web/bookings/service_center/${props.userID}`);
        const { id, name } = data.data[0];
        setBooking({ 
          ...booking, 
          service_center_id: id, 
          service_center: name 
        });
      }
    } catch (error) {
      // Handle error 
    }
  }

  const handleChangeClient = async (event, newValue) => {
    setDisabledAircon(true)
    setAircon([])
    setBooking({
      ...booking,
      client_id: newValue.id,
      contact_number: newValue.contact_number,
      aircon_name: "",
      aircon_id: "",
    })

    try {
      const {data} = await axiosClient.get(`/web/service_center/aircon/${newValue.id}`)
      setAircon(data)
      setDisabledAircon(false)
    } catch (error) {

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
        const { data } = await axiosClient.get(`/web/bookings/${props.userID}/${convertedDate}`);
        setTimeSlot(data.data);
        setDisabledTime(false)
    } catch (error) {
      // Handle error here
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

  const optionsClient = clients.map((option) => {
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
    setErrors(null)
    setIsSubmitting(true);
    const payload = { ...booking }

    try {
      const response = id
      ? await axiosClient.put(`/web/bookings/${id}`, payload)
      : await axiosClient.post('/web/bookings', payload);
      response
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: id
          ? 'Your data has been successfully updated!'
          : 'Your data has been successfully saved!',
      }).then(() => {
        setIsSubmitting(false);
        navigate('/bookings', { state: 'success' });
      });
      
    } catch (error) {
      const response = error.response;
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
      const { data } = axiosClient.get(`/web/bookings/${user_ID}/${date}`);
      
      // setTimeSlot(data.data); 
      axiosClient.get(`/web/bookings/${user_ID}/${date}`)
      .then(({data}) => {
        setTimeSlot(data.data); 
      })
      
      setBooking({
        ...booking,
        id: props.Data.id,
        client_id: props.Data.client_id,
        contact_number: props.Data.contact_number,
        aircon_id: props.Data.aircon_id,
        aircon_name: props.Data.aircon_name,
        services_id: props.Data.services_id,
        service: props.Data.service,
        service_center_id: props.Data.service_center_id,
        service_center: props.Data.service_center,
        estimated_time: props.Data.estimated_time,
        // contact_number: props.Data.contact_number,
        status: props.Data.status,
        booking_date: date,
        time: props.Data.time,
        estimated_time_desc: props.Data.estimated_time_desc,
        notes: props.Data.notes,
        updated_by: user_ID,
      })
      setDisabledTime(false)
      setDisabledAircon(false)
    } 

  }, [id])

  useEffect(() => {
    if (props.show == true) {
      getServices()
      service_center()
      getClients()
      getOperation()
    } else if (props.show == false) {
 

      setBooking({
        ...booking,
        id: null,
        client_id: "",
        contact_number: "",
        aircon_id: "",
        aircon_name: "",
        services_id: "",
        service: "",
        estimated_time: "",
        service_center_id: "",
        service_center: "",
        // contact_number: null,
        status: "",
        booking_date: null,
        time: "",
        estimated_time_desc: "",
        notes: "",
        updated_by: "",
      })
      setErrors(null)
    } 
  },[props.show])

  
  const isWeekend = (date) => {
    const day = new Date(date).getDay();
    const daysOff = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return operation[daysOff[day]] === 0;
  };

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
                    options={optionsClient.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                    onChange={handleChangeClient}
                    value={booking.contact_number}
                    getOptionLabel={(options) => options.contact_number ? options.contact_number.toString() : booking.contact_number}
                    isOptionEqualToValue={(option, value) => option.contact_number ?? "" === booking.contact_number}
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
                  <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DatePicker 
                      disablePast
                      value={booking.booking_date ? dayjs(booking.booking_date) : null}
                      className='datePicker' 
                      label="Date"
                      onChange={handleChangeDate}
                      shouldDisableDate={isWeekend} 
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
                    value={booking.service_center} 
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
