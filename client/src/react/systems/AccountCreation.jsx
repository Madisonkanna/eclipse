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
	derivePassKeyHash,
	exportKeypair,
	generateSalt,
	exportKey,
	utf8ToB64,
	b64ToUtf8
} from '../../utils/encryption.js'

const submitForm = async ({ refs, dispatch, setData }) => {
	let { email, password } = refs
	email = email.value
	password = password.value 
	const salt = generateSalt(16)
	const { key, hash } = await derivePassKeyHash({ salt, password })
	const { privateKey, publicKey } = await generateAsymKeys()
	console.log('priv key, pub key', privateKey, publicKey)
	// export privateKey and encrypt with passKey. Encrypt/decrypt privateKey w/ passkey.
	// pkcs8 = encryption type for private keys. can't export private keys as raw. 
	const privateKeyMaterial = await exportKey(privateKey, 'pkcs8')
	const publicKeyMaterial = await exportKey(publicKey)

	// we're encrypting privateKeyMaterial, this is our plaintxt. 
	const encryptedPrivateKey = await encrypt(key, privateKeyMaterial)
	// private user key gets decrypted/encrypted with user's passKey

	// public key is stored unencrypted. Other users can encrypt data w/ this key that only this user will be able to decrypt.
	// User key would be used to encrypt/decrypt chat keys. Chat keys used to encrypt/decrypt message data.
	const data = await encrypt(key, JSON.stringify({}))
	const createUserRes = await createUser({
		email, data, publicKey: utf8ToB64(publicKeyMaterial), privateKey: encryptedPrivateKey, salt, hash
	})
	console.log(createUserRes, 'createUserRes body') 
	const createUserResBody = await createUserRes.json()
	console.log(createUserResBody, 'createUserResBody...')
	if (createUserResBody.success) {
		// we have account created and we can log in!
		const authRes = await authenticate({ password, email })
		if (authRes.success) {
			dispatch({
				type: 'STEP_TO_MESSENGER'
			})
			setData({
				type: 'SET_USER_DATA',
				users: authRes.data
			})
			
		} else {
			dispatch({
				type: 'SET_FORM_ERROR',
				error: 'Invald password/email combination.'
			})
		}

	} else if (createUserResBody.code === "ER_DUP_ENTRY") {
		alert('Username already taken')
	} else {
		alert('Account creation failed.')
	}
}
export default function AccountCreation({ props, dispatch, setData }) {
	const refs = {}
	return (
		<div className="AccountCreation">
			<form onSubmit={e => {
				e.preventDefault()
				submitForm({refs, dispatch, setData})}
				}>
				<h2>Create Account</h2>
				<Input 
					label="Email"
					placeholder="email"
					inputRef={r => {
						refs.email = r
					}}
				/>
				<Input 
					placeholder="password"
					label="Password"
					inputRef={r => {
						refs.password = r
					}}
				/>
				<button  type="submit" >Label</button>
			</form>

		</div>
	)
}