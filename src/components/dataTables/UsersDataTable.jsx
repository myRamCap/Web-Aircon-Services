import React, { useEffect, useState } from 'react';
import MaterialTable from "@material-table/core";
import EditIcon from '@mui/icons-material/Edit';
import UserModal from '../../views/modal/UserModal';
import Loading from '../loader/Loading';
import axiosClient from '../../axios-client';
import { useStateContext } from '../../contexts/ContextProvider';
import { useLocation } from 'react-router-dom';

export default function UsersDataTable() {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const location = useLocation()
  const paginationAlignment = useState("center")
  const {role, user, user_ID} = useStateContext()
  const [userInfo, setUserInfo] = useState([
    {
      id: null,
      first_name: "",
      last_name: "",
      fullname: "",
      email: "",
      contact_number: "",
      role_id: "",
      role_name: "",
      service_center_id: "",
      service_center: "",
      branch_manager: "",
      allowed_sc: "",
      allowed_bm: "",
    }
  ])

  const getUsers = async () => {
    setLoading(true)
    try {
      const response = await axiosClient.get(`/web/users/${user_ID}` )
      setUsers(response.data)
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  }
  
  const columns = [
    { title: 'Name', field: 'fullname' },
    { title: 'Email', field: 'email' },
    { title: 'Contact Number', field: 'contact_number' },
    { title: 'Role',field: 'role_name' },
  ]

  const handleAddUser = () => {
    setShowModal(true);
  };
  
  const handleEditUser = (event,rowData) => {
    setUserInfo({
      id: rowData.id,
      first_name: rowData.first_name,
      last_name: rowData.last_name,
      fullname: rowData.fullname,
      email: rowData.email,
      contact_number: rowData.contact_number,
      role_id: rowData.role_id,
      role_name: rowData.role_name,
      service_center_id: rowData.service_center_id,
      service_center: rowData.service_center,
      branch_manager: rowData.branch_manager,
      allowed_sc: rowData.allowed_sc,
      allowed_bm: rowData.allowed_bm,
    });
    setShowModal(true);
  };

   const action = [
    {
      icon: () => <div className="btn btn-primary">Add New</div> ,
      isFreeAction: true,
      onClick: handleAddUser,
    },
    {
      icon: () => <div className="btn btn-success btn-sm"><EditIcon  /></div> ,
      tooltip: 'Edit',
      onClick: handleEditUser,
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
    setUserInfo([])
  }

  useEffect(() => {
    getUsers()
    if (location.state == 'success'){
      setShowModal(false)
      setUserInfo([])
      getUsers()
      location.state = null
    }
  }, [location.state])

  return (
    <div>
      <MaterialTable
        title=""
        columns={columns}
        data={users.data}
        actions={action} 
        options={options}
        isLoading={loading}
        components={components}
      />
      <UserModal show={showModal} close={handleModalClose} Data={userInfo} userID={user_ID} userRole={role}/>
    </div>
  )
}
