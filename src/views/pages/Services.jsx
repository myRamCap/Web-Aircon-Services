import React from 'react'
import ServicesDataTable from '../../components/dataTables/ServicesDataTable';
 
export default function Workout() {
  // const header = [
  //   {
  //     label: 'ID'
  //   },
  //   {
  //     label: 'NAME'
  //   },
  //   {
  //     label: 'EMAIL'
  //   },
  //   {
  //     label: 'DATE CREATED'
  //   },
  //   {
  //     label: 'ACTIONS'
  //   },
  // ];

  // const data = [
  //   {
  //       id: 1,
  //       name: 'Jhon',
  //       email: 'jhon@ramcap.ph',
  //       age: '11'
  //   },
  //   {
  //       id: 2,
  //       name: 'bentz',
  //       email: 'jhon2@ramcap.ph',
  //       age: '22'
  //   },
  //   {
  //       id: 3,
  //       name: 'burnik',
  //       email: 'jhon3@ramcap.ph',
  //       age: '33'
  //   },
  // ]

  return (
    <div id="services">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1 className='pb-2'>Services</h1>
      </div> 
    <ServicesDataTable />
    </div>
  )
}
