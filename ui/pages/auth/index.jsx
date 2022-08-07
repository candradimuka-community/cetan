import { useEffect, useState } from "react"
import FormEl from "../../components/formEl"
import Title from "../../components/title"
import { Api }  from "../../hooks/Api"
import Router from "next/router"

const Index = () => {
    const [step, setStep] = useState(1)
    const [form, setForm] = useState({
        email:'',
        code:'',
        password:'',
        rePassword:''
    })
    const [time, setTime] = useState(new Date())
    const [diffTime, setDiffTime] = useState(0)
    const [watch, setWatch] = useState('0:0')
    const [cbPassword, setCbPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [pw, setPw] = useState(true)
    const resendCode = async ({
            forgetPassword=false
        }) => {
        setLoading(true)
        setPw(forgetPassword)
        const { status, data } = await Api({
            path: "code/"+form.email,
            method: "POST",
            data: {
                forgetPassword
            }
        })
        if (status === 200){
            setTime(new Date(data.resend_time))
            setDiffTime(Math.floor((new Date(data.resend_time) - new Date())/1000))
            if(forgetPassword === true){
                setStep(2)
            }
            setLoading(false)
        } else {
            console.log(data.status)
            setLoading(false)
        }
    }
    const send = async () => {
        setLoading(true)
        if(step === 1){
            const {status, data} = await Api({
                path: "register",
                method: "POST",
                data: form
            })
            if(status === 200){
                setStep(4)
                setLoading(false)
            } else if (status === 201){
                setStep(2)
                setLoading(false)
            } else {
                console.log(data.status)
                setLoading(false)
            }
        } else if (step === 2){
            const {status, data} = await Api({
                path: "code",
                method: "POST",
                data: form
            })
            if(status === 200){
                setStep(3)
                setLoading(false)
            } else {
                console.log(data.status)
                setLoading(false)
            }
        } else if (step === 3){
            const {status, data} = await Api({
                path: pw === true ? "reset-password/"+form.email : "set-password",
                method: "POST",
                data: form
            })
            if(status === 200){
                localStorage.setItem('token', data.token)
                setLoading(false)
                if( typeof window !== "undefined"){
                    window.location.reload()
                }
            } else {
                console.log(data.status)
                setLoading(false)
            }
        } else if (step === 4){
            const {status, data} = await Api({
                path: "login",
                method: "POST",
                data: form
            })
            if(status === 200){
                localStorage.setItem('token', data.token)
                setLoading(false)
                if( typeof window !== "undefined"){
                    window.location.reload()
                }
            } else {
                console.log(data.status)
                setLoading(false)
            }
        }
        
    }
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.id]:e.target.value
        })
    }
    const validateEmail = (email) => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token){
            Router.push('/')
        }
    },[]);
    useEffect(()=>{
        setTimeout(()=>{
            setDiffTime(Math.floor((new Date(time) - new Date())/1000))
            setWatch(`${Math.floor(diffTime/60)}:${diffTime%60}`)
        }, 1000)
    }, [diffTime])
    return (
        <div className=" bg-slate-200">
            <div className="w-full min-h-screen flex justify-center items-center md:w-6/12 mx-auto">
                <div className="shadow-lg w-full py-10 mx-5 px-10 rounded-lg bg-slate-100">
                    <Title>Register <span className="text-blue-800">Or</span> Login</Title>
                    {step === 1 && (
                        <FormEl
                            type="email"
                            id="email"
                            placeholder="Type Your Email"
                            onChange={handleChange}
                            value={form.email}
                            error={form.email.length > 1 && !validateEmail(form.email)}
                            errorMessage="Not Valid Email"
                        />
                    )}
                    {step === 2 && (
                        <FormEl
                            type="number"
                            id="code"
                            placeholder="Type Your Code"
                            onChange={handleChange}
                            error={form.code > 0 && form.code < 100000 || form.code > 999999}
                            errorMessage="Code Always Between 100000 ~ 999999. Check Your Mail"
                        />
                    )}
                    {step === 3 && (
                        <>
                            <FormEl
                                type={cbPassword ? 'text':'password'}
                                id="password"
                                placeholder="Type Your Password"
                                onChange={handleChange}
                                error={form.password.length > 0 && form.password.length < 8}
                                errorMessage="Password must at least 8 character"
                            />
                            <FormEl
                                type={cbPassword ? 'text':'password'}
                                id="rePassword"
                                placeholder="Re-Type Your Password"
                                onChange={handleChange}
                                error={form.rePassword.length > 0 && form.password !== form.rePassword}
                                errorMessage="Password not same"
                            />
                        </>
                    )}
                    {step === 4 && (
                        <>
                            <FormEl
                                type={cbPassword ? 'text':'password'}
                                id="password"
                                placeholder="Type Your Password"
                                onChange={handleChange}
                                error={form.password.length > 0 && form.password.length < 8}
                                errorMessage="Password must at least 8 character"
                            />
                        </>
                    )}
                    <div className="flex mt-5">
                        {(step === 3 || step === 4 ) && (
                            <span>
                                <input type="checkbox" className="ml-5" onClick={()=>setCbPassword(!cbPassword)} value={cbPassword} checked={cbPassword} id="cbPassword"/>
                                <span className="ml-2 text-slate-600 text-sm" onClick={()=>setCbPassword(!cbPassword)}>See Password</span>
                            </span>
                        )}
                        {step === 2 && (
                            <span className="text-blue-500 ml-5">
                                Didn't Receive Code ? <button disabled={diffTime > 0 || loading} onClick={()=>resendCode({forgetPassword:false})} className="text-white bg-blue-500 px-2 p-1 rounded-full hover:cursor-pointer hover:bg-blue-600">{diffTime > 0 ? watch: 'Resend'}</button>
                            </span>
                        )}
                        <button disabled={step === 1 && !validateEmail(form.email) || step === 2 && form.code < 100000 || step === 2 && form.code > 999999 || step === 3 && form.password !== form.rePassword || step === 3 && form.password.length < 8 || loading || step === 4 && form.password.length < 8} className="py-2 px-5  rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 block ml-auto" onClick={send}>{loading ? 'Loading...':'Send'}</button>
                    </div>
                    {step === 4 && (
                        <span className="text-xs ml-5">
                            Forgot Password ? <button className="text-white bg-blue-500 px-2 p-1 rounded-full hover:cursor-pointer hover:bg-blue-600" onClick={()=>resendCode({forgetPassword:true})} disabled={loading}>Reset Password</button>
                        </span>
                    )}
                </div>
            </div>  
        </div>
    )
}

export default Index