import React, { useEffect, useState } from 'react';
import MaterialTable from "@material-table/core";
import EditIcon from '@mui/icons-material/Edit';
import { color } from '@mui/system';
import ServiceCenterModal from '../../views/modal/ServiceCenterModal';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../../axios-client';
import Loading from '../loader/Loading';
import { useStateContext } from '../../contexts/ContextProvider';

export default function ServiceCenterDataTable(props) {
  const {user_ID, role} = useStateContext()
  const location = useLocation()
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false)
  const paginationAlignment = useState("center")
  const [serviceCenter, setServiceCenter] = useState([])
  const [serviceCenterInfo, setServiceCenterInfo] = useState([
    {
      id: null,
      name: "",
      Category: "",
      country: "",
      house_number: "",
      barangay: "",
      municipality: "",
      province: "",
      longitude: "",
      latitude: "",
      facility: "",
      image: "",
    }
  ])

  const getServiceCenter = () => {
    setLoading(true)
    axiosClient.get(`/web/servicecenter/${user_ID}`)
      .then(({data}) => {
        setServiceCenter(data)
        setLoading(false)
      })
  }

  const columns = [
    { field: "name", title: "Name", customSort: (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }), render:rowData=><Link underline="hover" to={`/servicecenter/details/${rowData.name}/${rowData.id}`}>{rowData.name}</Link>},
    { field: "reference_number", title: "Reference #", customSort: (a, b) => a.category.localeCompare(b.category, undefined, { sensitivity: 'base' }) },
    { field: "category", title: "Category", customSort: (a, b) => a.category.localeCompare(b.category, undefined, { sensitivity: 'base' }) },
    { field: "barangay", title: "Barangay", customSort: (a, b) => a.barangay.localeCompare(b.barangay, undefined, { sensitivity: 'base' }) },
    { field: "municipality", title: "Municipality", customSort: (a, b) => a.municipality.localeCompare(b.municipality, undefined, { sensitivity: 'base' }) },
    { field: "province", title: "Province", customSort: (a, b) => a.province.localeCompare(b.province, undefined, { sensitivity: 'base' }) },
    { field: "created_at", title: "Date Created" },
   ];

   const action = role == '1' || role == '2' ? [
    {
       
        icon: () => <div className="btn btn-primary">Add New</div> ,
        isFreeAction: true,
        onClick: ((event) => {
          setShowModal(true)
          localStorage.removeItem('lati')
          localStorage.removeItem('longi')
        })
       
    },
    {
      icon: () => <div className="btn btn-success btn-sm"><EditIcon  /></div> ,
      tooltip: 'Edit',
      onClick: (event,rowData) => {
        setServiceCenterInfo({
          ...serviceCenterInfo,
          id: rowData.id,
          name: rowData.name,
          category: rowData.category,
          country: rowData.country,
          house_number: rowData.house_number,
          barangay: rowData.barangay,
          municipality: rowData.municipality,
          province: rowData.province,
          longitude: rowData.longitude,
          latitude: rowData.latitude,
          facility: rowData.facility,
          image: rowData.image,
        })
        setShowModal(true)
      }
    }
  ] : []

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

  useEffect(() => {
    getServiceCenter()
    if (location.state == 'success'){
      getServiceCenter()
      setServiceCenterInfo([])
      setShowModal(false)
      location.state = null
    }
  }, [location.state])

  const handleClose = () => {
    setShowModal(false)
    setServiceCenterInfo([])
  }

  return (
    <div>
      <MaterialTable
        title=""
        columns={columns}
        data={serviceCenter.data}
        actions={action}
        options={options}
        isLoading={loading}
        components={components}
      />
      <ServiceCenterModal show={showModal} close={handleClose} Data={serviceCenterInfo} /> 
    </div>
  )
}
