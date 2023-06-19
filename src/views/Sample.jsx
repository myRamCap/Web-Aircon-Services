import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import axiosClient from '../axios-client'

export default function Sample() {
    const [client, setClient] = useState({
      id: null,
      first_name: "jhon",
      last_name: "ray",
      email: "jhonray@gmail.com",
      contact_number: "+639076764131",
      address: "asdf",
    })

    const [token, setToken] = useState({
      contact_number: "+639076764131",
      token: "430744",
    })

    const [login, setLogin] = useState({
      contact_number: "+6390767641131",
    })

    const onSubmit = (ev) => {
        ev.preventDefault()
        const payload = {...client}
        axiosClient.post('/client_register', payload)
        .then(({data}) =>{
            console.log(data)
        })
        .catch(err => {
            const response = err.response
            if (response && response.status === 422) {
              console.log(response.status.errors)
            }
          }) 
    }

    const onVerify = (ev) => {
        ev.preventDefault()
        const payload = {...token}
        axiosClient.post('/client_verify', payload)
        .then(({data}) =>{
            console.log(data)
        })
        .catch(err => {
            const response = err.response
            if (response && response.status === 422) {
              console.log(response.status.errors)
            }
          }) 
    }

    const onLogin = (ev) => {
      ev.preventDefault()
      const payload = {...login}
      axiosClient.post('/client_login', payload)
      .then(({data}) =>{
          console.log(data)
      })
      .catch(err => {
          const response = err.response
          if (response && response.status === 422) {
            console.log(response.status.errors)
          }
        }) 
  }


  return (
    <div>
        <Button onClick={onSubmit} variant="success" type="submit">Register</Button><br/>
        <Button onClick={onVerify} variant="success" type="submit"  className='mt-3' >Verify</Button><br/>
        <Button onClick={onLogin} variant="success" type="submit"  className='mt-3' >Login</Button>
    </div>
  )
}
