import React from 'react'
import ServiceCenterDataTable from '../../components/dataTables/ServiceCenterDataTable'

export default function ServiceCenter() {
  return (
    <div id="service_center">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h1 className='pb-2'>Service Center</h1>
        </div> 
        <ServiceCenterDataTable />
    </div>
  )
}
