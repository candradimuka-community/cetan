import UseUserContext from "../context/useUserContext"
import {DotsVerticalIcon, SearchIcon, UserIcon, XCircleIcon } from '@heroicons/react/outline'
import FormEl from "./formEl"
import { useState } from "react"
const NavRight = () => {
    const { action, state} = UseUserContext()
    if(state.chatRoom.id === 0 ){
        return (<></>)
    }
    return (
        <>
            <div className="h-full w-full flex justify-between items-center px-5">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-50 my-3 h-12 w-12 rounded-full flex justify-center items-center">
                        <UserIcon className="h-6 w-6 text-black"/>
                    </div>
                    <p>{state.chatRoom.opponent.email}</p>
                </div>
                <div className="flex items-center">
                    <div onClick={(e)=>{
                        e.stopPropagation()
                        action.setSearchBox(!state.searchBox)
                        action.setShowLeftExtraNav(false)
                        action.setOptionBox(false)
                        }} className="h-10 w-10 rounded-full flex justify-center items-center border-slate-100 border-2 hover:border-slate-700 active:bg-slate-600">
                        <SearchIcon className="w-5 h-5" />
                    </div>
                    <div onClick={(e)=>{
                        e.stopPropagation()
                        action.setOptionBox(!state.optionBox)
                        action.setShowLeftExtraNav(false)
                        action.setSearchBox(false)
                        }} className="h-10 w-10 rounded-full flex justify-center items-center border-slate-100 border-2 hover:border-slate-700 active:bg-slate-600">
                        <DotsVerticalIcon className="w-5 h-5"/>
                    </div>
                </div>
            </div>
            {state.searchBox === true && (
                <div className="bg-slate-50 px-5 pb-5 absolute w-1/2 top-full left-1/4 mt-2 rounded-full" onClick={(e)=>{
                    e.stopPropagation()
                }}> 
                    <FormEl
                        type="search"
                        id="search"
                        placeholder="Search Message"
                        // onChange={e=>setSearch(e.target.value)}
                        // value={null}
                    />
                    <XCircleIcon className="w-7 h-7 absolute -top-2 right-2" onClick={()=>action.setSearchBox(false)}/>
                </div>
            )}
            {state.optionBox === true && (
                <div className="bg-white border border-slate-200 absolute w-1/4 top-full right-5 mt-2 rounded-bl-md px-3 py-2 flex flex-col gap-2" onClick={(e)=>{
                        e.stopPropagation()
                    }}> 
                    <p className="hover:cursor-pointer">Lihat Profil</p>
                    <p className="hover:cursor-pointer">Bersihkan Chat Saya</p>
                    <p className="hover:cursor-pointer">Tinggalkan Pesan</p>
                </div>
            )}
        </>
    )
}

export default NavRight