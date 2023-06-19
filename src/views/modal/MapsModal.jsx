import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import React, { useState } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Autocomplete, Box, Card, CardMedia, Input, InputLabel, TextField } from '@mui/material';
import GoogleMaps from '../../components/googleMap/GoogleMaps';
import { useNavigate } from 'react-router-dom';


export default function MapsModal(props) {
  const navigate = useNavigate()
  const [image, setImage] = useState('')
  const onSubmit = (ev) => {
      ev.preventDefault()
  }

  const handleChange = (event, newValue) => {
       setImage(newValue.image);
  }

  const handleSave = () => {
    localStorage.setItem('lati', localStorage.latitude)
    localStorage.setItem('longi', localStorage.longitude)
    navigate('/servicecenter',  {state:  'coordinates' })
  }

  return (
    <div id="">
        <Modal
          show={props.show}
          onHide={props.close}
          fullscreen={true}
        >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Select Location
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <GoogleMaps />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.close} >
            Close
          </Button>
          <Button variant="success" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
