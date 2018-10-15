export default function postReducer(state=[],action){
	if (action.type === 'ADD_MESSAGE'){
		return [
            ...state, action.message
        ]
	}
	return state
}