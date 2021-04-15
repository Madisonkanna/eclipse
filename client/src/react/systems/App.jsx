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

	// generate intermediate key and export it 
	const intermediateKey = await derivePasskey(password, salt, 256)
	const intermediateMaterial = await exportKey(intermediateKey)
	// intermediateMaterial will always have str length of 32 chararacters

	// use the first half for the authentication hash
	const hash = intermediateMaterial.slice(0, 16)

	// use the second half for the password derived key
	const passKeyMaterial = intermediateMaterial.slice(16)
	const passKey = await importKey(passKeyMaterial, { type: 'AES-GCM', isPrivate: false })
	const { privateKey, publicKey } = await generateAsymKeys()
	console.log(userKeys, 'user keys')
	// export privateKey and encrypt with passKey. Encrypt/decrypt privateKey w/ passkey.
	const privateKeyMaterial = await exportKey(privateKey)
	// we're encrypting privateKeyMaterial, this is our plaintxt. 
	const encryptedPrivateKey = await encrypt(passKey, privateKeyMaterial)
	// private user key gets decrypted/encrypted with user's passKey

	// public key is stored unencrypted. Other users can encrypt data w/ this key that only this user will be able to decrypt.
	// User key would be used to encrypt/decrypt chat keys. Chat keys used to encrypt/decrypt message data.

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