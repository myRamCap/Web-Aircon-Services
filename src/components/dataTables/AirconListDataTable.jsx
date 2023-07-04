import React, { useEffect, useState } from 'react';
import MaterialTable from "@material-table/core";
import EditIcon from '@mui/icons-material/Edit';
import axiosClient from '../../axios-client';
import { useLocation } from 'react-router-dom';
import Loading from '../loader/Loading';
import AirconListModal from '../../views/modal/AirconListModal';

export default function AirconListDataTable() {
  const [showModal, setShowModal] = useState(false)
  const paginationAlignment = useState("center")
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aircon, setAircon] = useState([])
  const location = useLocation()
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const [airconInfo, setAirconInfo] = useState([
    {
      id: null,
      client_id: "",
      client_name: "",
      aircon_name: "",
      aircon_type: "",
      client_mobile_number: "",
      make: "",
      model: "",
      horse_power: "",
      serial_number: "",
      image: "",
      notes: "",
    }
  ])

  const getAircon = () => {
    setLoading(true)
    axiosClient.get('/web/aircons')
    .then(({data}) => {
      setAircon(data)
      setLoading(false)
    })
  }

  const columns = [
    { field: "client_mobile_number", title: "Client Mobile #" },
    { field: "aircon_type", title: "Aircon Type" },
    // { field: "contact_number", title: "Contact Number" },
    { field: "model", title: "Model" },
    { field: "horse_power", title: "Horse Power" },
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
        setAirconInfo({
          ...airconInfo,
          id: rowData.id,
          client_id: rowData.client_id,
          client_name: rowData.client_name,
          aircon_name: rowData.aircon_name,
          aircon_type: rowData.aircon_type,
          client_mobile_number: rowData.client_mobile_number,
          make: rowData.make,
          model: rowData.model,
          horse_power: rowData.horse_power,
          serial_number: rowData.serial_number,
          image: rowData.image,
          notes: rowData.notes,
        })
        setShowModal(true)
      }
    },
    // {
    //   icon: () => <div className="btn btn-success btn-sm" onClick={handleClick}><ZoomInRoundedIcon  /></div> ,
    //   tooltip: 'Note'
    // }

  ]

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

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  const handleModalClose = () => {
    setShowModal(false)
    setAirconInfo([])
  }


  useEffect(() => {
    getAircon()
    if (location.state == 'success'){
      getAircon()
      setShowModal(false)
      setAirconInfo([])
      location.state = null
    }
  }, [location.state])

  return (
    <div>
      {/* <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 2 }}>Sangkap yukung Kape kabang manaya ku!</Typography>
      </Popover> */}

      <MaterialTable
        title=""
        columns={columns}
        data={aircon.data}
        actions={action}
        options={options}
        isLoading={loading}
        components={components}
      />
      <AirconListModal show={showModal} close={handleModalClose} Data={airconInfo} />
    </div>
  )
}
