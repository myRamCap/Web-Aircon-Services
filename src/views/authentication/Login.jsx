import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Wave from '../../assets/images/wave.png'
import RC from '../../assets/images/Logo-RC.png'
import Avatar from '../../assets/images/avatar.svg'
import axiosClient from '../../axios-client' 
import Spinner from '../../components/loader/Spinner'
import Swal from 'sweetalert2'

export default function Login() {
    const [spinner, setSpinner] = useState(false)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const emailRef = useRef()
    const passwordRef = useRef()
    const inputEmailRef = useRef()
    const inputPassRef = useRef()
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

    const passHandleChange = (e) => {
        if (passwordRef == "") {
            passwordRef.current.classList.remove('focus');
        } else {
            passwordRef.current.classList.add('focus');
            setPassword(e.target.value)
        }
    }

    const emailHandleClick = (e) => {
        emailRef.current.classList.add('focus');
        if (password == null || password == "") {
            passwordRef.current.classList.remove('focus');
        }
    }

    const passHandleClick = (e) => {
        passwordRef.current.classList.add('focus');
        if (email == null || email == "") {
            emailRef.current.classList.remove('focus');
        }
    }

    const onSubmit = async (ev) => {
        ev.preventDefault();
        setSpinner(true);
        setErrors(null);
        
        try {
        const payload = {
            email: inputEmailRef.current.value,
            password: inputPassRef.current.value,
        };
    
        const { data } = await axiosClient.post('/login', payload);
        navigate('/otp', { state: { id: data.id, email: data.email } });
        } catch (err) {
        const response = err.response;
        if (response && response.status === 422) {
            if (response.data.errors) {
            setErrors(response.data.errors);
            } else if (response.data.blocked) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Your account has been temporarily locked due to 3 consecutive ${response.data.description} attempts. Please try again in ${response.data.time} minutes or contact your Corporate Manager.`,
            });
            } else {
            setErrors({
                email: [response.data.message],
            });
            }
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
                    <h2 className="title">Welcome</h2>
                    {errors && <div className="alert">
                        {Object.keys(errors).map(key => (
                        <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                    }
                    {spinner && <Spinner/> }
                    <div ref={emailRef} className="input-div one ">
                        <div className="i">
                            <i>
                                <box-icon type='solid' name='user' />
                            </i>
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
                    <div ref={passwordRef} className="input-div pass">
                        <div className="i">
                            <i>
                                <box-icon name='lock' />
                            </i>
                        </div>
                        <div className="div">
                            <h5>Password</h5>
                            <input 
                                ref={inputPassRef} 
                                type="password" 
                                className="input" 
                                onChange={passHandleChange} 
                                onClick={passHandleClick} 
                            />
                        </div>
                    </div>
                    <a href="/forgot_password">Forgot Password?</a>
                    <input type="submit" className="btn" value="Login" />
                    <p className="message">
                    </p>
                </form>
            </div>
        </div>
    </div>
  )
}
