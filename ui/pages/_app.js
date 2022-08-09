import '../styles/globals.css'
import {UserProvider} from '../context/useUserContext'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
    return (
        <UserProvider>
            <Head>
                <title>Cetan Apps</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Component {...pageProps} />
        </UserProvider>
    )
}

export default MyApp
