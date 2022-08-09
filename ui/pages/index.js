import { useEffect, useState } from "react";
import Router from "next/router";
import UseUserContext from "../context/useUserContext";
import NavLeft from "../components/navLeft";
import FormEl from "../components/formEl"

const Index = () => {
    const {action, state} = UseUserContext()
    const [showLeftExtraNav, setShowLeftExtraNav] = useState(false)
    const [search, setSearch] = useState('')
    const [dummy, setDummy] = useState([
        {
            email: 'saha ieu',
            time: '17.00',
            message: 'cuma design'
        },
        {
            email: 'saha ieu',
            time: '17.00',
            message: 'cuma design'
        },
        {
            email: 'saha ieu',
            time: '17.00',
            message: 'cuma design'
        },
        {
            email: 'saha ieu',
            time: '17.00',
            message: 'cuma design'
        },
        {
            email: 'saha ieu',
            time: '17.00',
            message: 'cuma design'
        },
        {
            email: 'saha ieu',
            time: '17.00',
            message: 'cuma design'
        },
        {
            email: 'saha ieu',
            time: '17.00',
            message: 'cuma design'
        },
        {
            email: 'saha ieu',
            time: '17.00',
            message: 'cuma design'
        },
    ])
    useEffect(() => {
        const token = localStorage.getItem('token')
        if(!token){
            Router.push('/auth')
        }
        if(typeof window !== 'undefined'){
            window.onclick = ()=>setShowLeftExtraNav(false)
        }

    },[]);
    useEffect(()=>{
        if(!state.loading && !state.login){
            Router.push('/auth')
        }
    }, [state])
    return (
        <div className="grid grid-cols-10 h-screen">
            <div className="col-span-3 border-r border-slate-400 flex flex-col">
                <NavLeft 
                    showLeftExtraNav={showLeftExtraNav}
                    setShowLeftExtraNav={setShowLeftExtraNav}
                />
                <div className="bg-slate-50 px-3 pb-4">
                    <FormEl
                        type="search"
                        id="search"
                        placeholder="search user"
                        onChange={e=>setSearch(e.target.value)}
                        value={search}
                    />
                </div>
                <div className={`overflow-y-scroll scrollbar max-h-[510px]`}>
                    {dummy.map((item, index)=>(
                        <div className="grid grid-cols-4 px-5 bg-white hover:bg-slate-100" key={index}>
                            <div className="bg-slate-100 my-3 h-12 w-12 rounded-full flex justify-center text-4xl">
                                {item.email[0]}
                            </div>
                            <div className="col-span-3 border-b border-slate-300 flex flex-col justify-evenly">
                                <div className="flex justify-between">
                                    <span className="text-xl">{item.email}</span>
                                    <span>{item.time}</span>
                                </div>
                                <p className="text-sm text-slate-500">{item.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="col-span-7">
                <div className="h-14 bg-slate-100">

                </div>
            </div>
        </div>
    )
}

export default Index
