import React, { useEffect, useState } from 'react'
import GoogleMaps from './GoogleMaps'
import { TextField } from '@mui/material'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function SelectLoc() {
    const [lati, setLati] = useState(localStorage.lati)
    const test = true
    const remove = () => {
        localStorage.removeItem('lati')
    }

    useEffect(() => {
        // setLati(localStorage.lati)
        
    },[])

  return (
 
                <GoogleMaps />

 
        
 
  )
}
