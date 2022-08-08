import '../styles/globals.css'
import UseUserContext, {UserProvider} from '../context/useUserContext'

function MyApp({ Component, pageProps }) {
    const tes = UseUserContext()
    console.log(tes)
    return (
        <UserProvider>
            <Component {...pageProps} />
        </UserProvider>
    )
}

export default MyApp
