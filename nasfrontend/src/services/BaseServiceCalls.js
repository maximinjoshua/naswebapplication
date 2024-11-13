const getData = async (url, params = {}) => {
    return await axios.get(
        url,
        params
    ).then(function (response) {
        console.log("response recieved", response)
    });
}

const postData = async (url, bodyContent = {}) => {
    return await axios.get(
        url,
        bodyContent
    ).then(function (response) {
        console.log("response recieved", response)
    });
}

export default (getData, postData)
