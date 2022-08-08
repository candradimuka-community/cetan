import { useEffect } from "react";
import Router from "next/router";

const Index = () => {
    useEffect(() => {
        const token = localStorage.getItem('token')
        if(!token){
            Router.push('/auth')
        }
    },[]);
    return (
        <></>
    )
}

export default Index
