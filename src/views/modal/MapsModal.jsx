import Modal from 'react-bootstrap/Modal';
import React from 'react'
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

export default function MapsModal(props) {
  const navigate = useNavigate()
  const url = window.location.origin + '/map';

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
            <iframe width="100%" height="100%" src={url} />
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
