// your server domain
const host = 'http://localhost:3000'

/*************** FETCH UTILITIES ******************/
// namespace for functions meant to interact with servers

// example function calling authenticate on a user's username and password, returning its results
// const authUser = async (email, password) => await fetch('POST', `${host}/auth-user`, [JSON.stringify({ email, password })])

let authToken = undefined

import {
	derivePassKeyHash,
} from './encryption.js'

const _fetch = (route, body = {}) => {
	console.log(authToken, 'auth token')
	return fetch(`${host}/${route}`, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*', 
			'authorization': authToken
    	},
	})
}

const getUsers = () => _fetch('get-user-data')

const authenticate = async ({ email, password }) => {
	const getSaltResponse = await _fetch('pre-login', { email })
	console.log(getSaltResponse, 'get salt response')
	const saltResponse = await getSaltResponse.json()
	console.log(saltResponse, 'salt response')
	if (!saltResponse.salt) {
		return {
			success: false
		}
	}
	const salt = saltResponse.salt
	const { key, hash } = await derivePassKeyHash({ password, salt })
	const getLoginResponse = await _fetch('login', { email, hash })
	const loginRes = await getLoginResponse.json()
	console.log('loginRes:', loginRes)
	authToken = loginRes.token
	if (loginRes.success) {
		const getUsersData = await getUsers()
		const usersData = await getUsersData.json()
		console.log(usersData, 'usersdData')
		return usersData

	}
	return loginRes
}
// Body: { email, data, publicKey, privateKey, salt }
const createUser = body => _fetch('create-user', body)

const serverApi = {
	// export fetch utilities here
	// authUser
	createUser,
	authenticate,
	getUsers
}

export default serverApi