import gameActionTypes from "../actionTypes/game.actiontypes";
import Api from '../utils/Api';
import ApiConfig from "../config/ApiConfig";

const gameActions = {};

gameActions.getAllRequest = () => {
    let endpoint = ApiConfig.domain + ApiConfig.endpoint.getGame;
    return async (dispatch) => {
        await Api.call('GET', endpoint ).then( result => {
            if(result.data.status === 1){
                dispatch(gameActions.getAll(result))
            }
        })
    }
}

gameActions.getAll = (result) => {
    return {
        type: gameActionTypes.GET_ALL_GAME,
        result
    }
}

gameActions.getDetailGameToGameRequest = (productId) => {
    let endpoint = ApiConfig.domain + ApiConfig.endpoint.getDetailGameToGame + '?productId='+productId ;
    return async (dispatch) => {
        await Api.call('GET', endpoint ).then( result => {
            if(result.data.status === 1){
                dispatch(gameActions.getDetailGameToGame(result))
                dispatch(gameActions.getAllRequest())
            }
        })
    }
}

gameActions.getDetailGameToGame = (result) => {
    return {
        type: gameActionTypes.GET_DETAIL_GAME_TO_GAME,
        result
    }
}


export default gameActions;