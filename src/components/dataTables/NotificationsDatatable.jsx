import MaterialTable from '@material-table/core'
import React, { useEffect, useState } from 'react'
import axiosClient from '../../axios-client'
import EditIcon from '@mui/icons-material/Edit';
import Loading from '../loader/Loading';
import { useLocation } from 'react-router-dom';
import NotificationsModal from '../../views/modal/NotificationsModal';
import { useStateContext } from '../../contexts/ContextProvider';

export default function NotificationsDatatable() {
    const location = useLocation()
    const { user_ID } = useStateContext() 
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(true);
    const paginationAlignment = useState("center")
    const [notification, setNotification] = useState([])
    const [notificationInfo, setNotificationInfo] = useState([
        {
            id: null,
            category: null,
            service_center: null,
            title: "",
            content: "",
            datefrom: "",
            dateto: "",
            image_url: null,
        }
    ])

    const getNotification = async () => {
        setLoading(true)
        try {
            const {data} = await axiosClient.get(`/web/notification/${user_ID}`)
            setNotification(data.data)
            setLoading(false)
        } catch (error) {

        }
    }

    const columns = [
        { field: "image_url", title: "Image", width: 100, render: (rowData) => {
            const styles = { width: 80, borderRadius: "50%" };
            return <img src={rowData.image_url} style={styles} />;
        },},
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
                setNotificationInfo({
                    ...notificationInfo,
                    id: rowData.id,
                    category: rowData.category,
                    service_center: rowData.service_center,
                    title: rowData.title,
                    content: rowData.content,
                    datefrom: rowData.datefrom,
                    dateto: rowData.dateto,
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
        setNotificationInfo([])
    }

    useEffect(() => {
        getNotification()
        if (location.state == 'success'){
            setNotificationInfo([])
            getNotification()
            setShowModal(false)
            location.state = null
        }
    }, [location.state])

 
  return (
    <div>
        <MaterialTable 
            title=""
            columns={columns}
            data={notification}
            actions={action}
            options={options}
            isLoading={loading}
            components={components}
        />
        <NotificationsModal show={showModal} close={handleModalClose} Data={notificationInfo} />
    </div>
  )
}
