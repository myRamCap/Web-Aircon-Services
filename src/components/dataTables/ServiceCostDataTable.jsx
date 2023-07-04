import MaterialTable from '@material-table/core'
import React, { useEffect, useState } from 'react'
import Loading from '../loader/Loading'
import EditIcon from '@mui/icons-material/Edit';
import ServiceCostModal from '../../views/modal/ServiceCostModal';
import { useLocation } from 'react-router-dom';
import axiosClient from '../../axios-client';

export default function ServiceCostDataTable() {
    const location = useLocation()
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false)
    const [serviceCost, setServiceCost] = useState([])
    const [costInfo, setCostInfo] = useState([
        {
            id: null,
            service_center_id: "",
            service_center: "",
            service_id: "",
            service: "",
            cost: "",
            markup: "",
            notes: "",
        }
    ])

    const getServiceCost = async () => {
        setLoading(true);
    
        try {
          const response = await axiosClient.get('/web/servicecost');
          const { data } = response;
          setServiceCost(data);
        } catch (error) {
          // Handle error appropriately
        } finally {
          setLoading(false);
        }
    }

    const columns = [
        { title: 'Corporate Account', field: 'fullname' },
        { title: 'Service Center', field: 'service_center' },
        { title: 'Services',field: 'service' },
        { title: 'Cost',field: 'cost' },
        { title: 'Mark up',field: 'markup' },
        { title: 'Price',field: 'price' },
        { title: 'Notes',field: 'notes' },
    ]

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
                setCostInfo({
                    ...costInfo,
                    id: rowData.id,
                    service_center_id: rowData.service_center_id,
                    service_center: rowData.service_center,
                    service_id: rowData.service_id,
                    service: rowData.service,
                    cost: rowData.cost,
                    markup: rowData.markup,
                    notes: rowData.notes,
                })
                setShowModal(true)
            }
        }
    ]

    const options = {
        // filtering: true, 
        exportButton: true,
        paging:true,
        pageSize:10,
        emptyRowsWhenPaging: false,
        pageSizeOptions:[10,20],
        paginationAlignment: "center",
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

    const handleModalClose = () => {
        setShowModal(false)
        setCostInfo([])
    }

    useEffect(() => {
        getServiceCost()
        if (location.state == 'success'){
        //   setBookingInfo([])
          getServiceCost()
          setShowModal(false)
          location.state = null
        }
      }, [location.state])

    return (
        <div>
        <MaterialTable 
            title=""
            columns={columns}
            data={serviceCost}
            actions={action}
            isLoading={loading}
            components={components}
            options={options}
        />
        <ServiceCostModal show={showModal} close={handleModalClose} Data={costInfo} />
        </div>
    )
}
