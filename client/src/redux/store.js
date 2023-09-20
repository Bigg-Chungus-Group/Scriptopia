
import { createStore, combineReducers } from 'redux';
import darkModeReducer from './reducers';

const rootReducer = combineReducers({
  darkMode: darkModeReducer,
});

const store = createStore(rootReducer);

export default store;
