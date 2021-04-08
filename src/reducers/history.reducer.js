import historyActionTypes from "../actionTypes/history.actiontypes"; 

var initialState = {
    cardHistory: [],
    payToGameHistory: []
};

var historyReducer = (state = initialState, action) => {
    switch(action.type){
        case historyActionTypes.GET_CARD_HISTORY:{
            state.cardHistory = action.result.data.data
            return state;
        }
        case historyActionTypes.GET_PAY_TO_GAME_HISTORY:{
            state.payToGameHistory = action.result.data.data
            return state;
        }
        default: {
            return {...state};
        }
    }
}

export default historyReducer;