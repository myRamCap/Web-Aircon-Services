import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/images/Logo-RC.png'
import axiosClient from '../../axios-client';
import { useStateContext } from '../../contexts/ContextProvider';
import Swal from 'sweetalert2'

export default function Navbar() {
    const {setUser, setToken, setRole, role, setUser_ID} = useStateContext()
    const location = useLocation();
    const { pathname } = location;
    const splitLocation = pathname.split("/");
    const [active, setActive] = useState(true)
    const toggle = () => setActive (!active);

    const onLogout = (ev) => {
        ev.preventDefault()
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
    }

  return (
    <div className={`sidebar ${active ? 'active' : ''}`}>
        <div className="logo_content">
            <div className="logo">
            {/* <img src={logo} alt="Logo" style={{ width: '200px', height: '150px' }} /> */}
                <div className="logo_name">
                    <img src={logo} alt="Logo" style={{ width: '200px', height: '150px' }} />
                </div>
            </div>
            <i onClick={toggle} >
                <box-icon name="menu" id="btn" size="sm" />
            </i>
        </div>
        <ul className="nav">
            { role == 1 || role == 2 || role == 3 ? 
                (   
                    <li>
                        <Link className={splitLocation[1] === "dashboard" ? "isActive" : ""} to="/dashboard">
                            <i>
                                <box-icon name='bar-chart-square' color={splitLocation[1] === "dashboard" ? 'white' : ''}/>
                            </i>
                            <span className="link_name">Dashboard</span>
                        </Link>
                        <span className="tooltip">Dashboard</span>
                    </li>
                ) : null
            }
            { role == 1 ? 
                (   
                    <li>
                        <Link className={splitLocation[1] === "serviceslogo" ? "isActive" : ""} to="/serviceslogo">
                            <i>
                                <box-icon name='image-alt' color={splitLocation[1] === "serviceslogo" ? 'white' : ''} />
                            </i>
                            <span className="link_name">Managed Services</span>
                        </Link>
                        <span className="tooltip">Managed Services</span>
                    </li>
                ) : null
            }
            { role == 1 || role == 2 ? 
                (   
                    <li>
                        <Link className={splitLocation[1] === "services" ? "isActive" : ""} to="/services"> 
                            <i>
                                <box-icon name='cog' color={splitLocation[1] === "services" ? 'white' : ''} />
                            </i>
                            <span className="link_name">Services</span>
                        </Link>
                        <span className="tooltip">Services</span>
                    </li>
                ) : null
            }
            { role == 1 ? 
                (   
                    <li>
                        <Link className={splitLocation[1] === "vehicles" ? "isActive" : ""} to="/vehicles">
                            <i>
                                <box-icon name='car' color={splitLocation[1] === "vehicles" ? 'white' : ''} />
                            </i>
                            
                            <span className="link_name">Vehicles</span>
                        </Link>
                        <span className="tooltip">Vehicles</span>
                    </li>
                ) : null
            }
            { role == 1 || role == 2 || role == 3 || role == 4  ? 
                ( 
                    <li>
                        <Link className={splitLocation[1] === "servicecenter" ? "isActive" : ""} to="/servicecenter">
                            <i>
                                <box-icon  type='solid' name='car-mechanic' color={splitLocation[1] === "servicecenter" ? 'white' : ''} />
                            </i>
                            
                            <span className="link_name">Service Center</span>
                        </Link>
                        <span className="tooltip">Service Center</span>
                    </li>
                ) : null
            }
            { role == 1 || role == 2 || role == 3 || role == 4 ? 
                ( 
                    <li>
                        <Link className={splitLocation[1] === "bookings" ? "isActive" : ""} to="/bookings">
                            <i>
                                <box-icon name='calendar-check' color={splitLocation[1] === "bookings" ? 'white' : ''} />
                            </i>
                            
                            <span className="link_name">Bookings</span>
                        </Link>
                        <span className="tooltip">Bookings</span>
                    </li>
                ) : null
            }
            { role == 1 || role == 2 || role == 3 ? 
                ( 
                    <li>
                        <Link className={splitLocation[1] === "notifications" ? "isActive" : ""} to="/notifications">
                            <i>
                                <box-icon name='notification' color={splitLocation[1] === "notifications" ? 'white' : ''} />
                            </i>
                            
                            <span className="link_name">Notifications</span>
                        </Link>
                        <span className="tooltip">Notifications</span>
                    </li>
                ) : null
            }
            { role == 1 || role == 2 || role == 3 ? 
                ( 
                    <li>
                        <Link className={splitLocation[1] === "promotions" ? "isActive" : ""} to="/promotions">
                            <i>
                            <box-icon name='party' color={splitLocation[1] === "promotions" ? 'white' : ''} />
                            </i>
                            
                            <span className="link_name">Promotions</span>
                        </Link>
                        <span className="tooltip">Promotions</span>
                    </li>
                ) : null
            }
            { role == 1 || role == 2 || role == 3 ? 
                ( 
                    <li>
                        <Link className={splitLocation[1] === "users" ? "isActive" : ""} to="/users">
                            <i>
                                <box-icon name='user-circle' color={splitLocation[1] === "users" ? 'white' : ''} />
                            </i>
                            
                            <span className="link_name">Users</span>
                        </Link>
                        <span className="tooltip">Users</span>
                    </li>
                ) : null
            }
            { role == 1 ? 
                ( 
                    <li>
                        <Link className={splitLocation[1] === "client" ? "isActive" : ""} to="/client">
                            <i>
                                <box-icon name='group' color={splitLocation[1] === "client" ? 'white' : ''} />
                            </i>
                            
                            <span className="link_name">Client</span>
                        </Link>
                        <span className="tooltip">Client</span>
                    </li>
                ) : null
            }
       
            <li>
                <hr />
            </li>
            <li>
                
                <a href="" onClick={onLogout}>
                    <i>
                        <box-icon name='log-out'/>
                    </i>
                    
                    <span className="link_name">Logout</span>
                </a>
                <span className="tooltip">Logout</span>
            </li>
            </ul>
    </div>
  )
}
