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

    }, [])

    useEffect(() => {
        bridge.subscribe(({detail: {type, data}}) => {
            if (type === 'VKWebAppUpdateConfig') {
                setScheme(data.scheme)
            }
        });

        async function fetchData() {
            bridge.send("VKWebAppGetLaunchParams").then((res) => {
                const payload = {
                    user_id: res.vk_user_id,
                    vk_profile_id: res?.vk_profile_id,
                    vk_has_profile_button: res?.vk_profile_button_forbidden,
                    vk_profile_button_forbidden: res?.vk_profile_button_forbidden
                }
                dispatch({type: initLaunchParams, payload: payload})
                console.log('params', params)
            })
            const user = await bridge.send('VKWebAppGetUserInfo');
            setUser(user);
            setPopout(null);
        }

        fetchData();
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
