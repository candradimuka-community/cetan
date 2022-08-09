import { useEffect, useState } from "react";
import Router from "next/router";
import UseUserContext from "../context/useUserContext";
import NavLeft from "../components/navLeft";

const Index = () => {
    const {action, state} = UseUserContext()
    const [showLeftExtraNav, setShowLeftExtraNav] = useState(false)
    
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
        <div className="grid grid-cols-10">
            <div className="col-span-3">
                <NavLeft 
                    showLeftExtraNav={showLeftExtraNav}
                    setShowLeftExtraNav={setShowLeftExtraNav}
                />
            </div>
            <div className="col-span-7 bg-slate-300">2</div>
        </div>
    )
}

export default Index
