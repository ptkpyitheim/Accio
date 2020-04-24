import { createStore, combineReducers } from 'redux';

const initialState = {
  token: "",
  me: null,
  avatar: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SEND_TOKEN':
      // console.log("token sent: ", action)
      return Object.assign({}, state, {
        token: action.token
      })
    case 'UPDATE_ME':
      // console.log("update me: ", action)
      return Object.assign({}, state, {
        me: action.me,
        // avatar: action.avatar,
      })
      
  }
  return state
};
const store = createStore(combineReducers({ reducer }));
export default store;

