import React from 'react'
import NotificationsDatatable from '../../components/dataTables/NotificationsDatatable'

export default function Notification() {
  return (
    <div id="notification">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1 className='pb-2'>Notifications</h1>
      </div> 
        <NotificationsDatatable />
    </div>
  )
}
