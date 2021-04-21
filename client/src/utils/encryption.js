const utf8ToB64 = utf8 => (
	btoa(encodeURIComponent(utf8).replace(/%([0-9A-F]{2})/g,
		(match, p1) =>  String.fromCharCode('0x' + p1)
	))
)

const b64ToUtf8 = b64 => (
	decodeURIComponent(atob(b64).split('').map(
		c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`
    ).join(''))
)

const str2ab = str => {
	const ab = new ArrayBuffer(str.length)
	const abView = new Uint8Array(ab)
	for (let i = 0; i < str.length; i++) {
		abView[i] = str.charCodeAt(i)
	}
	return ab
}

const ab2str = ab => String.fromCharCode.apply(null, new Uint8Array(ab))

const randomUint8 = length => crypto.getRandomValues(new Uint8Array(length))

const derivePasskey = async (password, salt, outLength=128, iterations=1000) => crypto.subtle.deriveKey(
	{
		name: 'PBKDF2',
		hash: 'SHA-256',
		salt: str2ab(salt),
		iterations
	},
	(await crypto.subtle.importKey(
		'raw',
		str2ab(password),
		{name: 'PBKDF2'},
		false,
		['deriveKey']
	)),
	{
		name: 'AES-GCM',
		length: outLength
	},
	true,
	['encrypt', 'decrypt']
)

const hash = async data => ab2str(await crypto.subtle.digest('SHA-256', str2ab(data)))

const generateAsymKeys = () => crypto.subtle.generateKey(
	{
		name: 'ECDH',
		namedCurve: 'P-256'
	},
	true, 
	['deriveKey']
)

const generateSymKey = () => crypto.subtle.generateKey(
	{
		name: 'AES-GCM',
		length: 256
	},
	true,
	['encrypt', 'decrypt']
)

const generateSalt = (len=12) => utf8ToB64(ab2str(randomUint8(len)))

/**
 * @param {CryptoKey} public  Other entity's public key
 * @param {CryptoKey} private Your private key
 */
const deriveSymKey = (pub, priv) => crypto.subtle.deriveKey(
	{
		name: 'ECDH',
		public: pub
	},
	priv,
	{
		name: 'AES-GCM',
		length: 256
	},
	true,
	['encrypt', 'decrypt']
)

const encrypt = async (key, plaintext) => {
	const iv = randomUint8(12)
	const cipherdata = await crypto.subtle.encrypt(
		{
			name: 'AES-GCM',
			iv
		},
		key,
		typeof plaintext === 'string' ? str2ab(plaintext) : plaintext
	)
	return utf8ToB64(`${ab2str(iv)}${ab2str(cipherdata)}`)
}

const decrypt = async (key, ciphertext) => {
	ciphertext = b64ToUtf8(ciphertext)
	const iv = str2ab(ciphertext.slice(0, 12))
	const cipherdata = str2ab(ciphertext.slice(12))

	let cleartextBuffer = await crypto.subtle.decrypt(
		{
			name: 'AES-GCM',
			iv
		},
		key,
		cipherdata
	)

	let cleartext = ab2str(cleartextBuffer)

	try {
		const parsedCleartext = JSON.parse(cleartext)
		cleartext = parsedCleartext
	} catch(e) {}
	
	return cleartext
}

/*
	types: {
		type: STRING('ECDH' || 'AES-GCM'),
		private: BOOLEAN
	}
*/
const importKey = (keyMat, {type, isPrivate}) => crypto.subtle.importKey(
	isPrivate ? 'pkcs8' : 'raw',
	str2ab(keyMat),
	(
		type === 'ECDH'
		? {
			name: type, 
			namedCurve: 'P-256'
		}
		: {
			name: type
		}
	), 
	true, 
	(
		type === 'ECDH' && isPrivate ? ['deriveKey'] 
		: type === 'ECDH' ? []
		: type === 'AES-GCM' ? ['encrypt', 'decrypt']
		: []
	)
)

const importKeypair = async keypair => {
	return ({
		public: await importKey(
			keypair.public, 
			{type: 'ECDH', isPrivate: false}
		),
		private: (
			keypair.private 
			? (await importKey(
				keypair.private, 
				{type: 'ECDH', isPrivate: true}
			)) 
			: null
		)
	})
}

const exportKey = async (key, format="raw") => ab2str(await crypto.subtle.exportKey(format, key))

const exportKeypair = async (keypair) => ({
	public: await exportKey(keypair.publicKey || keypair.public),
	private: await exportKey(keypair.privateKey || keypair.private, 'pkcs8')
})

// get hash and keys from salt, email and pass
const derivePassKeyHash = async ({ salt, password }) => {
	// generate intermediate key and export it 
	const intermediateKey = await derivePasskey(password, salt, 256)
	const intermediateMaterial = await exportKey(intermediateKey)
	// intermediateMaterial will always have str length of 32 chararacters

	// use the first half for the authentication hash
	const hash = utf8ToB64(intermediateMaterial.slice(0, 16))

	// use the second half for the password derived key
	const passKeyMaterial = intermediateMaterial.slice(16)
	console.log(passKeyMaterial, 'pass key material')
	const key = await importKey(passKeyMaterial, { type: 'AES-GCM', isPrivate: false })
	return { key, hash }
}

export {
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
	derivePassKeyHash,
	exportKey,
	utf8ToB64,
	b64ToUtf8
}
