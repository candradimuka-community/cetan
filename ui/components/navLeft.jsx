const NavLeft = ({
    showLeftExtraNav,
    setShowLeftExtraNav
}) => {
    return (
        <section id="nav-left" className="flex justify-between items-center px-5 py-2 bg-slate-100 relative h-14">
            <div className="bg-slate-900 h-10 w-10 rounded-full">

            </div>
            <div onClick={(e)=>{
                e.stopPropagation()
                setShowLeftExtraNav(!showLeftExtraNav)
                }} className={`h-10 w-10 rounded-full flex justify-center border-slate-100 border-2 hover:border-slate-700 ${showLeftExtraNav ? 'bg-slate-600':'active:bg-slate-600'}`}>
                <div className="flex flex-col justify-evenly">
                    <div className="h-1 w-1 rounded-full bg-black"></div>
                    <div className="h-1 w-1 rounded-full bg-black"></div>
                    <div className="h-1 w-1 rounded-full bg-black"></div>
                </div>
            </div>
            {showLeftExtraNav && (
                <div className="absolute bg-slate-50 rounded-md border border-slate-400 w-1/2 px-3 py-2 top-12 right-5 flex flex-col gap-2" onClick={(e)=>{
                    e.stopPropagation()
                }}>
                    <p className="hover:cursor-pointer">Account Setting</p>
                    <p className="hover:cursor-pointer">Log Out</p>
                </div>
            )}
        </section>
    )
}
export default NavLeft