import React, { useEffect, useState } from 'react';
import MaterialTable from "@material-table/core";
import EditIcon from '@mui/icons-material/Edit';
import PromotionModal from '../../views/modal/PromotionModal';
import Loading from '../loader/Loading';
import axiosClient from '../../axios-client';
import { useLocation } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';

export default function PromotionDataTable() {
  const { user_ID } = useStateContext() 
    const location = useLocation()
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false)
    const paginationAlignment = useState("center")
    const [promotion, setPromotion] = useState([])
    const [promotionInfo, setPromotionINfo] = useState({
      id: null,
      category: "",
      client: "",
      datefrom: "",
      dateto: "",
      title: "",
      content: "",
      image_url: "",
    })

    const getPromotion = async () => {
      setLoading(true)
      try {
        const { data } = await axiosClient.get(`/web/promotion/${user_ID}`)
        setPromotion(data.data)
        setLoading(false)
      } catch (error) {
  
      }
    }

    const columns = [
      { field: "image_url", title: "Image", width: 100, render: (rowData) => {
          const styles = { width: 80, borderRadius: "50%" };
          return <img src={rowData.image_url} style={styles} />;
        },
      },
      { field: "title", title: "Title" },
      { field: "content", title: "Content" },
      { field: "date_range", title: "Date Range" },
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
          setPromotionINfo({
              ...promotionInfo,
              id: rowData.id,
              category: rowData.category,
              client: rowData.client,
              datefrom: rowData.datefrom,
              dateto: rowData.dateto,
              title: rowData.title,
              content: rowData.content,
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

    const handleModalClose = () => {
      setShowModal(false)
      setPromotionINfo([])
    }

    useEffect(() => {
      getPromotion()
      if (location.state == 'success'){
          setShowModal(false)
          setPromotionINfo([])
          location.state = null
      }
    }, [location.state])

  return (
    <div>
      <MaterialTable
        title=""
        columns={columns}
        data={promotion}
        actions={action}
        options={options}
        isLoading={loading}
        components={components}
      />
      <PromotionModal show={showModal} close={handleModalClose} Data={promotionInfo}/>
    </div>
  )
}
