import Modal from 'react-bootstrap/Modal';
import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import { CardMedia } from '@mui/material';

export default function ImageModal(props) {
 
  return (
    <div id="image_modal">
        <Modal
          show={props.show}
          onHide={props.close}
          fullscreen={true}
        >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Image View
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CardMedia 
            className='sc-image' 
            image={ props.image }
            component="img"
            height="550"
            alt={"alt"}
            sx={{    objectFit: "contain" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.close} >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
