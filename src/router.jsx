import {createBrowserRouter, Navigate} from "react-router-dom"
import DefaultLayout from "./components/DefaultLayout"
import ChangePassword from "./views/authentication/ChangePassword"
import Login from "./views/authentication/Login"
import Dashboard from "./views/pages/Dashboard"
import OTP from "./views/otp verification/OTP"
import Workout from "./views/pages/Services"
import Vehicles from "./views/pages/Vehicles"
import ServiceCenter from "./views/pages/ServiceCenter"
import Bookings from "./views/pages/Bookings"
import Promotions from "./views/pages/Promotions"
import Users from "./views/pages/Users"
import Customers from "./views/pages/Customers"
import ServiceLogo from "./views/pages/ServiceLogo"
import ServiceCenterTabs from "./components/tabs/ServiceCenterTabs"
import ModalOTP from "./views/otp verification/ModalOTP" 
import Loader2 from "./components/loader/Loader2"
import GuestLayout from "./components/GuestLayout"
import NotFound from "./views/NotFound"
import Notification from "./views/pages/Notification"
import Forgot_password from "./views/pages/Forgot_password"
import OTP2 from "./views/otp verification/OTP2"
import HighChart from "./views/graph/HighChart"

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/',
                element: <Navigate to="/dashboard" />,
            },
            {
                path: '/dashboard',
                element: <HighChart />
            },
            {
                path: '/services',
                element: <Workout />
            },
            {
                path: '/vehicles',
                element: <Vehicles />
            },
            {
                path: '/servicecenter',
                element: <ServiceCenter />
            },
            {
                path: '/bookings',
                element: <Bookings />
            },
            {
                path: '/notifications',
                element: <Notification />
            },
            {
                path: '/promotions',
                element: <Promotions />
            },
            {
                path: '/users',
                element: <Users />
            },
            {
                path: '/client',
                element: <Customers />
            },
            {
                path: '/servicecenter/details/:name/:id',
                element: <ServiceCenterTabs />
            },
            {
                path: '/serviceslogo',
                element: <ServiceLogo />
            } 
            
        ]
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/changepwd',
                element: <ModalOTP />
            },
            {
                path: '/otp',
                element: <OTP />
            },
            {
                path: '/otp2',
                element: <OTP2 />
            },
            // {
            //     path: '/changepassword',
            //     element: <ChangePassword />
            // },
            {
                path: '/loader',
                element: <Loader2 />
            },
            // {
            //     path: '/data',
            //     element: <SelectLoc />
            // },
            {
                path: '/forgot_password',
                element: <Forgot_password />
            },
        ]

    },
    {
        path: '*',
        element: <NotFound />
    },
    {
        path: '/chart',
        element: <HighChart />
    }
    
    

]) 

export default router