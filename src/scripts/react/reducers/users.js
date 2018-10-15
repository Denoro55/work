export default function postReducer(state = [], action) {
	switch (action.type) {
		case 'UPDATE_USERS':
			return [...state,action.users];
		case 'NEW_USER':
			return action.users;
		case 'LEFT_USER':
			state.splice(state.indexOf(action.users),1);
			return [...state];
		default:
			return state;
	}
}