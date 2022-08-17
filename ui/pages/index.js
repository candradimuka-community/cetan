import { useEffect, useState } from "react";
import Router from "next/router";
import UseUserContext from "../context/useUserContext";
import NavLeft from "../components/navLeft";
import FormEl from "../components/formEl"
import { CheckIcon, ChevronDownIcon, ClockIcon, PaperAirplaneIcon, UserIcon } from "@heroicons/react/outline";
import LeftSlider from "../components/leftSlider";
import NavRight from "../components/navRight";
import { useInView } from 'react-intersection-observer';
import Echo from 'laravel-echo';

if (typeof window !== 'undefined') {
    window.Pusher = require('pusher-js');

    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: process.env.NEXT_PUBLIC_MIX_PUSHER_APP_KEY,
        wsHost: window.location.hostname,
        wsPort: 6001,
        forceTLS: false,
        disableStats: true,
    });
}

const Index = () => {
    const {action, state} = UseUserContext()
    const { ref, inView } = useInView({
        threshold: 0
    });
    const [search, setSearch] = useState('')
    const [room, setRoom] = useState(state.room)
    const [leftSlider, setLeftSlider] = useState(false)
    const [message, setMessage] = useState({
        id: 0,
        message:[],
        next_url:''
    })
    const [form, setForm] = useState({
        room_id : state.chatRoom.id,
        body: '',
        message_id: ''
    })
    const changeTime = (data, timer) => {
        const temp = data.split('T')
        const date = temp[0]
        const timeTemp = temp[1].split('.')[0]
        const tmp = timeTemp.split(':')
        const time = `${tmp[0]}:${tmp[1]}`
        if(date !== new Date().toJSON().slice(0,10).replace(/-/g,'-')){
            return timer
        }
        return time
    }
    useEffect(() => {
        const token = localStorage.getItem('token')
        if(!token){
            Router.push('/auth')
        }
        if(typeof window !== 'undefined'){
            window.onclick = ()=>{
                action.setShowLeftExtraNav(false)
                action.setSearchBox(false)
                action.setOptionBox(false)
            }
        }

    },[]);
    useEffect(()=>{
        if(!state.loading && !state.login){
            Router.push('/auth')
        }
        if(state.dataMessage.length > 0){
            const temp = state.dataMessage.filter(item => item.id === state.chatRoom.id)
            if(temp.length > 0){
                setMessage(temp[0])
            } else {
                setMessage({
                    id: 0,
                    message:[],
                    next_url:''
                })
            }
        }
        setForm({
            ...form,
            room_id: state.chatRoom.id
        })
    }, [state])
    if(typeof window !== 'undefined'){
        window.Echo.channel(`Cetan-${state.user.id}`)
            .listen('.NewMessage', (e) => {
                const msg = e.message
                state.dataMessage.forEach(item=>{
                    if(item.id === msg.room_id){
                        if(item.message.filter(it => it.id === msg.id).length === 0){
                            item.message = [
                                msg,
                                ...item.message
                            ]
                        }
                    }
                })
                action.setDataMessage([...state.dataMessage])
                action.setRoom(e.roomList)
            });
        window.Echo.channel(`Cetan-${state.user.id}`)
            .listen('.DeleteMessage', (e)=>{
                state.dataMessage.forEach(item=>{
                    if(item.id === e.room){
                        item.message = item.message.filter(it => it.id !== e.message)
                    }
                })
                action.setDataMessage([...state.dataMessage])
            })
    }
    useEffect(()=>{
        setRoom(state.room.filter(item => item.opponent.email.toLowerCase().includes(search)))
    }, [state, search])
    return (
        <div className="grid grid-cols-10 h-screen">
            <div className="col-span-3 border-r border-slate-400 flex flex-col relative">
                <LeftSlider 
                    leftSlider={leftSlider}
                    setLeftSlider={setLeftSlider}
                    />
                <NavLeft 
                    leftSlider={leftSlider}
                    setLeftSlider={setLeftSlider}
                />
                <div className="bg-slate-50 px-3 pb-5">
                    <FormEl
                        type="search"
                        id="search"
                        placeholder="search user"
                        onChange={e=>setSearch(e.target.value)}
                        value={search}
                    />
                </div>
                <div className={`overflow-y-auto scrollbar`} style={{
                    height: state.height,
                    maxHeight: state.height
                }}>
                    {room.map((item, index)=> {
                        if (!item.last_message){
                            return (<div key={item.id}></div>)
                        }
                        return (
                        <div onClick={()=>action.setChatRoom(item)} className={`grid grid-cols-4 px-5 hover:cursor-pointer ${state.chatRoom.id === item.id ? 'bg-slate-100 hover::bg-slate-200':'bg-white hover:bg-slate-100'}`} key={item.id}>
                            <div className="bg-slate-100 my-3 h-12 w-12 rounded-full flex justify-center items-center">
                                <UserIcon className="h-6 w-6 text-black"/>
                            </div>
                            <div className="col-span-3 border-b border-slate-300 flex flex-col justify-evenly">
                                <div className="flex justify-between">
                                    <span className="">{item.opponent.email}</span>
                                    <span>{item.last_active}</span>
                                </div>
                                <p className="text-sm text-slate-500">{item.last_message.body.length > 40 ? item.last_message.body.slice(0,40)+'...' : item.last_message.body}</p>
                            </div>
                        </div>
                    )})}
                    {room.length === 0 && (<p>Room Not Found</p>)}
                </div>
            </div>
            <div className="col-span-7">
                <div className="h-14 bg-slate-100 relative">
                    <NavRight/>
                </div>
                <div className="w-full overflow-y-auto flex flex-col-reverse gap-2 scrollbar" style={{
                    height: state.height,
                    maxHeight: state.height
                }}>
                    {message.message.map((item, index)=>(
                        <div className={`group relative w-1/2 m-2 p-2 ${item.user_id === state.user.id ? 'bg-cyan-300 rounded-br-md rounded-tl-md self-end':'bg-lime-300 rounded-bl-md rounded-tr-md'}`}>
                            {item.user_id === state.user.id && (
                                <>
                                    <div className="absolute right-2 hidden group-hover:block peer">
                                        <ChevronDownIcon className="w-5 h-5" />
                                    </div>
                                    <div onClick={()=>action.deleteMessage(item.id, item.room_id)} className="bg-white px-3 absolute hidden peer-hover:block right-2 top-6 hover:block cursor-pointer hover:bg-slate-100 active:bg-slate-200 rounded-sm">
                                        delete
                                    </div>
                                </>
                            )}
                            <p>{item.body}</p>
                            <p className="text-sm flex justify-end items-center gap-2 w-full">
                                <span>
                                    {item.time ? changeTime(item.time, item.timer) : 'Baru Saja'}
                                </span>
                                {item.user_id === state.user.id && (
                                    <span>
                                        {!item.time ? (
                                            <ClockIcon className="w-3 h-3 text-slate-600"/>
                                        ) : (
                                            <>
                                                <CheckIcon className={`w-3 h-3 text-slate-600`} />
                                                {item.readed === 1 && (
                                                    <CheckIcon className="w-3 h-3 -mt-2 text-slate-600" />
                                                )}
                                            </>
                                        )}
                                    </span>
                                )}
                            </p>
                        </div>
                    ))}
                    {message.next_url && (
                        <div ref={ref} className="self-center bg-slate-100 px-5 py-1 my-2 rounded-full disabled">
                            Load More .... {inView && state.nextLink.url !==message.next_url.split(process.env.NEXT_PUBLIC_API_HOST)[1] && action.setNextLink({
                                id: message.id,
                                url: message.next_url.split(process.env.NEXT_PUBLIC_API_HOST)[1]
                            })}
                        </div>
                    )}
                </div>
                {state.chatRoom.id !== 0 && (
                    <div className="bg-slate-50 px-5 flex gap-5 items-center">
                        <div className="pb-5 w-full">
                            <FormEl
                                type="text"
                                id="message"
                                placeholder="type your message"
                                onChange={e=>setForm({
                                    ...form,
                                    body: e.target.value
                                })}
                                value={form.body}
                                onKeyDown={e=>{
                                    if(e.key == 'Enter'){
                                        document.getElementById('sendMessage').click()
                                    }
                                }}
                            /> 
                        </div>

                        <div id="sendMessage" onClick={()=>{
                            setMessage({
                                ...message,
                                message: [
                                    {
                                        id: 0,
                                        user_id: state.user.id,
                                        body: form.body
                                    },
                                    ...message.message
                                ]
                            })
                            setForm({
                                ...form,
                                body:''
                            })
                            action.postMessage(form)
                            }} className={`h-10 w-10 flex justify-center items-center hover:bg-slate-100 rounded-full ${form.body === '' ? 'hidden':''}`}>
                            <PaperAirplaneIcon className="w-7 h-7 text-blue-400 rotate-45" />
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}

export default Index
