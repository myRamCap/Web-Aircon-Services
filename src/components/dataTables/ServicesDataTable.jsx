import React, { useEffect, useState } from 'react';
import MaterialTable from "@material-table/core";
import EditIcon from '@mui/icons-material/Edit';
import ServicesModal from '../../views/modal/ServiceModal';
import axiosClient from '../../axios-client';
import { useLocation } from 'react-router-dom';
import Loading from '../loader/Loading';
import { useStateContext } from '../../contexts/ContextProvider';

export default function ServicesDataTable() {
  const {user_ID} = useStateContext()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const paginationAlignment = useState("center")
  const [services, setServices] = useState([])
  const [servicesInfo, setServicesInfo] = useState([
    {
      id: "",
      name: "",
      details: "",
      image_id: "",
      image_url: "",
      service_center_id: "",
      service_center: ""
    }
  ])

  const getServices = () => {
    setLoading(true)
    axiosClient.get(`/web/services/${user_ID}`)
      .then(({data}) => {
        setServices(data)
        setLoading(false)
      })
  }
  
  const columns = [
    { field: "id", title: "ID", hidden: true, },
    { field: "image", title: "Image", width: 100, sorting: false, render: (rowData) => {
        const styles = { width: 50 };
        return <img src={rowData.image_url} style={styles} />;
      },
    },
    { field: "name", title: "Services", customSort: (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })},
    { field: "aircon_type", title: "Aircon Type", customSort: (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })},
    { field: "service_center", title: "Service Center", customSort: (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })},
    { field: "details", title: "Details", customSort: (a, b) => a.details.localeCompare(b.details, undefined, { sensitivity: 'base' }) },
    { field: "created_by", title: "Created By", customSort: (a, b) => a.details.localeCompare(b.details, undefined, { sensitivity: 'base' }) },
    { field: "updated_by", title: "Updated By", customSort: (a, b) => a.details.localeCompare(b.details, undefined, { sensitivity: 'base' }) },
    { field: "created_at", title: "Date Created", customSort: (a, b) => a.created_at.localeCompare(b.created_at, undefined, { sensitivity: 'base' }) }
   ];

   const action = [
    {
      icon: () => <div className="btn btn-primary">Add New</div> ,
      isFreeAction: true,
      onClick: (event) => setShowModal(true)
    },
    {
      icon: () => <div className="btn btn-success btn-sm"><EditIcon  /></div> ,
      tooltip: 'Edit',
      onClick: (event,rowData) => {
        setServicesInfo({
          ...servicesInfo,
          id: rowData.id,
          name: rowData.name,
          details: rowData.details,
          image_id: rowData.image_id,
          image_url: rowData.image_url,
          service_center_id: rowData.service_center_id,
          service_center: rowData.service_center,
        })
        setShowModal(true)
      }
    }
  ]

  const options = {
    paging:true,
    pageSize:5,
    emptyRowsWhenPaging: false,
    pageSizeOptions:[5,10],
    // loadingType: "overlay",
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
    // OverlayLoading: () => <Loading />,
  };

  useEffect(() => {
    getServices()
    if (location.state){
      getServices()
      setShowModal(false)
      setServicesInfo([])
      location.state = null
    }
  }, [location.state])

  const handleClose = () => {
    setShowModal(false)
    setServicesInfo([])
  }
  
  return (
    <div>
 
        <MaterialTable
          title=""
          columns={columns}
          data={services.data}
          actions={action}
          options={options} 
          isLoading={loading}
          components={components}
        />
     
      <ServicesModal show={showModal} close={handleClose} Data={servicesInfo} /> 
    </div>
  )
}
