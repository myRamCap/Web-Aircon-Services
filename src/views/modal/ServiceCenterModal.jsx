import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import React, { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Autocomplete, Card, CardMedia, FormControlLabel, IconButton, Radio, RadioGroup, TextField } from '@mui/material';
import Province from '../../data/JSON/refProvince.json'
import City from '../../data/JSON/refCityMun.json'
import Barangay from '../../data/JSON/refBrgy.json'
import MapsModal from './MapsModal';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../../axios-client';
import Swal from 'sweetalert2'
import ImageModal from './ImageModal';
import NoImage from '../../assets/images/No-Image.png';
import { useStateContext } from '../../contexts/ContextProvider';

export default function ServiceCenterModal(props) {
  const {user_ID} = useStateContext()
  const location = useLocation()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [country, setCountry] = useState('Philippines')
  const [municipality, setMunicipality] = useState([])
  const [brgy, setBrgy] = useState([])
  const [valCityMun, setValCityMun] = useState(null);
  const [valBrgy, setValBrgy] = useState(null);
  const longi = localStorage.longi ?? ''
  const lati = localStorage.lati ?? ''
  const id = props.Data?.id ?? null
  const [serviceCenter, setServiceCenter] = useState({
    id: null,
    name: "",
    category: "",
    country: "Philippines",
    house_number: "",
    barangay: "",
    municipality: "",
    province: "",
    longitude: "",
    latitude: "",
    facility: "",
    corporate_manager_id: user_ID,
    municipality_code: "",
    image: "",
  }) 
 
  const handleChangeProvince = (event, newValue) => {
    const filterCity = City.RECORDS.filter((data) => data.provCode === newValue.provCode)
    setMunicipality(filterCity)
    setValCityMun(null);
    setValBrgy(null);
    setServiceCenter({
      ...serviceCenter,
      province: newValue.provDesc,
      municipality: null,
      municipality_code: null,
      barangay: null,
    })
  }
 
  const handleChangeMunicipality = (event, newValue) => {
    console.log(newValue)
    setValCityMun(newValue);
    const filterBrgy = Barangay.RECORDS.filter((data) => data.citymunCode === newValue.citymunCode)
    setBrgy(filterBrgy) 
    setValBrgy(null);
    setServiceCenter({
      ...serviceCenter,
      municipality: newValue.citymunDesc,
      municipality_code: newValue.citymunCode,
      barangay: null,
    })
  }

  const handleChangeBrgy = (event, newValue) => {
    setValBrgy(newValue)
    setServiceCenter({
      ...serviceCenter,
      barangay: newValue.brgyDesc,
    })
  }
 
  const optionsProvince = Province.RECORDS.map((option) => {
    const firstLetter = option.provDesc[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  })

  const optionsCityMun = municipality.map((option) => {
    const firstLetter = option.citymunDesc[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  })

  const optionsBarangay = brgy.map((option) => {
    const firstLetter = option.brgyDesc[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  })

  const onSubmit = async (ev) => {
    ev.preventDefault()
    setIsSubmitting(true);
    const payload = {...serviceCenter}

    try {
      const response = id
        ? await axiosClient.put(`/web/servicecenter/${id}`, payload)
        : await axiosClient.post('/web/servicecenter', payload);
      response 
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: id
          ? 'Your data has been successfully updated!'
          : 'Your data has been successfully saved!',
      }).then(() => {
        setIsSubmitting(false);
        navigate('/servicecenter', { state: 'success' });
      });
    } catch (err) {
      const response = err.response;
      if (response && response.status === 422) {
        setIsSubmitting(false);
        if (response.data.errors['restriction']) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'You reached your limit, Please contact RamCap for support.',
          })
        } else {
          setErrors(response.data.errors);
        }
      }
    }
  }

  const onclickMap = (ev) => {
    setShowModal(true)
  }

  const onclickImage = (ev) => {
    setShowImageModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    // setServicesInfo([])
  }

  const handleImageClose = () => {
    setShowImageModal(false)
  }

  const onRadioChange = (event, newValue) => {
    setServiceCenter({
      ...serviceCenter,
      category: newValue,
    })
  }

  const onImageChoose = (ev) => {
    const file = ev.target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      setServiceCenter({
        ...serviceCenter,
        image: reader.result,
      }) 
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (id) {
      setServiceCenter({
        ...serviceCenter,
        id: props.Data.id,
        name: props.Data.name,
        category: props.Data.category,
        country: props.Data.country,
        house_number: props.Data.house_number,
        barangay: props.Data.barangay,
        municipality: props.Data.municipality,
        province: props.Data.province,
        longitude: props.Data.longitude,
        latitude: props.Data.latitude,
        facility: props.Data.facility,
        image: props.Data.image,
      })
    }
  }, [id])

  useEffect(() => {
    if (props.show == false) {
      setServiceCenter({
        ...serviceCenter,
        id: null,
        name: "",
        category: "",
        country: "Philippines",
        house_number: "",
        barangay: "",
        municipality: "",
        province: "",
        longitude: "",
        latitude: "",
        facility: "",
        municipality_code: "",
        image: "",
      })
      setValBrgy(null);
      setValCityMun(null);
      setErrors(null)
    }
  }, [props.show])

  useEffect(() => {
    if (location.state == 'coordinates'){
      setServiceCenter({
        ...serviceCenter,
        longitude: longi,
        latitude: lati,
      })
      setShowModal(false)
      location.state = null
    }
  },[location.state])

  return (
    <div id="serviceCenterModal">
        <Modal show={props.show} onHide={props.close} backdrop="static" size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{id ? 'Edit Service Center' : 'Add Service Center'}</Modal.Title>
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
                  <RadioGroup
                    row
                    aria-labelledby="demo-form-control-label-placement"
                    name="category"
                    onChange={onRadioChange}
                    value={serviceCenter.category ?? null}
                  >
                    <FormControlLabel value="dealership" control={<Radio />} label="DEALERSHIP"/>
                    <FormControlLabel value="nondealership" control={<Radio />} label="NON-DEALERSHIP"/>
                  </RadioGroup>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Row>
                <Col xs={12} md={6}>
                  <TextField 
                    type="text" 
                    value={serviceCenter.name} 
                    onChange={ev => setServiceCenter({...serviceCenter, name: ev.target.value})} 
                    id="name" 
                    label="Name" 
                    variant="outlined" 
                    fullWidth
                  />
                </Col>

                <Col xs={12} md={6}> 
                  <TextField 
                    type="text" 
                    onChange={ev => setServiceCenter({...serviceCenter, country: ev.target.value})} 
                    id="country" 
                    label="Country"
                    variant="outlined" 
                    value={country} 
                    disabled 
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
                    value={serviceCenter.house_number} 
                    onChange={ev => setServiceCenter({...serviceCenter, house_number: ev.target.value})} 
                    id="street" 
                    label="House Number / Street" 
                    variant="outlined" 
                    fullWidth
                  />
                </Col>
                <Col xs={12} md={6}> 
                  <Autocomplete
                    disableClearable
                    onChange={handleChangeProvince}
                    options={optionsProvince.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                    value={serviceCenter.province ?? ""}
                    getOptionLabel={(options) => options.provDesc ? options.provDesc.toString() : serviceCenter.province}  
                    isOptionEqualToValue={(option, value) => option.provDesc ?? ""  === serviceCenter.province  }
                    renderInput={(params) => (
                        <TextField
                        {...params}
                        label="Province"
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
                    disableClearable
                    onChange={handleChangeMunicipality}
                    options={optionsCityMun.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                    value={serviceCenter.municipality ?? valCityMun  }
                    getOptionLabel={(options) =>  options.citymunDesc ? options.citymunDesc.toString() : serviceCenter.municipality}  
                    isOptionEqualToValue={(option, value) => option.citymunDesc ?? "" === serviceCenter.municipality}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Municipality"
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
                    disableClearable
                    onChange={handleChangeBrgy}
                    options={optionsBarangay.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                    value={serviceCenter.barangay ?? valBrgy}
                    getOptionLabel={(options) => options.brgyDesc ? options.brgyDesc.toString() : serviceCenter.barangay}
                    isOptionEqualToValue={(option, value) => option.brgyDesc ?? "" === serviceCenter.barangay}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Barangay"
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
                    id="longitude" 
                    label="Longitude" 
                    value={serviceCenter.longitude} 
                    variant="outlined" 
                    fullWidth
                  />
                </Col>
                <Col xs={12} md={5}> 
                  <TextField 
                    type="text" 
                    id="latitude" 
                    label="Latitude" 
                    value={serviceCenter.latitude}  
                    variant="outlined" 
                    fullWidth
                  />
                </Col>
                <Col xs={12} md={1} > 
                  {/* <Link to="/data"> */}
                    <IconButton className="globe-icon" onClick={onclickMap}>
                      <box-icon name='globe' className="globe-icon"></box-icon>
                    </IconButton>
                  {/* </Link> */}
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Row>
                <Col xs={12} md={6}>
                  <TextField 
                    type="number" 
                    value={serviceCenter.facility}  
                    onChange={ev => setServiceCenter({...serviceCenter, facility: ev.target.value})}  
                    id="branchManager" 
                    label="Facility" 
                    variant="outlined" 
                    fullWidth
                  />
                </Col>
                <Col xs={12} md={5}> 
                    <input 
                      accept=".jpg, .jpeg, .png" 
                      onChange={onImageChoose} 
                      className="fileUpload" 
                      name="arquivo" 
                      id="arquivo" 
                      type="file" 
                    />
                </Col>
                <Col xs={12} md={1}> 
                    <Card raised className='sc-image' onClick={onclickImage}>
                        <CardMedia 
                          className='sc-image' 
                          src={serviceCenter.image ? serviceCenter.image :  NoImage} 
                          component="img"
                          height="40"
                          alt={"alt"}
                          sx={{  objectFit: "contain" }}
                        />
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

        <MapsModal show={showModal} close={handleClose} id={1} /> 
        <ImageModal show={showImageModal} close={handleImageClose}  image={serviceCenter.image} /> 
    </div>
  )
}
