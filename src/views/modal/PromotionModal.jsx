import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import React, { useState, useEffect } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Autocomplete, Checkbox, FormControlLabel, Card, CardMedia, TextField } from '@mui/material';
import axiosClient from '../../axios-client';
import Swal from 'sweetalert2'
import NoImage from '../../assets/images/No-Image.png';
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { DateRangePicker } from '@mui/x-date-pickers-pro'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo'
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';

export default function PromotionModal(props) {
    const {user_ID} = useStateContext()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkbox1Checked, setCheckbox1Checked] = useState(false);
    const [checkbox2Checked, setCheckbox2Checked] = useState(false);
    const navigate = useNavigate()
    const id = props.Data?.id ?? null
    const [errors, setErrors] = useState(null);
    const fixedOptions = [];
    const [client, setClient] = useState([])
    const [value, setValue] = useState([...fixedOptions]);
    const [promotion, setPromotion] = useState({
      id: null,
      category: "",
      client: "",
      datefrom: "",
      dateto: "",
      title: "",
      content: "",
      image_url: "",
      user_id: user_ID
    })

    const getClient = async () => {
      try {
        const { data } = await axiosClient.get('/web/client_name')
        setClient(data.data)
      } catch (error) {

      }
    }

    const handleChangeClient = (event, newValue) => {
      setValue([
        ...fixedOptions,
        ...newValue.filter((option) => fixedOptions.indexOf(option) === -1)
      ])
      setPromotion({
        ...promotion,
        client: [
          ...fixedOptions,
          ...newValue.filter((option) => fixedOptions.indexOf(option) === -1)
        ]
      })
    };

    const onImageChoose = (ev) => {
      const file = ev.target.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        setPromotion({
          ...promotion,
          image_url: reader.result,
        }) 
      }
      reader.readAsDataURL(file)
    }

    const handleChangeDateRangePicker = (date) => {
      if (date[1]) {
        const df = new Date(date[0]);
        const dt = new Date(date[1]);
        const dfyear = df.getFullYear();
        const dtyear = dt.getFullYear();
        const dfmonth = ('0' + (df.getMonth() + 1)).slice(-2);
        const dtmonth = ('0' + (dt.getMonth() + 1)).slice(-2);
        const dfday = ('0' + df.getDate()).slice(-2);
        const dtday = ('0' + dt.getDate()).slice(-2);
        const datefrom = `${dfyear}/${dfmonth}/${dfday}`;
        const dateto = `${dtyear}/${dtmonth}/${dtday}`;

        setPromotion({
          ...promotion,
            datefrom: datefrom,
            dateto: dateto,
        })
      }
    };
 
    const handleCheckbox1Change = (event) => {
      const checked = event.target.checked;
      setCheckbox1Checked(checked);
      if (checked) {
        setCheckbox2Checked(false);
        setPromotion({
            ...promotion,
            category: 'ALL',
            client: ""
        })
        setValue([
          ...fixedOptions
        ])
      }
    };

    const handleCheckbox2Change = (event) => {
      const checked = event.target.checked;
      setCheckbox2Checked(checked);
      if (checked) {
        setCheckbox1Checked(false);
        setPromotion({
          ...promotion,
          category: 'SELECTED',
        })
      } 
    };
  
    const onSubmit = async (ev) => {
      ev.preventDefault()
      setIsSubmitting(true);
      const payload = {...promotion}

      try {
        const response = id 
        ? await axiosClient.put(`/web/promotion/${id}`, payload) 
        : await axiosClient.post('/web/promotion', payload);
        response
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: id
            ? 'Your data has been successfully updated!'
            : 'Your data has been successfully saved!',
        }).then(() => {
          setIsSubmitting(false);
          navigate('/promotions', { state: 'success' });
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
        setPromotion({
          ...promotion,
          id: props.Data.id,
          category: props.Data.category,
          client:  props.Data.client,
          datefrom: props.Data.datefrom,
          dateto: props.Data.dateto,
          title: props.Data.title,
          content: props.Data.content,
          image_url: props.Data.image_url,
        })

        if (props.Data.client == null) {
          setValue([
            ...fixedOptions
          ])
        } else {
          setValue(props.Data.client)
        }

        if (props.Data.category == "ALL") {
          setCheckbox1Checked(true)
          setCheckbox2Checked(false)
        } else if (props.Data.category == "SELECTED") {
          setCheckbox2Checked(true)
          setCheckbox1Checked(false)
        }
      }
    }, [id])

    useEffect(() => {
      getClient()
      if (props.show == false) {
          setPromotion({
            ...promotion,
              id: null,
              category: "",
              client: "",
              datefrom: "",
              dateto: "",
              title: "",
              content: "",
              image_url: "",
          })
          setValue([
            ...fixedOptions
          ])
          setErrors(null)
          setCheckbox2Checked(false)
          setCheckbox1Checked(false)
      }
    }, [props.show])


  return (
    <div id="PromotionModal">
      <Modal show={props.show} onHide={props.close} backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{id ? 'Edit Promotion' : 'Add Promotion'}</Modal.Title>
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
                  value="all_customers"
                  control={ 
                    <Checkbox
                        checked={checkbox1Checked}
                        onChange={handleCheckbox1Change}
                    />
                  }
                  label="SELECT ALL CLIENTS"
                />
              </Col>
              <Col xs={12} md={6}>
                <FormControlLabel
                  value="choose_customer"
                  control={
                    <Checkbox
                        checked={checkbox2Checked}
                        onChange={handleCheckbox2Change}
                    />
                  }
                  label="CHOOSE CLIENT"
                />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Row>
            <Col xs={12} md={12}>
                  <Autocomplete
                    disabled={!checkbox2Checked}
                    multiple
                    value={value}
                    onChange={handleChangeClient} 
                    options={client}
                    getOptionLabel={(option) => option.fullname}
                    isOptionEqualToValue={(option, value) => option.fullname === value.fullname}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Client"
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
                            <Col xs={12} md={12}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DateRangePicker', 'DateRangePicker']}>
                                        <DemoItem label="Date Range" component="DateRangePicker">
                                            <DateRangePicker
                                                disablePast
                                                value={ [dayjs(promotion.datefrom), dayjs(promotion.dateto) ] }
                                                onChange={handleChangeDateRangePicker}
                                            />
                                        </DemoItem>
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Col>
                        </Row>
                    </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Row>
              <Col xs={12} md={12}>
                <TextField 
                  type="text" 
                  value={promotion.title ? promotion.title : ""}
                  onChange={ev => setPromotion({...promotion, title: ev.target.value})} 
                  label="Title" 
                  variant="outlined" 
                  fullWidth
                /> 
              </Col>
            </Row>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Row>
              <Col xs={12} md={12}>
                <TextField
                  type= "text"
                  value={promotion.content ? promotion.content : ""}
                  onChange={ev => setPromotion({...promotion, content: ev.target.value})} 
                  label="Content"
                  variant="outlined"
                  multiline
                  rows={4}
                  fullWidth
                />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Row>
                <Col xs={12} md={4} className="mt-2">
                  <input 
                    accept=".jpg, .jpeg, .png" 
                    className="fileUpload" 
                    name="arquivo" 
                    id="arquivo" 
                    type="file" 
                    onChange={onImageChoose} 
                  />
                </Col>
                <Col xs={12} md={8}>
                    <Card raised >
                        <CardMedia 
                            image={promotion.image_url != "" ? promotion.image_url : NoImage}
                            component="img"
                            height="200"
                            alt={"alt"}
                            title={"notification"}
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
