import React, { useEffect, useState } from 'react';
import MaterialTable from "@material-table/core";
import axiosClient from '../../axios-client';
import Loading from '../loader/Loading';
import ClientModal from '../../views/modal/ClientModal';
import { Edit } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';
import { Checkbox } from '@mui/material';

export default function CustomerDataTable() {
  const {role} = useStateContext()
  const location = useLocation()
  const [showModal, setShowModal] = useState(false)
  const paginationAlignment = useState("center")
  const [loading, setLoading] = useState(true);
  const action = [];
  const [client, setClient] = useState([])
  const [clientInfo, setClientInfo] = useState([
    {
        id: null,
        name: "",
        email: "",
        contact_number: "",
        address: "",
        active: "",
    }
])

  const columns = [
    { title: 'Name', field: 'fullname' },
    { title: 'Email', field: 'email' },
    { title: 'Contact Number',field: 'contact_number' },
    { title: 'Address',field: 'address' },
    { 
      field: "active",  // New column for the checkbox
      title: "Active",
      render: (rowData) => (
        <Checkbox
          checked={rowData.active == 1}  // Check if `monday` is equal to 1
          disabled
        />
      ),
    },
    { title: 'Update By',field: 'updated_by' },
    { title: 'Update At',field: 'updated_at' },
  ]

  const getClient = () => {
    setLoading(true)
    axiosClient.get('/web/client')
    .then(({data}) => {
      setClient(data)
      setLoading(false)
    })
  }

  if (role == 1) {
    action.push({
      icon: () => <div className="btn btn-success btn-sm"><Edit /></div>,
      tooltip: 'Edit',
      onClick: (event, rowData) => {
        setClientInfo({
          ...clientInfo,
          id: rowData.id,
          name: rowData.fullname,
          email: rowData.email,
          contact_number: rowData.contact_number,
          address: rowData.address,
          active: rowData.active,
        });
        setShowModal(true);
      },
    });
  }

  const options = {
    paging:true,
    pageSize:10,
    emptyRowsWhenPaging: false,
    pageSizeOptions:[10,20],
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
    }, 
  }

  const components = {
    // define your custom components here
    OverlayLoading: () => <Loading />,
  };

  const handleModalClose = () => {
    setShowModal(false)
    setClientInfo([])
  }
  
  useEffect(() => {
    getClient()
    if (location.state == 'success'){
      setClientInfo([])
        getClient()
        setShowModal(false)
        location.state = null
    }
}, [location.state])

  return (
    <div>
      <MaterialTable 
        title=""
        columns={columns}
        data={client.data}
        actions={action}
        isLoading={loading}
        components={components}
        options={options}
      />
      <ClientModal show={showModal} close={handleModalClose} Data={clientInfo} />
    </div>
  )
}
