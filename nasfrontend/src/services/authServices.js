import { baseServices } from "./BaseServiceCalls";

const register = (data) => {
    const response = baseServices.postData('register/', data)
    return response
}

const login = (data) => {
    const response = baseServices.postData('login/', data)
    return response
}

export const authServices = {register, login}