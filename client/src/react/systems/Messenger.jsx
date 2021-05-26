import React from 'react'
import Input from '../components/Input.jsx'

const Chat = ({data, props, dispatch}) => {
    const user = typeof props.messenger.selected === 'number' ? data.users.find(user => user.id === props.messenger.selected)
    : null
    return (
        <div className="Chat">
            <div className="header flex justifyBetween">
                <span>Chat</span>
                <span>{user ? user.email : 'Select A User' }</span>
                <div>

                </div>
            </div>
        </div>
    )
}

const FriendsList = ({data, setData, props, dispatch}) => {
    return (
        <div className="FriendsList">
            <h2>Chats</h2>
            <div 
                onClick={e => {
                    console.log('test')
                    dispatch({
                        type: 'PROMPT_NEW_CHAT_MODAL'
                    })
                }}
                >&oplus;</div>
            <Input 
                label="Search"
                onChange={e => {
                    dispatch({
                        type: 'UPDATE_FRIENDS_SEARCH',
                        search: e.target.value
                    })
                }}
            />
            {data.users.filter(user => user.email.indexOf(props.messenger.search) > -1).map(user => {
                return (
                    <div 
                        onClick={e => dispatch({ type: 'SELECT_FRIEND_CHAT', selected: user.id})}
                        className="Friend">{user.email}</div>
                )
            })}
        </div>
    )
}

const Messenger = ({ data, setData, props, dispatch }) => {
    return (
        <div className="Messenger">
            <FriendsList 
                {...{data, setData, props, dispatch}} 
            />
            <Chat 
                {...{data, setData, props, dispatch}}
            />
        </div>
    )
}

export default Messenger