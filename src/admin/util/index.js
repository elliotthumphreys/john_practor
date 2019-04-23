import config from '../../config.json'
import { fileURLToPath } from 'url';

const CreateTokenCookie = (token, days) => {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = "jwt=" + token + expires + "; path=/";
}

const CallApi = async ({ endpoint, body, method, useHeaders, headers, useToken = true }) => {
    let payload = {
        headers: useHeaders && {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...headers
        },
        method
    }

    if (body) {
        payload.body = body
    }

    if (useToken) {
        let token = document.cookie.split(';').find(cookie => cookie.split('=')[0] == 'jwt')
        token = token ? token.split('=')[1] : ''
        payload.headers = { ...payload.headers, Authorization: `Bearer ${token}` }
    }

    return await fetch(`${config.ApiURL}${endpoint}`, payload)
}

export const AuthenticateUser = async (username, password) => {
    let response, responseObject

    try {
        response = await CallApi({
            endpoint: 'users/authenticate',
            body: JSON.stringify({ username, password }),
            useHeaders: true,
            method: 'POST',
            useToken: false
        })
        responseObject = await response.json()
    } catch (error) {
        return {
            authenticated: false,
            token: null,
            message: 'Network connection failure: please try again later when we have fixed the problem'
        }
    }

    response.ok && responseObject.hasOwnProperty('token') && CreateTokenCookie(responseObject.token, 5)

    return {
        authenticated: responseObject.hasOwnProperty('token'),
        token: responseObject.hasOwnProperty('token') ? responseObject.token : null,
        message: responseObject.hasOwnProperty('message') ? responseObject.message : ''
    }
}

export const CheckTokenAuthentication = async () => {
    try {
        const response = await CallApi({
            endpoint: 'users/authenticate-token',
            method: 'GET',
            useHeaders: true
        })

        const { authenticated } = await response.json()

        return {
            authenticated: authenticated || false
        }
    } catch (error) {
        return {
            authenticated: false
        }
    }
}

export const GetHats = async () => {
    try {
        const response = await CallApi({
            endpoint: 'hats/',
            method: 'GET'
        })
        const hats = await response.json()

        return {
            authenticated: true,
            hats
        }
    } catch (error) {
        return {
            authenticated: false,
            hats: []
        }
    }
}

export const GetHat = async id => {
    try {
        const response = await CallApi({
            endpoint: `hats/${id}`,
            method: 'GET'
        })
        const hat = await response.json()

        return {
            authenticated: true,
            hat
        }
    } catch (error) {
        return {
            authenticated: false,
            hat: {}
        }
    }
}

export const GetContent = async () => {
    try {
        const response = await CallApi({
            endpoint: `content/`,
            method: 'GET'
        })
        const content = await response.json()

        return {
            authenticated: true,
            content
        }
    } catch (error) {
        return {
            authenticated: false,
            content: {}
        }
    }
}

export const DeleteHat = async id => {
    try {
        const response = await CallApi({
            endpoint: `hats/${id}`,
            method: 'DELETE'
        })
        const json = await response.json()

        return {
            response: 'success'
        }
    } catch (error) {
        return {
            authenticated: false,
            response: ''
        }
    }
}

export const CreateHat = async data => {
    let jsonData = { ...data, images: Array.from(data.images).map(image => image.type) }

    try {
        let { success, hat, presignedUrls } = await submitData(`${config.ApiURL}hats`, jsonData)

        if (success) {
            let presignedImageUrls = presignedUrls.images

            for (let index = 0; index < data.images.length; index++) {
                const file = data.images[index], { url } = presignedImageUrls[index]

                const imageUploadResponse = await uploadToS3(url, file)

                success = success && imageUploadResponse
            }
        }

        return {
            success: success,
            hat
        }
    } catch (error) {
        return {
            success: false
        }
    }
}

export const UpdateHat = async (id, data) => {
    const jsonData = {
        ...data,
        images: Array.from(data.images).map(image => image.type)
    }

    try {
        let { success, hat, presignedUrls } = await submitData(`${config.ApiURL}hats/${id}`, jsonData, 'PUT')

        console.log(success, hat, presignedUrls)

        if (success) {
            let presignedImageUrls = presignedUrls.images

            for (let index = 0; index < data.images.length; index++) {
                const file = data.images[index], { url } = presignedImageUrls[index]

                const imageUploadResponse = await uploadToS3(url, file)

                success = success && imageUploadResponse
            }
        }

        return {
            success,
            hat
        }

    } catch (error) {
        return {
            success: false
        }
    }
}

export const UpdateContent = async (data, files) => {
    console.log(data)
    // try {
    //     let { success, content, presignedUrls } = await submitData(`${config.ApiURL}content`, data, 'PUT')

    //     if (success) {
    //         for (let index = 0; index < presignedUrls.length; index++) {
    //             const { id, url } = presignedUrls[index]
    //             const { file } = files.find(_ => _.id = id)

    //             const imageUploadResponse = await uploadToS3(url, file)

    //             success = success && imageUploadResponse
    //         }
    //     }

    //     return {
    //         success: success,
    //         data: content.data
    //     }
    // } catch (error) {
    //     return {
    //         success: false
    //     }
    // }
}

async function submitData(url = '', data = {}, method = 'POST') {
    let token = document.cookie.split(';').find(cookie => cookie.split('=')[0] == 'jwt')
    token = token ? token.split('=')[1] : ''

    // Default options are marked with *
    return fetch(url, {
        method, // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    }).then(response => {
        console.log(response)
        return response.json()
    }); // parses JSON response into native Javascript objects 
}

async function uploadToS3(url = '', file) {
    return fetch(url, {
        method: 'PUT',
        headers: {
            "Content-Type": file.type
        },
        body: file
    }).then(_ => {
        console.log(_)
        return _.status === 200
    })
}