import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import {
    Panel,
    PanelHeader,
    Header,
    Button,
    Group,
    Cell,
    Div,
    Avatar,
    Input,
    FormLayout,
    FormItem, PanelSpinner, Link, CardGrid, Card, ContentCard
} from '@vkontakte/vkui';
import {useDispatch, useSelector} from "react-redux";
import bridge from "@vkontakte/vk-bridge";
import {initLaunchParams} from "../store/actionTypes";
import {Dropdown} from "@vkontakte/vkui/unstable";
import {createSignByUserId, fetchUserById} from "../actions/users";
import {setLoadingFalse, setLoadingTrue} from "../store/reducers/launchParams";
import axios from "axios";
import persik from '../img/persik.png';

import './Home.css';


function Cells(props) {
    return null;
}

Cells.propTypes = {children: PropTypes.node};
const Home = ({id, go, fetchedUser}) => {

    const [shown, setShown] = React.useState(false);
    const [signText, setSignText] = React.useState('')
    const [signImg, setSignImg] = React.useState(null)
    const dispatch = useDispatch()
    const params = useSelector(state => state.launchParams.params)
    const user = useSelector(state => state.launchParams.user)
    const loading = useSelector(state => state.launchParams.loading)

    // setParams()
    useEffect(async () => {
        console.log(params, user, loading)
    },)


    const addToProfile = async () => {
        console.log("writeSign ")
        let res = await bridge.send("VKWebAppAddToProfile", {"ttl": 0})
        console.log('Добавлени кнопки', res)
        params.vk_has_profile_button = 1
        dispatch({type: initLaunchParams, payload: params})
        console.log('Обновленные параметры', params)

    }
    const removeFromProfile = async () => {
        console.log("removeSign ")
        let res = await bridge.send("VKWebAppRemoveFromProfile")
        console.log('Удаление кнопки', res)
        params.vk_has_profile_button = 0
        dispatch({type: initLaunchParams, payload: params})
        console.log('Обновленные параметры', params)
    }

    const writeSign = async () => {
        dispatch(setLoadingTrue())

        console.log('WriteSign', signText, signImg)
        setShown(false)
        const formData = new FormData
        formData.append('userId', params.vk_profile_id)
        formData.append('text', signText)
        formData.append('from', params.user_id)
        formData.append('img', signImg)

        const res = await createSignByUserId(formData)
        if (res === 'OK') {
            dispatch(fetchUserById({id: params?.vk_profile_id ? params.vk_profile_id : params.user_id, params: params}))
        } else {
            console.log('Автограф уже существует')
        }
        setSignImg(null)
        setSignText('')
        dispatch(setLoadingFalse())

    }

    return (<Panel id={id}>
            <PanelHeader>{params?.vk_profile_id && user
                ? `Галерея пользователя ${user.name}`
                : `Моя галерея`}
            </PanelHeader>
            <Div>

                <Group>
                    <CardGrid size={"s"}>
                        {user?.signs && user?.signs?.length !== 0
                            ? user.signs.map((sign) =>
                                <ContentCard key={sign.id}

                                             style={{
                                                 width: "200px",
                                                 height: "280px",
                                                 backgroundSize: "contain"
                                             }}
                                             header={sign.text}
                                             subtitle={sign.img ? 'Картианка' : 'Текст'}
                                             src={sign.img ? `${axios.defaults.baseURL}/${sign.img}` : persik}
                                             caption={<Link href={`https://vk.com/id${sign.from}`}>Автор</Link>}
                                >
                                </ContentCard>
                            )
                            : <p>Галерея пуста</p>
                        }
                        {loading && <PanelSpinner/>}
                    </CardGrid>
                </Group>

            </Div>
            <Group mode={"plain"} header={(user?.signs && user?.signs?.length !== 0) ? <Header mode={"secondary"}>Собранная коллекция</Header>: ''}>
                {!params.vk_profile_id
                    ? <>
                        {!params?.vk_profile_id && !params.vk_has_profile_button
                            ?
                            <Div>
                                <Button mode="primary" onClick={addToProfile}>
                                    Добавить MiniApp в профиль
                                </Button>
                            </Div>
                            :
                            <Div>
                                <Button mode="primary" onClick={removeFromProfile}>
                                    Убрать MiniApp из профиля
                                </Button>
                            </Div>
                        }
                    </>
                    :
                    <Div>
                        <Dropdown
                            shown={shown}
                            onShownChange={setShown}
                            content={
                                <FormLayout>
                                    <FormItem top="Текст авторграфа">
                                        <Input value={signText} onChange={e => setSignText(e.target.value)}/>
                                    </FormItem>
                                    <FormItem>
                                        <Input type={"file"} onChange={e => setSignImg(e.target.files[0])}/>
                                    </FormItem>
                                    <FormItem>
                                        <Button onClick={writeSign}>Подтвердить</Button>
                                    </FormItem>
                                </FormLayout>
                            }
                        >
                            <Button mode="primary">
                                Оставить автограф
                            </Button>
                        </Dropdown>
                    </Div>
                }
            </Group>
            {/*{fetchedUser &&*/}
            {/*    <Group header={<Header mode="secondary">User Data Fetched with VK Bridge</Header>}>*/}
            {/*        <Cell*/}
            {/*            before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}*/}
            {/*            description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}*/}
            {/*        >*/}
            {/*            {`${fetchedUser.first_name} ${fetchedUser.last_name}`}*/}
            {/*        </Cell>*/}
            {/*    </Group>}*/}
            {/*        <Cell*/}
            {/*            before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}*/}
            {/*            description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}*/}
            {/*        >*/}
            {/*            {`${fetchedUser.first_name} ${fetchedUser.last_name}`}*/}
            {/*        </Cell>*/}
            {/*<Group header={<Header mode="secondary">Navigation Example</Header>}>*/}

            {/*</Group>*/}
        </Panel>
    )
};

Home.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
    fetchedUser: PropTypes.shape({
        photo_200: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        city: PropTypes.shape({
            title: PropTypes.string,
        }),
    }),
};

export default Home;
