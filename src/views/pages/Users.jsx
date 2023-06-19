import React from 'react' 
import UsersDataTable from '../../components/dataTables/UsersDataTable'

export default function Users() {
  return (
    <div id="users">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1 className='pb-2'>Users</h1>
      </div> 
      <UsersDataTable />
    </div>
  )
}
