export default function postReducer(state = '', action) {
  switch (action.type) {
    case 'SESSION_NODE':
      return action.cookie;
    default:
      return state;
  }
}