// const BASE_URL = 'http://users.theyounus.com'
const BASE_URL = 'http://beta.1connect.in'
const Call = (uri, method, data=null, token=null, type='formData') => {
    let url = BASE_URL + uri
    let headers = {}
    let payload = {}

    // Create headers
    headers['Accept'] = 'application/json'
    // headers['Content-Type'] = 'application/json'

    if(token) {
        headers['Authorization'] = 'Bearer ' + token
    }

    // Create payload
    payload['method'] = method
    payload['headers'] = headers
    payload['cache'] = 'no-cache'

    if (data){
        if(type=='formData') {
            let formData = new FormData();
            for (let key in data) {
                formData.append(key, data[key])
            }
            payload['body'] = formData
        }

        else if(type=='raw'){
            console.log("type raw")
            payload['body'] = JSON.stringify(data);
        }
    }
    console.log("with... ", payload)
    console.log("url ", url)

    return (
        fetch(url, payload)
        .then(response => {

            return response.json()
        })
        .then(response => {

            return response;
        })
        .catch(error => {

            throw(error)
        }))
}

export default Call;
