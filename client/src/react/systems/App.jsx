import React from 'react';

// server utilities can be made available in the components where they are used
import serverApi from '../../serverApi/serverApi.js'
const { createUser } = serverApi

const submitForm = async ({ refs }) => {
	let { email, password } = refs
	email = email.value
	password = password.value 
	const salt = String.fromCharCode.apply(
		null,
		crypto.getRandomValues(new Uint8Array(16))
	)
	console.log(salt)
	const intermediateKey = crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			hash: 'SHA-512',
			salt, 
			iterations: 100
		},
		password,
		{
			name: 'AES-GCM',
			length: 256
		},
		true,
		["encrypt", "decrypt"]
	)
	const intermediateMaterial = await crypto.subtle.
	exportKey('raw', intermediateKey)
	const passKeyMaterial = intermediateMaterial.slice(0, 256)
	const hashMaterial = intermediateMaterial.slice(256)
	console.log(intermediateMaterial, passKeyMaterial, hashMaterial, 'all 3')
	// createUser({email })
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