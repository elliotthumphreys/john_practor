import config from '../../config.json'

const CreateTokenCookie = (token, days) => {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = "jwt=" + token  + expires + "; path=/";
}

const CallApi = async ({endpoint, body, method, useHeaders, headers, useToken = true}) => {
    let payload = {
        headers: useHeaders && {
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
            ...headers},
        method
    }

    if(body){
        payload.body = body
    }

    if(useToken){
        let token = document.cookie.split(';').find(cookie => cookie.split('=')[0] =='jwt')
        token = token? token.split('=')[1] : ''
        payload.headers = {...payload.headers, Authorization: `Bearer ${token}`}
    }

    return await fetch(`${config.ApiURL}${endpoint}`, payload)
}

export const AuthenticateUser = async (username, password) => {
    let response, responseObject

    try{
        response = await CallApi({
            endpoint: 'users/authenticate', 
            body: JSON.stringify({ username, password }), 
            useHeaders: true,
            method: 'POST', 
            useToken: false
        })
        responseObject = await response.json()
    }catch(error){
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
    try{
        const response = await CallApi({
            endpoint: 'users/authenticate-token', 
            method: 'GET',
            useHeaders: true
        })

        const { authenticated } = await response.json()
        
        return {
            authenticated: authenticated || false 
        }
    }catch(error){
        return {
            authenticated: false
        }
    }
}

export const GetHats = async () => {
    try{
        const response = await CallApi({
            endpoint: 'hats/', 
            method: 'GET'
        })
        const hats = await response.json()
        
        return {
            authenticated: true,
            hats
        }
    }catch(error){
        return {
            authenticated: false, 
            hats: []
        }
    }
}

export const GetHat = async id => {
    try{
        const response = await CallApi({
            endpoint: `hats/${id}`, 
            method: 'GET'
        })
        const hat = await response.json()

        return {
            authenticated: true,
            hat
        }
    }catch(error){
        return {
            authenticated: false,
            hat: {}
        }
    }
}

export const GetContent = async () => {
    try{
        const response = await CallApi({
            endpoint: `content/`, 
            method: 'GET'
        })
        const content = await response.json()

        return {
            authenticated: true,
            content
        }
    }catch(error){
        return {
            authenticated: false,
            content: {}
        }
    }
}

export const DeleteHat = async id => {
    try{
        const response = await CallApi({
            endpoint:`hats/${id}`, 
            method: 'DELETE'
        })
        const json = await response.json()
        
        return {
            response: 'success'
        }
    }catch(error){
        return {
            authenticated: false, 
            response: ''
        }
    }
}

export const CreateHat = async ({title, description, price, category, credit, images}) => {
    const formData = new FormData();

    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('category', category)
    formData.append('credit', credit)

    for(let i = 0; i < images.length; i++){
        formData.append('images', images[i])
    }

    try{
        let response = await CallApi({
            endpoint: 'hats/add', 
            body: formData,
            useHeaders: false,  
            method: 'POST'})

        response = await response.json()

        return {
            success: response.message == 'success'
        }
    }catch(error){
        return {
            success: false
        }
    }
}

export const UpdateHat = async ({id, title, description, price, category, credit, deletedImages, images}) => {
    const formData = new FormData();

    formData.append('title', title || '')
    formData.append('description', description || '')
    formData.append('price', price || 0)
    formData.append('category', category || '')
    formData.append('credit', credit || '')
    formData.append('deletedImages', deletedImages || [])

    for(let i = 0; i < images.length; i++){
        formData.append('images', images[i])
    }

    try{
        let response = await CallApi({
            endpoint: `hats/${id}`, 
            body: formData,
            useHeaders: false,  
            method: 'PUT'})

        const { message, hat } = await response.json()

        return {
            success: message == 'success',
            hat: hat
        }
    }catch(error){
        return {
            success: false
        }
    }
}

export const UpdateContent = async (formData) => {
    try{
        let response = await CallApi({
            endpoint: `content`, 
            body: formData,
            useHeaders: false,  
            method: 'PUT'})

        const { message, content } = await response.json()

        console.log(message, JSON.stringify(content))

        return {
            success: message == 'success',
            data: content.data
        }
    }catch(error){
        return {
            success: false
        }
    }
}