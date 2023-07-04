import React from 'react'
import AirconListDataTable from '../../components/dataTables/AirconListDataTable'

export default function AirconList() {
  return (
    <div id="aircons">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h1 className='pb-2'>Aircon List</h1>
        </div> 
        <AirconListDataTable />
    </div>
  )
}
