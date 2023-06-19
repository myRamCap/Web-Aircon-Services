import React from 'react'
import VehiclesDataTable from '../../components/dataTables/VehiclesDataTable'

export default function Vehicles() {
  return (
    <div id="vehicles">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h1 className='pb-2'>Vehicles</h1>
        </div> 
        <VehiclesDataTable />
    </div>
  )
}
