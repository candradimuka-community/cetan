import React, { createContext, useContext, useEffect, useState } from "react";
import { Api } from "../hooks/Api";

export const UserContext = createContext({})
export const UserProvider = ({children}) => {
    const [user, setUser] = useState({})
    const [login, setLogin] = useState(false)
    const [token, setToken] = useState('')
    const [loading, setLoading] = useState(false)
    const [room, setRoom] = useState([])
    const [users, setUsers] = useState([])
    const [param, setParam] = useState('')
    const [height, setHeight] = useState(600)
    const [chatRoom, setChatRoom] = useState({
        id:0
    })
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
    const getUser = async (token) => {
        const { status, data } = await Api({
            path:'user',
            method: 'GET',
            token: token
        })
        if(status === 200){
            setLogin(true)
            setToken(token)
            setUser(data.data)
            getRoomList(token)
        } else {
            setLoading(false)
        }
    }
    const getUsers = async (param) => {
        const { status, data } = await Api({
            path:'user',
            method: 'POST',
            data: {
                email : param
            },
            token: token
        })
        if(status === 200){
            setUsers(data.data)
        }
    }
    const createRoom = async (id) => {
        const {status, data} = await Api({
            path:'room',
            method: 'POST',
            data: {
                opponent: id
            },
            token
        })
        if (status === 200 || status === 201){
            setChatRoom(data.data)
            getRoomList(token)
        } else {
            console.log(data)
        }
    }
    const share = {
            action: {
                setUser,
                setLogin,
                setToken,
                setLoading,
                setRoom,
                setUsers,
                setParam,
                getUsers,
                setHeight,
                setChatRoom,
                createRoom
            },
            state : {
                user,
                login,
                token,
                loading,
                room,
                users,
                param,
                height,
                chatRoom
            }
        }
    useEffect(()=>{
        if(localStorage.getItem('token')){
            getUser(localStorage.getItem('token'))
            setLoading(true)
        }
        if(typeof window !== 'undefined'){
            setHeight(window.innerHeight - 138)
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