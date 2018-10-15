export default function postReducer(state = {}, action) {
  switch (action.type) {
    case 'USER_INFO':
      return action.info
    default:
      return state;
  }
}
