import gameActionTypes from "../actionTypes/game.actiontypes";
// import {REHYDRATE} from 'redux-persist/lib/constants';

var initialState = {
    data: {},
    detail: {},
    errors: null
};

var gameReducer = (state = initialState, action) => {
    switch(action.type){
        case gameActionTypes.GET_ALL_GAME:{
            state.data = action.result.data.data;
            return {...state};
        }
        case gameActionTypes.GET_DETAIL_GAME_TO_GAME:{
            state.detail = action.result.data.data;
            return {
                ...state
            };
        }
        // case REHYDRATE: {
        //     // var incoming = action.payload.loginReducer
        //     if (action.payload) {
        //         if (state.data === {}) {
        //             console.error('test')
        //             console.error(state.data)
        //             action.getGameList();
        //         }
        //
        //         var incoming = action.payload.gameReducer
        //         if (incoming) return {...state, ...incoming}
        //     }
        //
        //     return state
        // }
        default: {
            return {...state};
        }
    }
}

export default gameReducer;