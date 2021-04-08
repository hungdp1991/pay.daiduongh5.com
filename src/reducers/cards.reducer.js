//import gameActionTypes from "../actionTypes/game.actiontypes";



var initialState = {
    data: {},
    errors: null
};

export var cardsAction = {
    CARDS_GET_ALL: "CARDS.GET_ALL"
}

var cardsReducer = (state = initialState, action) => {
    switch(action.type){
        case "CARDS.GET_ALL":{
            state.data = action.result.data.data;
            return {...state};
        }

        default: {
            return {...state};
        }
    }
}

export default cardsReducer;
