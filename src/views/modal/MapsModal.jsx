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
  const url = window.location.origin + '/map';
  const googleMapURL = 'http://localhost:3000/map'; // Replace with your Google Maps URL
  const onSubmit = (ev) => {
      ev.preventDefault()
  }
// console.log(url)
  const handleChange = (event, newValue) => {
       setImage(newValue.image);
  }

  const handleSave = () => {
    localStorage.setItem('lati', localStorage.latitude)
    localStorage.setItem('longi', localStorage.longitude)
    navigate('/servicecenter',  {state:  'coordinates' })
  }

  return (
    <div id="" >
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
          {/* <GoogleMaps /> */}
       
            <iframe width="100%" height="100%" src={url} ></iframe>
   
          {/* <div id="iframeContainer" style="width: 100%; height: 100vh;">
            <iframe width="100%" height="100%" frameborder="0" style="border:0" src={googleMapURL} allowfullscreen>
            </iframe>
          </div> */}
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
