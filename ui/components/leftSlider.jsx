import { ArrowCircleLeftIcon, ArrowRightIcon } from "@heroicons/react/outline"
import FormEl from "./formEl"
import UseUserContext from "../context/useUserContext"
const LeftSlider = ({
    leftSlider,
    setLeftSlider
}) => {
    const {action, state} = UseUserContext()
    return (
        <div className={`bg-slate-200 absolute top-0 -left-full h-screen w-full z-10 duration-1000 ${leftSlider?'translate-x-full':''}`}>
            <div className=" flex justify-between items-center h-14 px-4">
                <p className="text-xl text-slate-700">User List</p>
                <ArrowCircleLeftIcon onClick={()=>setLeftSlider(!leftSlider)} className="h-7 w-7 text-slate-700"/>
            </div>
            <div className="bg-slate-50 px-3 flex items-center justify-between gap-3">
                <div className="pb-5 w-full">
                    <FormEl
                        type="search"
                        id="search"
                        placeholder="search user"
                        onChange={e=>action.setParam(e.target.value)}
                        value={state.param}
                    />
                </div>
                <button onClick={()=>action.getUsers(state.param)} className="bg-blue-400 px-4 h-10 rounded-full text-white hover:bg-blue-600 hover:text-slate-100">Search</button>
            </div>
            <div className="overflow-y-auto scrollbar" style={{
                height: state.height,
                maxHeight: state.height
            }}>
                {state.users.map((item, index)=>(
                    <div onClick={()=>{
                        action.createRoom(item.id)
                        setLeftSlider(false)
                        }} className="bg-white p-4 flex justify-between items-center m-1 rounded-sm hover:cursor-pointer hover:bg-slate-100 active:bg-slate-200" key={index}>
                        <p className="text-xl">{item.email}</p>
                        <ArrowRightIcon className="w-5 h-5 text-black" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LeftSlider