import React, { useReducer } from 'react';

// server utilities can be made available in the components where they are used
import serverApi from '../../utils/server.js'
const { createUser } = serverApi
import Header from './Header.jsx'
import Login from './Login.jsx'
import AccountCreation from './AccountCreation.jsx'
import Messenger from './Messenger.jsx'
import StartChatModal from './StartChatModal.jsx'
import reactUtils from  '../../utils/react.js'
const { createReducer } = reactUtils

const initState = {
	// Views: login, account creation
	view: 'login',
	authenticated: false,
	acccount_creation: {},
	messenger: {
		search: '',
		addSearch: '',
		selected: null,
		startChatModal: false,
	},
	login: {
		errors: {
			email: null,
			password: null,
			form: null
		}
	}
}

const navActions = {
	STEP_TO_MESSENGER: (state, action) => {
		state.view = 'messenger'
		return state
	},
	STEP_TO_ACCOUNT_CREATION: (state, action) => {
		state.view = 'account_creation'
		return state
	},
	STEP_TO_LOGIN: (state, action) => {
		state.view = 'login'
		return state
	}
}
const loginActions = {
	SET_EMAIL_ERROR: (state, action) => {
		state.login.errors.email = action.error
		return state
	},
	SET_PASSWORD_ERROR: (state, action) => {
		state.login.errors.password = action.error
		return state
	},
	SET_FORM_ERROR: (state, action) => {
		state.login.errors.form = action.error
		return state
	},
	USER_AUTHENTICTED: (state, action) => {
		state.authenticated = true
		state.user = action.user
		return state
	}
}
const messengerActions = {
	UPDATE_FRIENDS_SEARCH: (state, action) => {
		state.messenger.search = action.search
		return state
	},
	UPDATE_ADD_SEARCH: (state, action) => {
		state.messenger.addSearch = action.addSearch
		return state
	},
	SELECT_FRIEND_CHAT: (state, action) => {
		state.messenger.selected = action.selected
		return state
	},
	PROMPT_NEW_CHAT_MODAL: (state, action) => {
		state.messenger.startChatModal = true
		return state
	},
	DISMISS_NEW_CHAT_MODAL: (state, action) => {
		state.messenger.startChatModal = false
		return state
	}
}
const actions = {
	...loginActions,
	...navActions,
	...messengerActions
}

const dataActions = {
	SET_USER_DATA: (state, action) => {
		state.users = action.users 
		return state
	}
}

const appReducer = createReducer(actions)
const dataReducer = createReducer(dataActions)

export default function App() {
	const [props, dispatch] = useReducer(appReducer, initState)
	const [data, setData] = useReducer(dataReducer, { users: [] })
	const viewProps = {
		props,
		dispatch,
		data,
		setData
	}
	const refs = {}
	console.log(props, 'props here..')
	return (
		<div className="App">
			<Header {...viewProps } />
			{props.view === 'login' ? <Login {...viewProps } />
			: props.view === 'account_creation' ? <AccountCreation {...viewProps} />
			: props.view === 'messenger' ? <Messenger {...viewProps} />
			: null}
			<StartChatModal {...viewProps} /> 
		</div>
	)
}