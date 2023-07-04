import React from 'react'
import ServiceCostDataTable from '../../components/dataTables/ServiceCostDataTable'

export default function ServiceCost() {
  return (
    <div id="service_center">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h1 className='pb-2'>Service Cost</h1>
        </div> 
        <ServiceCostDataTable />
    </div>
  )
}
