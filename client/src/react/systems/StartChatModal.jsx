import React from 'react'
import Modal from '../components/Modal'
import Input from '../components/Input'
import { generateSymKey, exportKey } from '../../utils/encryption.js'

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
                                    onClick={e => {
                                        // generate symmetric key 
                                        const getChatKey = await generateSymKey
                                        const chatKey = await exportKey(key)
                                        console.log(chatKey, 'chat key.. ')
                                        // encrypt ccat key with user's data key 

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