import axios from "axios"

const serverURL= "http://localhost:8000/"

const getData = async (url, params = {}) => {
    return await axios.get(
        `${serverURL}${url}`,
        params
    ).then(function (response) {
        console.log("response recieved", response)
        return response
    });
}

const postData = async (url, bodyContent = {}, multipart = false) => {

    const headers = multipart ?
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        } : {}

    return await axios.post(
        `${serverURL}${url}`,
        bodyContent,
        headers
    ).then(function (response) {
        console.log("response recieved", response)
        return response
    });
}

export const baseServices = {getData, postData}
