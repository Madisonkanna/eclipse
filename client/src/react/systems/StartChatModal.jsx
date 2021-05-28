import React from 'react'
import Modal from '../components/Modal'
import serverApi from '../../utils/server.js'
import Input from '../components/Input'
import { generateSymKey, exportKey, encrypt } from '../../utils/encryption.js'

const { createChatUser, startChat } = serverApi

const StartChatModal = ({dispatch, props, setData, data}) => {

    return (
        <Modal 
            visible={props.messenger.startChatModal}
            body={
                <div>
                    <h2>Start Chat</h2>
                    <Input 
                        label="Search"
                        onChange={e => {
                            dispatch({
                                type: 'UPDATE_ADD_SEARCH',
                                addSearch: e.target.value
                            })
                        }}
                    />
                    <div>
                        {data.users.filter(user => user.email.indexOf(props.messenger.addSearch > -1)).map(user => (
                            <div>
                                <span>{user.email}</span>
                                <span
                                    onClick={async e => {
                                        const chatKey = await generateSymKey()
                                        const exportedChatKey = await exportKey(chatKey)
                                        const encryptedChatKey = await encrypt(props.user.data_key, exportedChatKey)
                                        const startChatRes = await startChat({
                                            name: 'Chat 1',
                                            users: [user],
                                            chatKey: encryptedChatKey
                                        })
                    
                                       console.log(startChatRes, 'start chat res')

                                    }}
                                    >&oplus;</span>
                            </div>
                        ))}
                    </div>
                    <div
                        onClick={e => dispatch({
                            type: 'DISMISS_NEW_CHAT_MODAL'
                        })}
                    >X</div>
                </div>
            }
        />

    )
}


export default StartChatModal