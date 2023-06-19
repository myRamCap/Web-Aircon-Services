import React from 'react'
import '../../loading.css'

export default function Loading() {
  return (
    <div className="loader">
        <p className="heading">Loading</p>
        <div className="loading">
            <div className="load"></div>
            <div className="load"></div>
            <div className="load"></div>
            <div className="load"></div>
        </div>
    </div>
  )
}
