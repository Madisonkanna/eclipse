// your server domain
const host = 'http://localhost:3000'

/*************** FETCH UTILITIES ******************/
// namespace for functions meant to interact with servers

// example function calling authenticate on a user's username and password, returning its results
// const authUser = async (email, password) => await fetch('POST', `${host}/auth-user`, [JSON.stringify({ email, password })])


const createUser = async({ email, data, publicKey, privateKey }) => {
	const res = await fetch('localhost:3000/createUser')
	console.log('res:', res)
}

const serverApi = {
	// export fetch utilities here
	// authUser
	createUser
}

export default serverApi