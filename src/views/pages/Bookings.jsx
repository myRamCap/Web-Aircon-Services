import React from 'react'
import BookingDataTable from '../../components/dataTables/BookingDataTable'

export default function Bookings() {
  return (
    <div id="bookings">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h1 className='pb-2'>Bookings</h1>
        </div> 
        <BookingDataTable />
    </div>
  )
}
