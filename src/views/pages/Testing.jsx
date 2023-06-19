import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import BookingDataTable from '../../components/dataTables/BookingDataTable'

export default function Testing(props) {
  const location = useLocation()
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
 

  return (
    
    <div> Test - {location.state}
    
    <Box sx={{width: '100%', typography: 'body1'}}>
      <TabContext value={value}>
        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="iTem One" value="1" /> 
            <Tab label="iTem Twi" value="2" /> 
            <Tab label="Booking" value="3" /> 
          </TabList>
       
        <TabPanel value="1">Item One</TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
        <TabPanel value="3"><BookingDataTable /></TabPanel>
        </Box>
      </TabContext>
      
    </Box>
 
    </div>
  )
}
