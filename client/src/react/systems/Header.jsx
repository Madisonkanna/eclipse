import React from 'react';
// server utilities can be made available in the components where they are used
// import serverApi from '../../utils/server.js'
// const { createUser } = serverApi

const Header = ({props, dispatch}) => {
    return (
        <div className="Header flex justifyBetween">
            <span>Eclipse</span>
            <span 
                onClick={e => dispatch({
                    type: `STEP_TO_${
                        props.view === 'login' ? 'ACCOUNT_CREATION'
                        : props.view === 'account_creation' ? 'LOGIN'
                        : ''
                    }`
                })} 
                className="interactive">
                {props.view === 'login' ? 'Create Account' 
                : props.view === 'account_creation' ? 'Login'
                : ''}
            </span>
        </div>
    )
}

export default Header