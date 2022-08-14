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
    const [searchBox, setSearchBox] = useState(false)
    const [optionBox, setOptionBox] = useState(false)
    const [showLeftExtraNav, setShowLeftExtraNav] = useState(false)
    const [dataMessage, setDataMessage] = useState([

    ])
    const [nextLink, setNextLink] = useState({
        id:''
    })
    const [updateData, setUpdateData] = useState({
        id: 0,
        room: 0
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
        }
    }
    const getDataMessage = async (id) => {
        const {status, data} = await Api({
            path:'room/'+id,
            method: 'GET',
            token
        })
        if(status === 200 || status === 201 ){
            const temp = {
                id: id,
                message: data.data,
                next_url: data.links.next
            }
            setDataMessage([...dataMessage, temp])
        }
    }
    const getNextDataMessage = async (id, url) => {
        const {status, data} = await Api({
            path:url,
            method: 'GET',
            token
        })
        if(status === 200 || status === 201){
            dataMessage.forEach(item =>{
                if(item.id === id){
                    item.next_url = data.links.next
                    item.message = [
                        ...item.message,
                        ...data.data
                    ]
                }
            })
            setDataMessage([...dataMessage])
        }
    }
    const postMessage = async (form) => {
        const {status, data} = await Api({
            path:'message',
            method:'POST',
            data: form,
            token
        })
        getRoomList(token)
        if(status === 201 || status === 200){
            dataMessage.forEach(item => {
                if(item.id === form.room_id){
                    item.message = [data.data, ...item.message]
                }
            })
            setDataMessage([...dataMessage])
        }
    }
    const getOneMessage = async (id, room) => {
        const {status, data} = await Api({
            path:'message/'+id,
            method:'GET',
            token
        })
        if(status === 201 || status === 200){
            dataMessage.forEach(item => {
                if(item.id === room){
                    const temp = item.message.filter(it=> it.id === data.data.id)
                    if(temp.length === 0){
                        item.message = [data.data, ...item.message]
                    }
                }
            })
            setDataMessage([...dataMessage])
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
                createRoom,
                setSearchBox,
                setOptionBox,
                setShowLeftExtraNav,
                setDataMessage,
                postMessage,
                getNextDataMessage,
                setNextLink,
                setUpdateData
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
                chatRoom,
                searchBox,
                optionBox,
                showLeftExtraNav,
                dataMessage,
                nextLink,
                updateData
            }
        }
    useEffect(()=>{
        if(localStorage.getItem('token') && !user.id){
            getUser(localStorage.getItem('token'))
            setLoading(true)
        }
        if(typeof window !== 'undefined'){
            setHeight(window.innerHeight - 138)
        }
    },[])
    useEffect(()=>{
        if(chatRoom.id !== 0){
            const search = dataMessage.filter(item => item.id === chatRoom.id)
            if(search.length === 0){
                getDataMessage(chatRoom.id)
            }
        }
    }, [chatRoom])
    useEffect(()=>{
        if(nextLink.id !== ''){
            getNextDataMessage(nextLink.id, nextLink.url)
        }
    }, [nextLink])
    useEffect(()=>{
        if(updateData.id !== 0 && updateData.room !== 0){
            getRoomList(token)
            if(chatRoom.id === updateData.room){
                getOneMessage(updateData.id, updateData.room)
            }
        }
    }, [updateData])
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