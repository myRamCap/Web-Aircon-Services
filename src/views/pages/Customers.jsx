import React from 'react'
import CustomerDataTable from '../../components/dataTables/CustomerDataTable'

export default function Customers() {
  return (
    <div id="customers">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1 className='pb-2'>Customers</h1>
      </div> 
      <CustomerDataTable />
    </div>
  )
}
