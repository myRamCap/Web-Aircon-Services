import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Wave from '../../assets/images/wave.png'
import RC from '../../assets/images/Logo-RC.png'
import Avatar from '../../assets/images/avatar.svg'
import axiosClient from '../../axios-client' 
import Spinner from '../../components/loader/Spinner'
import Swal from 'sweetalert2'

export default function Forgot_password() {
    const [spinner, setSpinner] = useState(false)
    const [email, setEmail] = useState()
    const emailRef = useRef()
    const inputEmailRef = useRef()
    const [errors, setErrors] = useState(null)
    const navigate = useNavigate()

    const emailHandleChange = (e) => {
        if (emailRef == "") {
            emailRef.current.classList.remove('focus');
        } else {
            emailRef.current.classList.add('focus');
            setEmail(e.target.value)
        }
    }

    const emailHandleClick = (e) => {
        emailRef.current.classList.add('focus');
    }

    const onSubmit = async (ev) => {
        ev.preventDefault()
        setSpinner(true)
        setErrors(null)
        
        const payload = {
            email: inputEmailRef.current.value
        }

        try {
            const { data } = await axiosClient.post('/forgot_password', payload);
            navigate('/otp2', { state: { id: data.id, email: data.email } });
        } catch (err) {
            const response = err.response;
            if (response && response.status === 422) {
              setErrors(response.data.errors);
            }
        } finally {
            setSpinner(false);
        }
    }


  return (
    <div id="Login"> 
      <img className="wave" src={Wave}/>
        <div className="container">
            <div className="img">
                <img src={RC} />
            </div>
            <div className="login-content">
                <form onSubmit={onSubmit} >
                    <img src={Avatar} />
                    <h2 className="title">Forgot Password</h2>
                    {errors && <div className="alert">
                        {Object.keys(errors).map(key => (
                        <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                    }
                    {spinner && <Spinner/> }
                    <div ref={emailRef} className="input-div one ">
                        <div className="i">
                            <i><box-icon type='solid' name='user' /></i>
                        </div>
                        <div className="div">
                            <h5>Email</h5>
                            <input 
                                ref={inputEmailRef} 
                                type="email" 
                                className="input" 
                                onChange={emailHandleChange} 
                                onClick={emailHandleClick}  
                            />
                        </div>
                    </div>
                    <input type="submit" className="btn" value="Send Reset Code" />
                    <p className="message">
                    </p>
                </form>
            </div>
        </div>
    </div>
  )
}
