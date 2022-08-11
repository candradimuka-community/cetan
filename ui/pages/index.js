import { useEffect, useState } from "react";
import Router from "next/router";
import UseUserContext from "../context/useUserContext";
import NavLeft from "../components/navLeft";
import FormEl from "../components/formEl"
import { PaperAirplaneIcon, UserIcon } from "@heroicons/react/outline";
import LeftSlider from "../components/leftSlider";
import NavRight from "../components/navRight";

const Index = () => {
    const {action, state} = UseUserContext()
    
    const [search, setSearch] = useState('')
    const [room, setRoom] = useState(state.room)
    const [leftSlider, setLeftSlider] = useState(false)
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
    }, [state])
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
                    {room.map((item, index)=>(
                        <div onClick={()=>action.setChatRoom(item)} className={`grid grid-cols-4 px-5 hover:cursor-pointer ${state.chatRoom.id === item.id ? 'bg-slate-100 hover::bg-slate-200':'bg-white hover:bg-slate-100'}`} key={item.id}>
                            <div className="bg-slate-100 my-3 h-12 w-12 rounded-full flex justify-center items-center">
                                <UserIcon className="h-6 w-6 text-black"/>
                            </div>
                            <div className="col-span-3 border-b border-slate-300 flex flex-col justify-evenly">
                                <div className="flex justify-between">
                                    <span className="">{item.opponent.email}</span>
                                    <span>{item.last_active}</span>
                                </div>
                                <p className="text-sm text-slate-500">{item.message}</p>
                            </div>
                        </div>
                    ))}
                    {room.length === 0 && (<p>Room Not Found</p>)}
                </div>
            </div>
            <div className="col-span-7">
                <div className="h-14 bg-slate-100 relative">
                    <NavRight/>
                </div>
                <div className="w-full overflow-y-auto" style={{
                    height: state.height,
                    maxHeight: state.height
                }}>
                </div>
                <div className="bg-slate-50 px-5 flex gap-5 items-center">
                    <div className="pb-5 w-full">
                        <FormEl
                            type="text"
                            id="message"
                            placeholder="type your message"
                            // onChange={e=>action.setParam(e.target.value)}
                            // value={state.param}
                        /> 
                    </div>

                    <div className="h-10 w-10 flex justify-center items-center hover:bg-slate-100 rounded-full">
                        <PaperAirplaneIcon className="w-7 h-7 text-blue-400 rotate-45" />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Index
