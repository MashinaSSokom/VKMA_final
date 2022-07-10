import React, {useState, useEffect} from 'react';
import bridge from '@vkontakte/vk-bridge';
import {View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Persik from './panels/Persik';
import {useDispatch, useSelector} from "react-redux";
import {initLaunchParams} from "./store/actionTypes";
import {fetchUserById} from "./actions/users";
import {setLoadingFalse, setLoadingTrue} from "./store/reducers/launchParams";

const App = () => {
    const [scheme, setScheme] = useState('bright_light')
    const [activePanel, setActivePanel] = useState('home');
    const [fetchedUser, setUser] = useState(null);
    const [popout, setPopout] = useState(<ScreenSpinner size='large'/>);

    const dispatch = useDispatch()
    const paramsState = useSelector(state => state.launchParams.params)
    const userState = useSelector(state => state.launchParams.user)
    useEffect(async () => {
        bridge.subscribe(({detail: {type, data}}) => {
            if (type === 'VKWebAppUpdateConfig') {
                setScheme(data.scheme)
            }
            // https://user128784852-m2iyllbi.wormhole.vk-apps.com/?vk_access_token_settings=&vk_app_id=821339
            // https://user128784852-m2iyllbi.wormhole.vk-apps.com/?vk_access_token_settings=
            //     // &vk_app_id=8213398&vk_are_notifications_enabled=0&vk_has_profile_button=1
            //     // &vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_ts=1657377330
            //     // &vk_user_id=128784852&sign=fXngP5ejirzeXNV1fgKcwvjW7huCb4ReipxYztIgd88
        });
    }, []);

    useEffect(() => {
        // Получение параметров из запроса

        const startUrl = new URL(window.location.href)
        console.log(startUrl.search)
        const params = {
            app_id: Number(startUrl.searchParams.get('vk_app_id')),
            user_id: Number(startUrl.searchParams.get('vk_user_id')),
            vk_profile_id: Number(startUrl.searchParams.get('vk_profile_id')),
            vk_has_profile_button: Number(startUrl.searchParams.get('vk_has_profile_button')),
            vk_profile_button_forbidden: Number(startUrl.searchParams.get('vk_profile_button_forbidden')),
        }
        dispatch(setLoadingTrue())
        dispatch(fetchUserById({id: params?.vk_profile_id ? params.vk_profile_id : params.user_id, params: params}))
        dispatch({type: initLaunchParams, payload: params})

        console.log('fetchedUser', userState)
        // const userInfo = await bridge.send("VKWebAppCallAPIMethod", {
        //     "method": "users.get",
        //     "request_id": "32test",
        //     "params": {"user_ids": params?.vk_profile_id, "v": "5.131", "access_token": accessToken.access_token}
        // });
        // const userInfo = await bridge.send("VKWebAppCallAPIMethod", {
        //     "method": "users.get",
        //     "request_id": "32test",
        //     "params": {"user_ids": params?.user_id, "v": "5.131", "access_token": accessToken.access_token}
        // });
        // console.log(userInfo)
        // dispatch({type: initLaunchParams, payload: params})
        // const accessToken = await bridge.send("VKWebAppGetAuthToken", {
        //     "app_id": params.app_id,
        //     scope: ["wall", "pages"]
        // });
        // if (params?.vk_profile_id) {
        //     dispatch(fetchUserById(params.vk_profile_id))
        //     const userInfo = await bridge.send("VKWebAppCallAPIMethod", {
        //         "method": "users.get",
        //         "request_id": "32test",
        //         "params": {"user_ids": params?.vk_profile_id, "v": "5.131", "access_token": accessToken.access_token}
        //     });
        // } else {
        //     await dispatch(fetchUserById(params.user_id))
        //     if (!!userState) {
        //         console.log('ababababab')
        //         console.log(userState.id)
        //     }
        //     console.log('user', userState)
        //     const userInfo = await bridge.send("VKWebAppCallAPIMethod", {
        //         "method": "users.get",
        //         "request_id": "32test",
        //         "params": {"user_ids": params?.user_id, "v": "5.131", "access_token": accessToken.access_token}
        //     });
        //     console.log(userInfo)
        // }
        // console.log('params', paramsState)
        setPopout(null)
        dispatch(setLoadingFalse())

    }, [])

    const go = e => {
        setActivePanel(e.currentTarget.dataset.to);
    };

    return (
        <ConfigProvider scheme={scheme}>
            <AdaptivityProvider>
                <AppRoot>
                    <SplitLayout popout={popout}>
                        <SplitCol>
                            <View activePanel={activePanel}>
                                <Home id='home' fetchedUser={fetchedUser} go={go}/>
                            </View>
                        </SplitCol>
                    </SplitLayout>
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    );
}

export default App;
