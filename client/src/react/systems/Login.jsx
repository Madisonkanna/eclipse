import React from 'react';

// server utilities can be made available in the components where they are used
import serverApi from '../../utils/server.js'
import Input from '../components/Input.jsx'
const { createUser, authenticate } = serverApi

import {
	str2ab, 
	ab2str, 
	randomUint8, 
	derivePasskey, 
	hash, 
	generateAsymKeys, 
	generateSymKey,
	deriveSymKey, 
	encrypt, 
	decrypt, 
	importKey, 
	importKeypair, 
	exportKeypair,
	generateSalt,
	exportKey,
	utf8ToB64,
	b64ToUtf8
} from '../../utils/encryption.js'

const submitForm = async ({ data, setData, props, dispatch, refs }) => {
	const password = refs.password.value
	const email = refs.email.value 
	const authRes = await authenticate({ password, email })
	if (authRes.success) {
		console.log(authRes, 'auth res..')
		dispatch({
			type: 'STEP_TO_MESSENGER'
		})


		setData({
			type: 'SET_USER_DATA',
			users: authRes.users
		})

		dispatch({
			type: 'USER_AUTHENTICTED',
			user: authRes.user
		})
		
	} else {
		dispatch({
			type: 'SET_FORM_ERROR',
			error: 'Invald password/email combination.'
		})
	}
}

const clearErrors = ({props, dispatch}) => {
	const actions = []
	const loginErrors = props.login.errors
	if (loginErrors.email) {
		actions.push({ 
			type: 'SET_EMAIL_ERROR',
			error: null
		 })
	}
	if (loginErrors.password) {
		actions.push({ 
			type: 'SET_PASSWORD_ERROR',
			error: null
		 })
	}
	if (loginErrors.form) {
		actions.push({ 
			type: 'SET_FORM_ERROR',
			error: null
		 })
	}
	if (actions.length) {
		dispatch(actions)
	}
}

const Login = ({data, setData, props, dispatch }) => {
	const refs = {}
	return (
		<div className="Login">
			<form 
				className={props.login.errors.form ? "formError" : null}
				onSubmit={e => {
					e.preventDefault()
					clearErrors({props, dispatch})
					submitForm({data, setData, refs, props, dispatch})
					}
				}>
				<h2>Login</h2>
				<Input 
					label="Email"
					placeholder="email"
					onChange={e => clearErrors({props, dispatch})}
					onFocus={e => {
						clearErrors({props, dispatch})
					}}
					inputRef={r => {
						refs.email = r
					}}
				/>
				<Input 
					placeholder="password"
					label="Password"
					onChange={e => clearErrors({props, dispatch})}
					onFocus={e => {
						clearErrors({props, dispatch})
					}}
					inputRef={r => {
						refs.password = r
					}}
				/>
				<button  type="submit" >Label</button>
			</form>
			{props.login.errors.form ? <div className="error">{props.login.errors.form} </div>: null}
		</div>
	)
}
export default Login