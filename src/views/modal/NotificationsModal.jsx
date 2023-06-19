import { Autocomplete, Card, CardMedia, Checkbox, FormControlLabel, TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { DateRangePicker } from '@mui/x-date-pickers-pro'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo'
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, FormLabel, Modal, Row } from 'react-bootstrap'
import NoImage from '../../assets/images/No-Image.png';
import axiosClient from '../../axios-client'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { useStateContext } from '../../contexts/ContextProvider'

export default function NotificationsModal(props) {
    const {user_ID, role} = useStateContext()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkbox1Checked, setCheckbox1Checked] = useState(false);
    const [checkbox2Checked, setCheckbox2Checked] = useState(false);
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate()
    const id = props.Data?.id ?? null
    const fixedOptions = [];
    const [corporate, setCorporate] = useState([])
    const [serviceCenter, setServiceCenter] = useState([])
    const [value, setValue] = useState([...fixedOptions]);
    const [notification, setNotification] = useState({
        id: null,
        category: "",
        // corporate_id: "",
        // first_name: "",
        // last_name: "",
        // service_center_id: "",
        service_center: "",
        datefrom: "",
        dateto: "",
        title: "",
        content: "",
        image_url: "",
        user_id: user_ID
    })

    const handleCheckbox1Change = (event) => {
        const checked = event.target.checked;
        setCheckbox1Checked(checked);
        if (checked) {
            setCheckbox2Checked(false);
            setNotification({
                ...notification,
                category: 'ALL',
                // service_center_id: null,
                service_center: null,
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
            setNotification({
                ...notification,
                category: 'SELECTED',
                // corporate_id: null,
                // corporate_name: null,
            })
        } 
    };

    const getCorporate = async () => {
        try {
            const { data } = await axiosClient.get('/web/corporate_account')
            setCorporate(data)
        } catch (error) {

        }
    };

    const getServiceCenter = async () => {
        try {
            // const { data } = await axiosClient.get(`/web/servicecenter/${user_ID}`)
            const { data } = await axiosClient.get(`/web/service_center_name/${user_ID}`)
            setServiceCenter(data.data)
        } catch (error) {

        }
    };

    // const optionsCorporateAccount = corporate.map((option) => {
    //     const firstLetter = option.first_name[0].toUpperCase();
    //     return {
    //         firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
    //         ...option,
    //     };
    // });

    // const optionsSC = serviceCenter.map((option) => {
    //     const firstLetter = option.name[0].toUpperCase();
    //     return {
    //         firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
    //         ...option,
    //     };
    // });

    // const handleChangeCorporate = (event, newValue) => {
    //     setNotification({
    //         ...notification,
    //         corporate_id: newValue.id,
    //         corporate_name: newValue.first_name+' '+newValue.last_name,
    //     })
    // };

    const handleChangeServiceCenter = (event, newValue) => {
        // setValue([
        //     ...fixedOptions,
        //     ...newValue.filter((option) => fixedOptions.indexOf(option) === -1)
        // ])
        // setNotification({
        //     ...notification,
        //     service_center_id: newValue.id,
        //     service_center: newValue.name,
        // })
console.log(newValue)
        setValue([
            ...fixedOptions,
            ...newValue.filter((option) => fixedOptions.indexOf(option) === -1)
        ])
        setNotification({
        ...notification,
        service_center: [
            ...fixedOptions,
            ...newValue.filter((option) => fixedOptions.indexOf(option) === -1)
        ]
        })
    };

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

            setNotification({
                ...notification,
                datefrom: datefrom,
                dateto: dateto,
            })
        }
    };

    const onImageChoose = (ev) => {
        const file = ev.target.files[0]
        const reader = new FileReader()
        reader.onload = () => {
          setNotification({
            ...notification,
            image_url: reader.result,
          }) 
        }
        reader.readAsDataURL(file)
    }

    const onSubmit = async (ev) => {
        ev.preventDefault()
        setIsSubmitting(true);
        const payload = {...notification}

        try {
            const response = id 
            ? await axiosClient.put(`/web/notification/${id}`, payload) 
            : await axiosClient.post('/web/notification', payload);
            response
            Swal.fire({
            icon: 'success',
            title: 'Success',
            text: id
                ? 'Your data has been successfully updated!'
                : 'Your data has been successfully saved!',
            }).then(() => {
                setIsSubmitting(false);
                navigate('/notifications', { state: 'success' });
            });
        } catch (err) {
            const response = err.response;
            if (response && response.status === 422) {
                setIsSubmitting(false);
                setErrors(response.data.errors);
            }
        }
    };

    useEffect(() => {
        if (id) {
            setNotification({
                ...notification,
                id: props.Data.id,
                // corporate_id: props.Data.corporate_id,
                // first_name: props.Data.first_name,
                // last_name: props.Data.last_name,
                // service_center_id: props.Data.service_center_id,
                category: props.Data.category,
                service_center: props.Data.service_center,
                datefrom: props.Data.datefrom,
                dateto: props.Data.dateto,
                title: props.Data.title,
                content: props.Data.content,
                image_url: props.Data.image_url,
            })

            if (props.Data.service_center == null) {
                setValue([
                    ...fixedOptions
                ])
            } else {
                setValue(props.Data.service_center)
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
        getCorporate()
        getServiceCenter()
        if (props.show == false) {
            setNotification({
                ...notification,
                id: null,
                // corporate_id: null,
                // first_name: null,
                // last_name: null,
                // service_center: null,
                service_center: null,
                datefrom: null,
                dateto: null,
                title: null,
                content: null,
                image_url: null,
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
        <div id='NotificationModal'>
            <Modal show={props.show} onHide={props.close} backdrop="static" size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{id ? 'Edit Notification' : 'Add Notification'}</Modal.Title>
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
                               
                                    control={
                                        <Checkbox
                                            checked={checkbox1Checked}
                                            onChange={handleCheckbox1Change}
                                        />
                                    }
                                    label="ALL SERVICE CENTER"
                                    disabled={role == 2 ? false : true}
                                />
                            </Col>
                            <Col xs={12} md={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={checkbox2Checked}
                                            onChange={handleCheckbox2Change}
                                        />
                                    }
                                    label="CHOOSE SERVICE CENTER"
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Row>
                            {/* <Col xs={12} md={6}>
                                <Autocomplete
                                    disableClearable
                                    id="corporate-account-autocomplete"
                                    value={notification.first_name ?? null}
                                    onChange={handleChangeCorporate}
                                    options={optionsCorporateAccount}
                                    disabled={!checkbox1Checked}
                                    getOptionLabel={(options) => options.first_name ? options?.first_name  : notification.first_name }
                                    isOptionEqualToValue={(option, value) => option.first_name ?? "" === notification.first_name }
                                    renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Corporate Account"
                                        InputProps={{
                                        ...params.InputProps,
                                        type: 'search',
                                        }}
                                    />
                                    )}
                                />
                            </Col> */}
                            <Col xs={12} md={12}>
                                {/* <Autocomplete
                                    multiple
                                    disableClearable
                                    id="service-center-autocomplete"
                                    onChange={handleChangeServiceCenter}
                                    value={notification.service_center ?? null}
                                    options={optionsSC}
                                    // disabled={!checkbox2Checked}
                                    getOptionLabel={(option) => option.name}
                                    isOptionEqualToValue={(option, value) => option.name === value.name}
                                    // getOptionLabel={(option) => option.name ? option.name : notification.service_center}
                                    // isOptionEqualToValue={(option, value) => option.name ?? "" === notification.service_center}
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
                                /> */}
                                <Autocomplete
                                    disabled={!checkbox2Checked}
                                    multiple
                                    value={value}
                                    onChange={handleChangeServiceCenter} 
                                    options={serviceCenter}
                                    getOptionLabel={(option) => option.name}
                                    isOptionEqualToValue={(option, value) => option.name === value.name}
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
                                                value={ [dayjs(notification.datefrom), dayjs(notification.dateto) ] }
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
                                    value={notification.title ? notification.title : ""}
                                    onChange={ev => setNotification({...notification, title: ev.target.value})}
                                    id="title"
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
                                    type="text"
                                    value={notification.content ? notification.content : ""}
                                    onChange={ev => setNotification({...notification, content: ev.target.value})}
                                    id="content"
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
                            <Col xs={12} md={6} className="mt-2">
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
                                    image={notification.image_url != "" ? notification.image_url : NoImage}
                                    component="img"
                                    height="200"
                                    sx={{objectFit: "contain" }}
                                />
                            </Card>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Row >
                            <Col xs={12} md={12}>
                                <Button variant="success" type="submit" disabled={isSubmitting} >Save Changes</Button>
                            </Col>
                        </Row>
                    </Form.Group>
                </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}
