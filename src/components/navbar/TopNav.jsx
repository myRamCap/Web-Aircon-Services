import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';
import axiosClient from '../../axios-client';
import { useState } from 'react';
import { useEffect } from 'react';

const settings = ['Profile', 'Logout'];

export default function TopNav() {
  const {user_ID, setUser, setToken, setRole, role, setUser_ID} = useStateContext()
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState([])
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const getUser = async () => {
    try {
      const response = await axiosClient.get(`/web/profile/${user_ID}`);
      const { data } = response;
      setUserInfo(data);
    } catch (error) {
      // Handle error
    }
  }

  const handleCloseUserMenu = (selectedSetting) => {

    setAnchorElUser(null);
    const setting = `${selectedSetting}`;
 
    if (setting === 'Logout') {
        Swal.fire({
            title: 'Are you sure you want to Logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#32be8f',
            confirmButtonText: 'Yes, Logout!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                'Logout Successfully!',
                'you will now be redirected to the Login page',
                'success'
                ).then(() => {
                axiosClient.post('/logout')
                .then(() => {
                    setUser({})
                    setToken(null)
                    setRole(null)
                    setRole(null)
                    setUser_ID(null)
                })
                })
            }
        })
    } else if (setting === 'Profile') {
      navigate('/profile', { state: 'success' });
    }
  };

  useEffect(()=>{
    getUser()
  },[])
 
  return (
 
    <AppBar position="static" className='mb-4 test'>
    <Container maxWidth="100%" className='test'>
      <Toolbar disableGutters> 
        <Box sx={{ flexGrow: 1 }}>
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="Remy Sharp" src={userInfo.image} />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </Container>
  </AppBar>
);
 
 
}
