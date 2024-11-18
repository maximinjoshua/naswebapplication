import { baseServices } from "./BaseServiceCalls"

const getProfileInfo = async(params) => {
    const response = await baseServices.getData(`getuserprofile?user_id=${params.user_id}`)
    return response
}
export const userInfoServices = {getProfileInfo}