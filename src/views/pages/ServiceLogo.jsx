import React from 'react'
import ServiceLogoDataTable from '../../components/dataTables/ServiceLogoDataTable'

export default function ServiceLogo() {
  return (
    <div id="serviceLogo">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1 className='pb-2'>Managed Services</h1>
      </div> 
        <ServiceLogoDataTable />
    </div>
  )
}
