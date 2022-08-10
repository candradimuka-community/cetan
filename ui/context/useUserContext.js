import React, { createContext, useContext, useEffect, useState } from "react";
import { Api } from "../hooks/Api";

export const UserContext = createContext({})
export const UserProvider = ({children}) => {
    const [user, setUser] = useState({})
    const [login, setLogin] = useState(false)
    const [token, setToken] = useState('')
    const [loading, setLoading] = useState(false)
    const [room, setRoom] = useState([])
    const getUser = async (token) => {
        const getRoomList = async (token) => {
            const { status, data } = await Api({
                path:'room',
                method: 'GET',
                token: token
            })
            setLoading(false)
            if(status === 200){
                setRoom(data.data)
            }
        }
        const { status, data } = await Api({
            path:'user',
            method: 'GET',
            token: token
        })
        if(status === 200){
            setLogin(true)
            setUser(data.data)
            getRoomList(token)
        } else {
            setLoading(false)
        }
    }


    const share = {
            action: {
                setUser,
                setLogin,
                setToken,
                setLoading,
                setRoom
            },
            state : {
                user,
                login,
                token,
                loading,
                room
            }
        }
    useEffect(()=>{
        if(localStorage.getItem('token')){
            getUser(localStorage.getItem('token'))
            setLoading(true)
        }
    },[])
    return (
        <UserContext.Provider value={share}>
            {children}
        </UserContext.Provider>
    )
}
const UseUserContext = () => {
    return useContext(UserContext)
}
export default UseUserContext;