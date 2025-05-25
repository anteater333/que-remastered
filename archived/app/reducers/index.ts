import { combineReducers } from "redux";
import authReducer from "./authReducer";
import noticeReducer from "./noticeReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  notice: noticeReducer,
});

export default rootReducer;
