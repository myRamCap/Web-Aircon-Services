import React, { useEffect, useState } from 'react';
import MaterialTable from "@material-table/core";
import EditIcon from '@mui/icons-material/Edit';
import ServiceCenterServiceModal from '../../views/modal/ServiceCenterServiceModal';
import { useLocation, useParams } from 'react-router-dom';
import axiosClient from '../../axios-client';
import Loading from '../loader/Loading';

export default function ServiceCenterServicesDataTable(props) {
  const location = useLocation()
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false)
  const paginationAlignment = useState("center")
  const param = useParams()
  const [serviceCenterServices, setServiceCenterServices] = useState([])
  const [serviceCenterServicesInfo, setServiceCenterServicesInfo] = useState([
    {
      id: null,
      service_center_id: null,
      service_id: null,
      estimated_time: null,
      estimated_time_desc: "",
      name: "",
      details: "",
      image_id: "",
      image_url: "",
    }
  ])

  const getServiceCenterServices = () => {
    setLoading(true)
    axiosClient.get(`/web/service_center/services/${param.id}`)
    .then(({data}) => {
      setServiceCenterServices(data)
      setLoading(false)
    })
  }
 
  const columns = [
    { field: "name", title: "Name" },
    { field: "details", title: "Details" },
    { field: "estimated_time_desc", title: "Estimated Time" },
    { field: "created_at", title: "Date Created" }
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
        setServiceCenterServicesInfo({
          ...serviceCenterServicesInfo,
          id: rowData.id,
          service_center_id: rowData.service_center_id,
          service_id: rowData.service_id,
          estimated_time: rowData.estimated_time,
          estimated_time_desc: rowData.estimated_time_desc,
          name: rowData.name,
          details: rowData.details,
          image_id: rowData.image_id,
          image_url: rowData.image_url,
        })
        setShowModal(true)
      }
    }
  ]

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
    },
  }

  const components = {
    // define your custom components here
    OverlayLoading: () => <Loading />,
  };

  const handleClose = () => {
    setShowModal(false)
    setServiceCenterServicesInfo([])
  }

  useEffect(() => {
    getServiceCenterServices()
    if (location.state == 'success'){
      getServiceCenterServices()
      setShowModal(false)
      setServiceCenterServicesInfo([])
      location.state = null
    }
  }, [location.state])

  return (
    <div>
        <MaterialTable
        title=""
        columns={columns}
        data={serviceCenterServices.data}
        actions={action}
        options={options}
        isLoading={loading}
        components={components}
      />
      <ServiceCenterServiceModal show={showModal} close={handleClose} Data={serviceCenterServicesInfo} /> 
    </div>
  )
}
