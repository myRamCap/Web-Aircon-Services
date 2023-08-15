import React from 'react'
import ServicesDataTable from '../../components/dataTables/ServicesDataTable';
 
export default function Workout() {
  return (
    <div id="services">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1 className='pb-2'>Services</h1>
      </div> 
    <ServicesDataTable />
    </div>
  )
}
