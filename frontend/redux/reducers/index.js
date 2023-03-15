import { combineReducers } from 'redux';
import Settings from "./Settings";
import Common from "./Common";


const createRootReducer = combineReducers({
  settings: Settings,
  common: Common,
});

export default createRootReducer
