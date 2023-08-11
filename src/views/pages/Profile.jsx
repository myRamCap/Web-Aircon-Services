import Form from 'react-bootstrap/Form'
import React, { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Card, CardActions, CardContent, CardMedia, TextField, Typography } from '@mui/material';
import NoImage from '../../assets/images/No-Image.png';
import Swal from 'sweetalert2'
import axiosClient from '../../axios-client';
import { useStateContext } from '../../contexts/ContextProvider';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const {user_ID} = useStateContext()
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState(null)
    const [user, setUser] = useState([])
    const [profile, setProfile] = useState({
        id: user_ID,
        old_password: "",
        password: "",
        password_confirmation: "",
        image: "",
        image_url: "",
    })

    const getUser = async () => {
      try {
        const response = await axiosClient.get(`/web/profile/${user_ID}`);
        const { data } = response;
        setUser(data);
        setProfile({
          ...profile,
          image_url: data.image,
        }) 
      } catch (error) {
        // Handle error
      }
    }

    const onImageChoose = (ev) => {
        const file = ev.target.files[0]
        const reader = new FileReader()
        reader.onload = () => {
            setProfile({
            ...profile,
            image: file.name,
            image_url: reader.result,
          }) 
        }
        reader.readAsDataURL(file)
      }

      const onSubmit = async (ev) => {
        ev.preventDefault()
        setErrors(null)
        setIsSubmitting(true);
        const payload = {...profile}

        Swal.fire({
          title: 'Do you want to save the changes?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Save',
          allowOutsideClick: false,
          denyButtonText: `Don't save`,
        }).then(async (result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            try {
              const response =  await axiosClient.put(`/web/profile/${user_ID}`, payload);
              response
              Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Your profile has been successfully saved!',
              }).then(() => {
                setIsSubmitting(false);
                navigate('/profile');
              });
            } catch (err) {
              const response = err.response;
              if (response && response.status === 422) {
                setIsSubmitting(false);
                setErrors(response.data.errors);
              }
            }
          }  else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info')
          }
        })
    }

    useEffect(()=>{
      getUser()
    },[])

  return (
    <div>
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Row>
                <Col xs={12} md={4}>
                    <Card raised sx={{ maxWidth: 550 }}>
                        <CardMedia
                            component="img"
                            height="200"
                            image={profile.image_url ? profile.image_url : NoImage}
                            sx={{ padding: "1em 1em 0 1em", objectFit: "contain" }}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div" align='center'>
                                Profile
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <input 
                                accept=".jpg, .jpeg, .png" 
                                title=" " 
                                className="fileUpload" 
                                name="logo" 
                                id="logo" 
                                type="file" 
                                onChange={onImageChoose} 
                            />
                        </CardActions>
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                {errors && 
              <div className="sevices_logo_errors">
                {Object.keys(errors).map(key => (
                  errors[key].map((message, index) => (
                    <p key={index}>{message}</p>
                  ))
                ))}
              </div>
            }
                    <Col xs={12} md={12} className="mt-3">
                        <TextField 
                          type="password" 
                          onChange={ev => setProfile({...profile, old_password: ev.target.value})} 
                        //   value={service.details} 
                          label="Old Password" 
                          variant="outlined" 
                          fullWidth
                        />
                    </Col>
                    <Col xs={12} md={12} className="mt-3">
                        <TextField 
                          type="password" 
                          onChange={ev => setProfile({...profile, password: ev.target.value})} 
                        //   value={service.details} 
                          label="New Password" 
                          variant="outlined" 
                          fullWidth
                        />
                    </Col>
                    <Col xs={12} md={12} className="mt-3">
                        <TextField 
                          type="password" 
                          onChange={ev => setProfile({...profile, password_confirmation: ev.target.value})} 
                        //   value={service.details} 
                          label="Confirm New Password" 
                          variant="outlined" 
                          fullWidth
                        />
                    </Col>
                    <Col xs={12} md={12} className="mt-3">
                        <Button variant="success"  type="submit"  >Save Changes</Button>
                    </Col>
                </Col>
              </Row>
            </Form.Group>
          </Form>
    </div>
  )
}
