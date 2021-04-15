import React from 'react';

// server utilities can be made available in the components where they are used
import serverApi from '../../utils/server.js'
const { createUser } = serverApi

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

const submitForm = async ({ refs }) => {
	let { email, password } = refs
	email = email.value
	password = password.value 
	const salt = generateSalt(16)
	console.log({salt})

	// generate intermediate key and export it 

	// use the first half for the authentication hash

	// use the second half for the password derived key

}

export default function App(props) {
	const refs = {}
	return (
		<div className="App">
			<form onSubmit={e => {
				e.preventDefault()
				submitForm({refs})}
				}>
				<label >Email:</label>
				<input 
					placeholder="email"
					ref={r => {
						refs.email = r
					}}
				/>
				<label>Password:</label>
				<input 
					placeholder="password"
					ref={r => {
						refs.password = r
					}}
				/>
				<button  type="submit" >Label</button>
			</form>

		</div>
	)
}