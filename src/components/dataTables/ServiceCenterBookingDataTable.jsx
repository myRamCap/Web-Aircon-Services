import React, { useEffect, useState } from 'react';
import MaterialTable from "@material-table/core";
import EditIcon from '@mui/icons-material/Edit';
import BookingsModal from '../../views/modal/ServiceCenterBookingsModal';
import axiosClient from '../../axios-client';
import ServiceCenterBookingsModal from '../../views/modal/ServiceCenterBookingsModal';
import Loading from '../loader/Loading';
import { useLocation, useParams } from 'react-router-dom';

export default function ServiceCenterBookingDataTable() {
  const location = useLocation()
  const param = useParams()
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false)
  const paginationAlignment = useState("center")
  const [serviceCenterBooking, setServiceCenterBooking] = useState([])
  const [serviceCenterBookingInfo, setServiceCenterBookingInfo] = useState([
    {
      id: null,
      client_id: "",
      client_name: "",
      vehicle_id: "",
      vehicle_name: "",
      services_id: "",
      service: "",
      estimated_time: "",
      contact_number: null,
      status: "",
      booking_date: "",
      time: "",
      estimated_time_desc: "",
      notes: "",
    }
  ])

  const getBooking = () => {
    setLoading(true)
    axiosClient.get(`/web/service_center/booking/${param.id}`)
    .then(({data}) => {
      setServiceCenterBooking(data)
      setLoading(false)
    })
  }

  const columns = [ 
    { field: "client_name", title: "Client Name" },
    { field: "service", title: "Service" },
    { field: "service_center", title: "Service Center" },
    { field: "contact_number", title: "Contact Number" },
    { field: "status", title: "Status" },
    { field: "booking_date", title: "Booking Date" },
    { field: "created_at", title: "Date Created" },

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
        setServiceCenterBookingInfo({
          ...serviceCenterBookingInfo,
          id: rowData.id,
          client_id: rowData.client_id,
          client_name: rowData.client_name,
          vehicle_id: rowData.vehicle_id,
          vehicle_name: rowData.vehicle_name,
          services_id: rowData.services_id,
          service: rowData.service,
          estimated_time: rowData.estimated_time,
          contact_number: rowData.contact_number,
          status: rowData.status,
          booking_date: rowData.booking_date,
          time: rowData.time,
          estimated_time_desc: rowData.estimated_time_desc,
          notes: rowData.notes,
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
    setServiceCenterBookingInfo([])
  }

  useEffect(() => {
    getBooking()
    if (location.state == 'success'){
      getBooking()
      setServiceCenterBookingInfo([])
      setShowModal(false)
      location.state = null
    }
  }, [location.state])

  

  return (
    <div>
      <MaterialTable
        title=""
        columns={columns}
        data={serviceCenterBooking.data}
        actions={action}
        options={options}
        isLoading={loading}
        components={components}
      />
      <ServiceCenterBookingsModal show={showModal} close={handleClose} Data={serviceCenterBookingInfo} /> 
    </div>
  )
}
