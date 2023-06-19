import React, { useEffect, useState } from 'react';
import MaterialTable from "@material-table/core";
import EditIcon from '@mui/icons-material/Edit';
import TimeSlotModal from '../../views/modal/TimeSlotModal';
import axiosClient from '../../axios-client';
import { useLocation, useParams } from 'react-router-dom';
import Loading from '../loader/Loading';
import { format } from 'date-fns';
import { Checkbox } from '@mui/material';

export default function ServiceCenterTimeSlotDataTable() {
  const location = useLocation()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true);
  const param = useParams()
  const paginationAlignment = useState("center")
  const [serviceCenterTimeSLot, setServiceCenterTimeSLot] = useState([])
  const [serviceCenterTimeSLotInfo, setServiceCenterTimeSLotInfo] = useState([
    {
      id: null,
      service_center_id: param.id,
      category: "",
      opening_time: "",
      closing_time: "",
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    }
  ])

  const getServiceCenterTimeSlot = () => {
    setLoading(true)
    axiosClient.get(`/web/service_center/operationtime/${param.id}`)
    .then(({data}) => {
      setServiceCenterTimeSLot(data)
      setLoading(false)
    })
  }

  const columns = [
    { field: "category", title: "Category" },
    { field: "opening_time", title: "Opening Time" },
    { field: "closing_time", title: "Closing Time" },
    {
      field: "selected",  // New column for the checkbox
      title: "Monday",
      render: (rowData) => (
        <Checkbox
          checked={rowData.monday == 1}  // Check if `monday` is equal to 1
          disabled
        />
      ),
    },
    {
      field: "selected",  // New column for the checkbox
      title: "Tuesday",
      render: (rowData) => (
        <Checkbox
          checked={rowData.tuesday == 1}  // Check if `monday` is equal to 1
          disabled
        />
      ),
    },
    {
      field: "selected",  // New column for the checkbox
      title: "Wednesday",
      render: (rowData) => (
        <Checkbox
          checked={rowData.wednesday == 1}  // Check if `monday` is equal to 1
          disabled
        />
      ),
    },
    {
      field: "selected",  // New column for the checkbox
      title: "Thursday",
      render: (rowData) => (
        <Checkbox
          checked={rowData.thursday == 1}  // Check if `monday` is equal to 1
          disabled
        />
      ),
    },
    {
      field: "selected",  // New column for the checkbox
      title: "Friday",
      render: (rowData) => (
        <Checkbox
          checked={rowData.friday == 1}  // Check if `monday` is equal to 1
          disabled
        />
      ),
    },
    {
      field: "selected",  // New column for the checkbox
      title: "Saturday",
      render: (rowData) => (
        <Checkbox
          checked={rowData.saturday == 1}  // Check if `monday` is equal to 1
          disabled
        />
      ),
    },
    {
      field: "selected",  // New column for the checkbox
      title: "Sunday",
      render: (rowData) => (
        <Checkbox
          checked={rowData.sunday == 1}  // Check if `monday` is equal to 1
          disabled
        />
      ),
    },
    { field: "created_at", title: "Date Created" },
    // { field: "date_created", title: "Date Created", render: (rowData) => format(new Date(rowData.date_created), 'yyyy-MM-dd HH:mm:ss'),},

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
        setServiceCenterTimeSLotInfo({
          ...serviceCenterTimeSLotInfo,
          id: rowData.id,
          service_center_id: rowData.service_center_id,
          category: rowData.category,
          opening_time: rowData.opening_time,
          closing_time: rowData.closing_time,
          monday: rowData.monday,
          tuesday: rowData.tuesday,
          wednesday: rowData.wednesday,
          thursday: rowData.thursday,
          friday: rowData.friday,
          saturday: rowData.saturday,
          sunday: rowData.sunday,
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
    setServiceCenterTimeSLotInfo([])
  }

  useEffect(() => {
    getServiceCenterTimeSlot()
    if (location.state == 'success'){
      getServiceCenterTimeSlot()
      setShowModal(false)
      setServiceCenterTimeSLotInfo([])
      location.state = null
    }
  }, [location.state])

  return (
    <div>
      <MaterialTable
        title=""
        columns={columns}
        data={serviceCenterTimeSLot.data}
        actions={action}
        options={options}
        isLoading={loading}
        components={components}
      />
      <TimeSlotModal show={showModal} close={handleClose} Data={serviceCenterTimeSLotInfo} /> 
    </div>
  )
}
