const createReducer = (actions) => {
    const dispatchAction = (state, action) => {
        if (actions[action.type]) {
            state = actions[action.type](state, action)
        } else {
            console.warn(`Unknown action: ${action.type}`)
        }
    }
    return (state, action) => {
        if (Array.isArray(action)) {
            action.forEach(_action => {
                dispatchAction(state, _action)
            })
        } else {
            dispatchAction(state, action)
        }
        return { ...state }
    }
}
const reactUtils = {
    createReducer
}
export default reactUtils