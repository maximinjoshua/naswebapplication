import { baseServices } from "./BaseServiceCalls"

const uploadFiles = async(data) => {
    const response = await baseServices.postData("uploadfiles", data)
    return response
}

const createPermissionEntry = async(data) => {
    const response = await baseServices.postData("createpermission", data)
    return response
}


export const fileServies = {uploadFiles, createPermissionEntry}