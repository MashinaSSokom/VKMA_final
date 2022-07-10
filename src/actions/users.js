import axios from "axios";
import {getUserById} from "../store/reducers/launchParams";
import {GET_USER_BY_ID} from "../store/actionTypes";
import bridge from "@vkontakte/vk-bridge";


axios.defaults.baseURL = 'http://localhost:5000'


export const fetchUserById = ({id, params}) => {
    return async (dispatch) => {
        console.log(id, params)
        const response = await axios.get(`/api/user/${id}`)
        // console.log(response)
        if (response.data) {
            dispatch({type: GET_USER_BY_ID, payload: response.data})
        }
        else {
            const accessToken = await bridge.send("VKWebAppGetAuthToken", {
                "app_id": params.app_id,
                scope: ["wall", "pages"]
            })
            const userInfo = await bridge.send("VKWebAppCallAPIMethod", {
                "method": "users.get",
                "request_id": "abababab",
                "params": {"user_ids": id, "v": "5.131", "access_token": accessToken.access_token}
            });
            const postResponse = await axios.post(`/api/user/${id}`, {"name": userInfo.response[0].first_name})
            dispatch({type: GET_USER_BY_ID, payload: postResponse.data})
        }
    }
}

export const createUserById = (id, name) => {
    return async (dispatch) => {
        const response = await axios.post(`http://localhost:5000/api/user/${id}`, {"name": name})
        console.log('Создал пользователя', response.data)
        dispatch(getUserById(response.data))
    }
}