import React from 'react'
import PromotionDataTable from '../../components/dataTables/PromotionDataTable'

export default function Promotion() {
  return (
    <div id="promotion">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1 className='pb-2'>Promotion</h1>
      </div> 
        <PromotionDataTable />
    </div>
  )
}
