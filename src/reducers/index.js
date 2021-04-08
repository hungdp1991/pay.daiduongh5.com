import { combineReducers } from "redux";
import gamesReducer from "./game.reducer";
import sliderReducer from "./slider.reducer";
import loginReducer from "./login.reducer";
import postReducer from "./posts.reducer";
import paymentReducer from "./payment.reducer";
import isLoadingReducer from "./isloading.reducer"
import historyReducer from "./history.reducer"
import cardsReducer from "./cards.reducer"

const appReducers = combineReducers({
    gamesReducer,
    sliderReducer,
    loginReducer,
    postReducer,
    paymentReducer,
    isLoadingReducer,
    historyReducer,
    cardsReducer
});

export default appReducers;