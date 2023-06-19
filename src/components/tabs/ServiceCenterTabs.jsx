import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React, { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import ServiceCenterBooking from '../../views/pages/ServiceCenterBooking'
import ServiceCenterTimeSlot from '../../views/pages/ServiceCenterTimeSlot'
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ServiceCenterServicesDataTable from '../dataTables/ServiceCenterServicesDataTable'
import { useStateContext } from '../../contexts/ContextProvider'

export default function ServiceCenterTabs(props) {
    const { role } = useStateContext()
    const param = useParams()
    const [value, setValue] = useState('1')

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }
 
  return (
    
    <div id="services">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h1 className='pb-5'>{param.name}</h1>
        </div>
        <Link to="/servicecenter">
        <button className="btn btn-secondary"><ArrowBackIcon /> Back  </button>
        </Link>
        <Box sx={{width: '100%', typography: 'body1'}} className="pt-3">
            <TabContext value={value}>
            { role == 2 || role == 3 ? 
                (
                    <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                        
                                <Tab label="Services" value="1" /> 
                                <Tab label="Operation Time" value="2" /> 
                            
                            {/* <Tab label="Booking" value="3" />  */}
                        </TabList>
                        <TabPanel value="1">
                            <ServiceCenterServicesDataTable id={param.id} />
                        </TabPanel>
                        <TabPanel value="2">
                            <ServiceCenterTimeSlot />
                        </TabPanel>
                        <TabPanel value="3">
                            <ServiceCenterBooking />
                        </TabPanel>
                    </Box>
                ) : null
            }
            </TabContext>
        </Box>
    </div>
  )
}
