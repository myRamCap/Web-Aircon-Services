import React, { useEffect, useState } from 'react';
import MaterialTable from "@material-table/core";
import EditIcon from '@mui/icons-material/Edit';
import ServicesLogoModal from '../../views/modal/ServicesLogoModal';
import axiosClient from '../../axios-client';
import { useLocation } from 'react-router-dom';
import NoImage from '../../assets/images/No-Image.png';
import Loading from '../loader/Loading';

export default function ServiceLogoDataTable() {
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false)
    const paginationAlignment = useState("center")
    const [servicesLogo, setServicesLogo] = useState([])
    const location = useLocation()
    const [serviceLogoID, setServiceLogoID] = useState([
      {
        id: "",
        title: "",
        description: "",
        image: null,
        image_url: null,
      }
    ])

    const getServicesLogo = () => {
      setLoading(true)
      axiosClient.get('/web/serviceslogo')
        .then(({data}) => {
          setServicesLogo(data)
          setLoading(false)
        })
    } 

    const columns = [
      { field: "id", title: "ID", hidden: true, },
      { field: "image", title: "Image", width: 100, sorting: false, render: (rowData) => {
          const styles = { width: 50 };
          return <img src={rowData.image_url ?? NoImage} style={styles} />;
        },
      },
      { field: "title", title: "Title", customSort: (a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }) },
      { field: "description", title: "Description", customSort: (a, b) => a.description.localeCompare(b.description, undefined, { sensitivity: 'base' }) },
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
            setServiceLogoID({
              ...serviceLogoID,
              id: rowData.id,
              title: rowData.title,
              description: rowData.description,
              image: rowData.image,
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
        filtering: false,
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
        getServicesLogo()
        if (location.state){
          getServicesLogo()
          setShowModal(false)
          setServiceLogoID([])
          location.state = null
        }
      }, [location.state])

      const handleClose = () => {
        setShowModal(false)
        setServiceLogoID([])
      }

  return (
    <div> 
        <MaterialTable
        title=""
        columns={columns}
        data={servicesLogo.data}
        actions={action}
        options={options}
        isLoading={loading}
        components={components}
      />
      <ServicesLogoModal show={showModal} close={handleClose} Data={serviceLogoID}/>
    </div>
  )
}
