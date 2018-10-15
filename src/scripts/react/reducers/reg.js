export default function postReducer(state = [], action) {
  switch (action.type) {
    case 'REG_RESULT':
      return action.obj;
    default:
      return state;
  }
}