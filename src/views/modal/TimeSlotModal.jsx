import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import React, { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Autocomplete, Checkbox, FormControlLabel, TextField } from '@mui/material';
import Timeslot from '../../data/JSON/dummy/refTimeslot.json'
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../axios-client';
import Swal from 'sweetalert2'

export default function TimeSlotModal(props) {
  const navigate = useNavigate()
  const [checkbox1Checked, setCheckbox1Checked] = useState(false);
  const [checkbox2Checked, setCheckbox2Checked] = useState(false);
  const [monday, setMonday] = useState(false);
  const [tuesday, setTuesday] = useState(false);
  const [wednesday, SetWednesday] = useState(false);
  const [thursday, setThursday] = useState(false);
  const [friday, setFriday] = useState(false);
  const [saturday, setSaturday] = useState(false);
  const [sunday, setSunday] = useState(false);
  const param = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const id = props.Data?.id ?? null;
  const [errors, setErrors] = useState(null)
  const [operationTime, setOperationTime] = useState({
    id: null,
    service_center_id: param.id,
    category: "",
    opening_time: "",
    closing_time: "",
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
    sunday: 0,
  })

  const optionsTimeslot = Timeslot.RECORDS.map((option) => {
    const firstLetter = option.time[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  })

  const handleCheckbox1Change = (event) => {
    const checked = event.target.checked;
    setCheckbox1Checked(checked);
    if (checked) {
      setCheckbox2Checked(false);
      setOperationTime({
          ...operationTime,
          category: event.target.value,
          opening_time: "",
          closing_time: "",
      })
    }
  };

  const handleCheckbox2Change = (event) => {
    const checked = event.target.checked;
    setCheckbox2Checked(checked);
    if (checked) {
      setCheckbox1Checked(false);
      setOperationTime({
        ...operationTime,
        category: event.target.value,
      })
    } 
  };

  const handleCheckboxSun = (event) => {
    const checked = event.target.checked;
    setSunday(checked);
    if (checked) {
      setOperationTime({
        ...operationTime,
        sunday: event.target.value,
      })
    } 
  }

  const handleCheckboxMon = (event) => {
    const checked = event.target.checked;
    setMonday(checked);
    if (checked) {
      setOperationTime({
        ...operationTime,
        monday: event.target.value,
      })
    } 
  }

  const handleCheckboxTue = (event) => {
    const checked = event.target.checked;
    setTuesday(checked);
    if (checked) {
      setOperationTime({
        ...operationTime,
        tuesday: event.target.value,
      })
    } 
  }

  const handleCheckboxWed = (event) => {
    const checked = event.target.checked;
    SetWednesday(checked);
    if (checked) {
      setOperationTime({
        ...operationTime,
        wednesday: event.target.value,
      })
    } 
  }

  const handleCheckboxThu = (event) => {
    const checked = event.target.checked;
    setThursday(checked);
    if (checked) {
      setOperationTime({
        ...operationTime,
        thursday: event.target.value,
      })
    } 
  }

  const handleCheckboxFri = (event) => {
    const checked = event.target.checked;
    setFriday(checked);
    if (checked) {
      setOperationTime({
        ...operationTime,
        friday: event.target.value,
      })
    } 
  }

  const handleCheckboxSat = (event) => {
    const checked = event.target.checked;
    setSaturday(checked);
    if (checked) {
      setOperationTime({
        ...operationTime,
        saturday: event.target.value,
      })
    } 
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    setIsSubmitting(true);
    const payload = {...operationTime}
    setErrors(null)

    try {
      const response = id
        ? await axiosClient.put(`/web/service_center/operationtime/${id}`, payload)
        : await axiosClient.post('/web/service_center/operationtime', payload);
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
        if (response.data.errors['restriction']) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "You're Not allowed to create another operation time",
          })
        } else {
          setErrors(response.data.errors);
        }
      }
    }
  }

  const handleChangeOpeningTime = (event, newValue) => {
    setOperationTime({
      ...operationTime,
      opening_time: newValue.time
    })
  }

  const handleChangeCLosingTime = (event, newValue) => {
    setOperationTime({
      ...operationTime,
      closing_time: newValue.time
    })
  }

  useEffect(() => {
    if (id) { 
      setOperationTime({
        ...operationTime,
        id: props.Data.id,
        service_center_id: props.Data.service_center_id,
        category: props.Data.category,
        opening_time: props.Data.opening_time,
        closing_time: props.Data.closing_time,
        monday: props.Data.monday,
        tuesday: props.Data.tuesday,
        wednesday: props.Data.wednesday,
        thursday: props.Data.thursday,
        friday: props.Data.friday,
        saturday: props.Data.saturday,
        sunday: props.Data.sunday,
      })

      if (props.Data.category == "24_hours") {
        setCheckbox1Checked(true)
        setCheckbox2Checked(false)
      }  else if (props.Data.category == "custom_time") {
        setCheckbox2Checked(true)
        setCheckbox1Checked(false)
      }

      if (props.Data.monday == 1) {
        setMonday(true);
      }
      if (props.Data.tuesday == 1) {
        setTuesday(true);
      }
      if (props.Data.wednesday == 1) {
        SetWednesday(true);
      }
      if (props.Data.thursday == 1) {
        setThursday(true);
      }
      if (props.Data.friday == 1) {
        setFriday(true);
      }
      if (props.Data.saturday == 1) {
        setSaturday(true);
      }
      if (props.Data.sunday == 1) {
        setSunday(true);
      }
    }
  }, [id])

  useEffect(() => {
    if (props.show == false) {
      setOperationTime({
        ...operationTime,
        id: null,
        category: "",
        opening_time: "",
        closing_time: "",
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0,
      })
      setErrors(null)
      setCheckbox2Checked(false)
      setCheckbox1Checked(false)
      setMonday(false);
      setTuesday(false);
      SetWednesday(false);
      setThursday(false);
      setFriday(false);
      setSaturday(false);
      setSunday(false);
    }
  },[props.show])

  return (
    <div id="TimeSlotModal">
        <Modal show={props.show} onHide={props.close} backdrop="static" size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{id ? 'Edit Operation Time' : 'Add Operation Time'}</Modal.Title> 
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
                    <FormControlLabel
                      value="24_hours"
                      control={ 
                        <Checkbox
                            checked={checkbox1Checked}
                            onChange={handleCheckbox1Change}
                        />
                      }
                      label="24 Hours"
                    />
                  </Col>
                  <Col xs={12} md={6}>
                    <FormControlLabel
                      value="custom_time"
                      control={
                        <Checkbox
                            checked={checkbox2Checked}
                            onChange={handleCheckbox2Change}
                        />
                      }
                      label="Custom Time"
                    />
                  </Col>
                </Row>
              </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Row>
                <Col xs={12} md={6}>
                  <Autocomplete
                      disabled={!checkbox2Checked}
                      disableClearable
                      options={optionsTimeslot.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                      onChange={handleChangeOpeningTime}
                      value={operationTime.opening_time}
                      getOptionLabel={(options) => options.time ? options.time.toString() : operationTime.opening_time}  
                      isOptionEqualToValue={(option, value) => option.time ?? "" === operationTime.opening_time}
                      renderInput={(params) => (
                          <TextField
                          {...params}
                          disabled={!checkbox2Checked}
                          label="Opening Time"
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
                      disabled={!checkbox2Checked}
                      disableClearable
                      options={optionsTimeslot.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                      onChange={handleChangeCLosingTime}
                      value={operationTime.closing_time}
                      getOptionLabel={(options) => options.time ? options.time.toString() : operationTime.closing_time }  
                      isOptionEqualToValue={(option, value) => option.time ?? "" === operationTime.closing_time }
                      renderInput={(params) => (
                          <TextField
                          {...params}
                          disabled={!checkbox2Checked}
                          label="Closing Time"
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
                <Col xs={12} md={3}>
                  <FormControlLabel
                    value="1"
                    control={ 
                      <Checkbox
                          checked={monday}
                          onChange={handleCheckboxMon}
                      />
                    }
                    label="Monday"
                  />
                </Col>
                <Col xs={12} md={3}>
                  <FormControlLabel
                    value="1"
                    control={ 
                      <Checkbox
                          checked={tuesday}
                          onChange={handleCheckboxTue}
                      />
                    }
                    label="Tuesday"
                  />
                </Col>
                <Col xs={12} md={3}>
                  <FormControlLabel
                    value="1"
                    control={ 
                      <Checkbox
                          checked={wednesday}
                          onChange={handleCheckboxWed}
                      />
                    }
                    label="Wednesday"
                  />
                </Col>
                <Col xs={12} md={3}>
                  <FormControlLabel
                    value="1"
                    control={ 
                      <Checkbox
                          checked={thursday}
                          onChange={handleCheckboxThu}
                      />
                    }
                    label="Thursday"
                  />
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-5" controlId="exampleForm.ControlInput1">
              <Row>
                <Col xs={12} md={3}>
                  <FormControlLabel
                    value="1"
                    control={ 
                      <Checkbox
                          checked={friday}
                          onChange={handleCheckboxFri}
                      />
                    }
                    label="Friday"
                  />
                </Col>
                <Col xs={12} md={3}>
                  <FormControlLabel
                    value="1"
                    control={ 
                      <Checkbox
                          checked={saturday}
                          onChange={handleCheckboxSat}
                      />
                    }
                    label="Saturday"
                  />
                </Col>
                <Col xs={12} md={3}>
                  <FormControlLabel
                      value="1"
                      control={ 
                        <Checkbox
                            checked={sunday}
                            onChange={handleCheckboxSun}
                        />
                      }
                      label="Sunday"
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
