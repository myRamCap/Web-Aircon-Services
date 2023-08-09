import MaterialTable from '@material-table/core'
import React, { useEffect, useState } from 'react'
import Loading from '../loader/Loading'
import EditIcon from '@mui/icons-material/Edit';
import ServiceCostModal from '../../views/modal/ServiceCostModal';
import { useLocation } from 'react-router-dom';
import axiosClient from '../../axios-client';
import { useStateContext } from '../../contexts/ContextProvider';

export default function ServiceCostDataTable() {
    const location = useLocation()
    const {user_ID, role} = useStateContext()
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
            aircon_type: "",
            cost: "",
            price: "",
            markup: "",
            notes: "",
        }
    ])

    const getServiceCost = async () => {
        setLoading(true);
    
        try {
          const response = await axiosClient.get(`/web/servicecost/${user_ID}`);
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
        { title: 'Aircon Type',field: 'aircon_type' },
        { title: 'Cost',field: 'cost' },
        { title: 'Markup',field: 'markup' },
        { title: 'Price',field: 'price' },
        { title: 'Notes',field: 'notes' },
    ]

    const action = [
        {
            icon: () => <div className="btn btn-primary">Add New</div> ,
            isFreeAction: true,
            hidden: role != "1",
            onClick: (event) => setShowModal(true)
        },
        {
            icon: () => <div className="btn btn-success btn-sm"><EditIcon  /></div> ,
            tooltip: 'Edit',
            hidden: role != "1",
            onClick: (event,rowData) => {
                setCostInfo({
                    ...costInfo,
                    id: rowData.id,
                    service_center_id: rowData.service_center_id,
                    service_center: rowData.service_center,
                    service_id: rowData.service_id,
                    service: rowData.service,
                    aircon_type: rowData.aircon_type,
                    cost: rowData.cost,
                    price: rowData.price,
                    markup: rowData.markup,
                    notes: rowData.notes,
                })
                setShowModal(true)
            }
        }
    ]

    const handlePrint = () => {
        window.print();
      };

    const options = {
        // filtering: true, 
        // ... other options ...
    toolbar: {
        addRemoveColumns: true,
        exportCSV: true,
        exportPDF: true,
        search: true,
        print: handlePrint,
      },
        exportButton: true,
        paging:true,
        pageSize:5,
        emptyRowsWhenPaging: false,
        pageSizeOptions:[5,10],
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
          setCostInfo([])
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
