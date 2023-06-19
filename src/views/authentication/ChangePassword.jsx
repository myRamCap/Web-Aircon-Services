import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Wave from '../../assets/images/wave.png'
import RC from '../../assets/images/Logo-RC.png'
import Avatar from '../../assets/images/avatar.svg'
import axiosClient from '../../axios-client'
import { useStateContext } from '../../contexts/ContextProvider'
 

export default function ChangePassword() {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const emailRef = useRef()
    const passwordRef = useRef()
    const inputEmailRef = useRef()
    const inputPassRef = useRef()
    const {setUser, setToken} = useStateContext()
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

    const onSubmit = (ev) => {
        ev.preventDefault()

        const payload = {
            email: inputEmailRef.current.value,
            password: inputPassRef.current.value
        }

       // console.log(payload)

        axiosClient.post('/login', payload)
            .then(({data}) => {
                navigate('/otp')
                setUser(data.user)
                setToken(data.token)
                setRole(data.role)
            
                
            })
            .catch(err => {
                const response = err.response
                if (response && response.status === 422) {
                  if (response.data.errors) {
                    setErrors(response.data.errors)
                    console.log(response.data.errors)
                  }else {
                    setErrors({
                      email: [response.data.message]
                    })
                    console.log(response.data.message)
                  }
                }
              })
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
                    <h2 className="title">New Password</h2>
                    {errors && <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
          }
                    <div ref={emailRef} className="input-div one ">
                        <div className="i">
                            <i><box-icon name='lock' /></i>
                        </div>
                        <div className="div">
                            <h5>Password</h5>
                            <input ref={inputEmailRef} type="email" className="input" onChange={emailHandleChange} onClick={emailHandleClick}  />
                        </div>
                    </div>
                    <div ref={passwordRef} className="input-div pass">
                        <div className="i">
                            <i><box-icon name='lock' /></i>
                        </div>
                        <div className="div">
                            <h5>Confirm Password</h5>
                            <input ref={inputPassRef} type="password" className="input" onChange={passHandleChange} onClick={passHandleClick} />
                        </div>
                    </div>
                    <input type="submit" className="btn" value="Update Password" />
                    <p className="message">
                        {/* Not Registered? <Link to="/signup">Create an account</Link> */}
                       
                    </p>
                </form>
            </div>
        </div>
    </div>
  )
}
