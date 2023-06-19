import React, { useEffect, useState } from 'react';
import MaterialTable from "@material-table/core";
import axiosClient from '../../axios-client';
import Loading from '../loader/Loading';

export default function CustomerDataTable() {
  const paginationAlignment = useState("center")
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState([])

  const columns = [
    { title: 'Name', field: 'fullname' },
    { title: 'Email', field: 'email' },
    { title: 'Contact Number',field: 'contact_number' },
    { title: 'Address',field: 'address' },
  ]

  const getClient = () => {
    setLoading(true)
    axiosClient.get('/web/client')
    .then(({data}) => {
      setClient(data)
      setLoading(false)
    })
  }

  const options = {
    paginationAlignment,
    actionsColumnIndex: -1,
    searchFieldAlignment: "left",
    //selection: true,
    searchFieldStyle: {
      whiteSpace: 'nowrap',
      // width: '60%', 
      fontWeight: 450,
    },
    rowStyle: {
      fontSize: 14,
    },
    headerStyle: {
      whiteSpace: 'nowrap',
      flexDirection: 'row',
      overflow: 'hidden', 
      backgroundColor:'#8d949e',
      color: '#F1F1F1',
      fontSize: 16, 
      marginTop: '10px'
    },
  }

  const components = {
    // define your custom components here
    OverlayLoading: () => <Loading />,
  };
  
  useEffect(() => {
    getClient()
  }, [])

  return (
    <div>
      <MaterialTable 
        title=""
        columns={columns}
        data={client.data}
        isLoading={loading}
        components={components}
        options={options}
      />
    </div>
  )
}
