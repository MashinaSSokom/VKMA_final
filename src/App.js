import React, {useState, useEffect} from 'react';
import bridge from '@vkontakte/vk-bridge';
import {View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Persik from './panels/Persik';
import {useDispatch, useSelector} from "react-redux";
import {initLaunchParams} from "./store/actionTypes";

const App = () => {
    const [scheme, setScheme] = useState('bright_light')
    const [activePanel, setActivePanel] = useState('home');
    const [fetchedUser, setUser] = useState(null);
    const [popout, setPopout] = useState(<ScreenSpinner size='large'/>);

    const dispatch = useDispatch()
    const params = useSelector(state => state.launchParams.params)

    useEffect(() => {
        bridge.subscribe(({detail: {type, data}}) => {
            if (type === 'VKWebAppUpdateConfig') {
                setScheme(data.scheme)
            }
            // https://user128784852-m2iyllbi.wormhole.vk-apps.com/?vk_access_token_settings=&vk_app_id=8213398
            //     // &vk_are_notifications_enabled=0&vk_has_profile_button=1&vk_is_app_user=1
            //     // &vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web
            //     // &vk_profile_id=330904782&vk_ref=third_party_profile_buttons
            //     // &vk_ts=1657377394&vk_user_id=128784852&sign=Ngiro0qlpyKfVYR6-skW2NkCsSu5pkGfMvO0hgVAdDY


            // https://user128784852-m2iyllbi.wormhole.vk-apps.com/?vk_access_token_settings=
            //     // &vk_app_id=8213398&vk_are_notifications_enabled=0&vk_has_profile_button=1
            //     // &vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_ts=1657377330
            //     // &vk_user_id=128784852&sign=fXngP5ejirzeXNV1fgKcwvjW7huCb4ReipxYztIgd88
        });
        const startUrl = new URL(window.location.href)
        const params = {
            user_id: Number(startUrl.searchParams.get('vk_user_id')),
            vk_profile_id: Number(startUrl.searchParams.get('vk_profile_id')),
            vk_has_profile_button: Number(startUrl.searchParams.get('vk_has_profile_button')),
            vk_profile_button_forbidden: Number(startUrl.searchParams.get('vk_profile_button_forbidden')),
        }
        dispatch({type: initLaunchParams, payload: params})
        setPopout(null)

        //     async function fetchData() {
        //         bridge.send("VKWebAppGetLaunchParams").then((res) => {
        //
        //         })
        //         const user = await bridge.send('VKWebAppGetUserInfo');
        //         setUser(user);
        //         setPopout(null);
        //     }
        //
        //     fetchData();
    }, []);

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
                                {/*<Persik id='persik' go={go}/>*/}
                            </View>
                        </SplitCol>
                    </SplitLayout>
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    );
}

export default App;
