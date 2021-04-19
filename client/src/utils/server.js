// your server domain
const host = 'http://localhost:3000'

/*************** FETCH UTILITIES ******************/
// namespace for functions meant to interact with servers

// example function calling authenticate on a user's username and password, returning its results
// const authUser = async (email, password) => await fetch('POST', `${host}/auth-user`, [JSON.stringify({ email, password })])


const createUser = ({ email, data, publicKey, privateKey, salt }) => {
	return fetch('http://localhost:3000/create-user', {
		method: 'POST',
		body: JSON.stringify({
			email, data, publicKey, privateKey, salt
		}),
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
    	},
	})
	console.log('res:', res)
}

const serverApi = {
	// export fetch utilities here
	// authUser
	createUser
}

export default serverApi