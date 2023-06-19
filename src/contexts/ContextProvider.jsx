import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    Notification: null,
    email: null,
    role: null,
    user_ID: null,
    setUser: () => {},
    setToken: () => {},
    setNotification: () => {},
    setEmail: () => {},
    setRole: () => {},
    setUser_ID: () => {}

})

export const ContextProvider = ({children}) => {
    const [user, setUser] = useState({})
    const [notification, _setNotification] = useState('')
    const [useremail, setUserEmail] = useState('')
    const [role, _setRole] = useState(localStorage.getItem('USER_ROLE'))
    const [user_ID, _setUser_ID] = useState(localStorage.getItem('USER_ID'))
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'))

    const setNotification = (message) => {
        _setNotification(message)
        setTimeout(() => {
            _setNotification('')
        }, 5000)
    }

    const setToken = (token) => {
        _setToken(token)
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token)
        } else {
            localStorage.removeItem('ACCESS_TOKEN')
        } 
    }

    const setRole = (role) => {
        _setRole(role)
        if (role) {
            localStorage.setItem('USER_ROLE', role)
        } else {
            localStorage.removeItem('USER_ROLE')
        } 
    }

    const setUser_ID = (user_ID) => {
        _setUser_ID(user_ID)
        if (user_ID) {
            localStorage.setItem('USER_ID', user_ID)
        } else {
            localStorage.removeItem('USER_ID')
        } 
    }

    return (
        <StateContext.Provider value={{
            user,
            token,
            setUser,
            setToken,
            notification,
            setNotification,
            useremail,
            setUserEmail,
            role,
            setRole,
            user_ID,
            setUser_ID
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)