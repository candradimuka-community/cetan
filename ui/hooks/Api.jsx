import axios from 'axios'
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_HOST;


export const Api = async ({
    path = '',
    method = 'GET',
    data = null,
    token = null,
    formData = false
}) => {
    const headers = {
        'Content-Type' : formData === true ? 'multipart/form-data' : 'application/json',
        Accept : formData === true ? 'multipart/form-data' : 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    if(token){
        headers.Authorization = 'Bearer ' + token
    }
    const response = await axios({
        url : path,
        method,
        data,
        headers,
    }).catch((err) => err.response);

    if(response.status === 401){
        // code if unauthenticated
        // localStorage.removeItem('token')
        // if(typeof window !== 'undefined'){
        //     window.location.reload()
        // }
        return {
            status :401,
            data: {
                status : 'unauthenticated'
            }
        }
    } else {
        return response
    }
}