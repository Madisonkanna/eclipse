import React from 'react'

const Chat = ({props, dispatch}) => {
    return (
        <div clasName="Chat">Chat!</div>
    )
}

const FriendsList = ({data, setData, props, dispatch}) => {
    return (
        <div className="FriendsList">{data.users.map(user => {
            return (
                <div>{user.email}</div>
            )
        })}</div>
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