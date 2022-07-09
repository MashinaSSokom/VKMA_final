import React, {useEffect} from 'react';
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
    FormItem
} from '@vkontakte/vkui';
import {useDispatch, useSelector} from "react-redux";
import bridge from "@vkontakte/vk-bridge";
import {initLaunchParams} from "../store/actionTypes";
import {Dropdown} from "@vkontakte/vkui/unstable";

const Home = ({id, go, fetchedUser}) => {
    const [shown, setShown] = React.useState(false);

    const params = useSelector(state => state.launchParams.params)
    console.log('renderHome', params)

    const addToProfile = () => {
        console.log('AddToProfile')
        bridge.send("VKWebAppAddToProfile").then((res) =>
            console.log('Вызов меню добавления в проиль', res)
        )
    }

    const writeSign = () => {
        setShown(false)
        console.log('WriteSign')
    }

    return (<Panel id={id}>
            <PanelHeader>{params?.vk_profile_id
                ? `Галерея пользователя ${params.vk_profile_id}`
                : `Моя галерея`}
            </PanelHeader>


            <Group mode={"plain"} header={<Header mode={"secondary"}>Собранная коллекция</Header>}>
                {!!params?.vk_profile_id && !params.vk_profile_button_forbidden
                    ?
                    <Div>
                        <Button mode="primary" onClick={addToProfile}>
                            Добавить MiniApp в профиль
                        </Button>
                    </Div>
                    :
                    <Div>
                        <Dropdown
                            shown={shown}
                            onShownChange={setShown}
                            content={
                                <FormLayout>
                                    <FormItem top="Текст авторграфа">
                                        <Input />
                                    </FormItem>
                                    <FormItem>
                                        <Button onClick={writeSign}>Подтвердить</Button>
                                    </FormItem>
                                </FormLayout>
                            }
                        >
                            <Button mode="primary" >
                                Оставить автограф
                            </Button>
                        </Dropdown>

                    </Div>
                }
                <Div>
                    {/*<Button stretched size="l" mode="secondary" onClick={go} data-to="persik">*/}
                    {/*    Show me persik*/}
                    {/*</Button>*/}
                    {/*{params && <p>{`${Object.keys(params)}`}</p>}*/}
                </Div>
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
