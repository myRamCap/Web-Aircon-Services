import React, { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TextField } from '@mui/material';
import axiosClient from '../../axios-client';
import { useStateContext } from '../../contexts/ContextProvider';
import Swal from 'sweetalert2';

export default function ModalOTP(props) {
  const [errors, setErrors] = useState(null);
  const inputPassRef = useRef();
  const inputConfirmPassRef = useRef();
  const { setUser, setToken, setRole, setUser_ID } = useStateContext();

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const payload = {
      email: props.email,
      password: inputPassRef.current.value,
      password_confirmation: inputConfirmPassRef.current.value
    };
    try {
      const { data } = await axiosClient.post(`/changepwd/${props.id}`, payload);
      Swal.fire({
        icon: 'success',
        title: 'Success',
      }).then(() => {
        setUser(data.user);
        setToken(data.token);
        setRole(data.role);
        setUser_ID(data.user_ID);
      });
    } catch (err) {
      const response = err.response;
      if (response && response.status === 422) {
        setErrors(response.data.errors);
      }
    }
  };

  return (
    <div id="modal">
      <Modal show={props.show} onHide={props.close} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>New Password</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-main">
          {errors && (
            <div className="alert">
              {Object.keys(errors).map((key) => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          )}
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Row>
                <Col xs={12} md={12}>
                  <TextField
                    inputRef={inputPassRef}
                    type="password"
                    label="Password"
                    variant="outlined"
                    fullWidth
                  />
                </Col>
                <Col xs={12} md={12} className="mt-3">
                  <TextField
                    inputRef={inputConfirmPassRef}
                    type="password"
                    label="Confirm Password"
                    variant="outlined"
                    fullWidth
                  />
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Row>
                <Col xs={12} md={12}>
                  <Button variant="success" type="submit">
                    Save Changes
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
