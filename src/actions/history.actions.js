import historyActionTypes from "../actionTypes/history.actiontypes";
import Api from '../utils/Api';
import ApiConfig from "../config/ApiConfig";
import apiConfig from "../config/ApiConfig";
import isloadingAction from "../actions/isloading.actions";

const historyActions = {};

historyActions.getCardHistoryRequest = (username, game, formDate, toDate) => {
    let md5 = require('md5');
    let sign = md5(username+apiConfig.jwtToken);
    let endpoint = ApiConfig.domain + ApiConfig.endpoint.getCardHistory + '?productAgent='+game+'&sign='+sign+'&username='+username+'&fromDate='+formDate+'&toDate='+toDate+'';
    return async (dispatch) => {
        dispatch(isloadingAction.showLoader())
        await Api.call('GET', endpoint ).then( result => {
            if(result.data.status === 1){
                dispatch(historyActions.getCardHistory(result))
            }
        })
        dispatch(isloadingAction.hideLoader())
    }
}

historyActions.filterPayToGameHistoryRequest = (username, game, formDate, toDate) => {
    let md5 = require('md5');
    let sign = md5(username+apiConfig.jwtToken);
    let endpoint = ApiConfig.domain + ApiConfig.endpoint.getPayToGameHistory + '?productAgent='+game+'&sign='+sign+'&username='+username+'&fromDate='+formDate+'&toDate='+toDate+'';
    return async (dispatch) => {
        dispatch(isloadingAction.showLoader())
        await Api.call('GET', endpoint ).then( result => {
            if(result.data.status === 1){
                dispatch(historyActions.getPayToGameHistory(result))
            }
        })
        dispatch(isloadingAction.hideLoader())
    }
}

historyActions.getPayToGameHistory = (result) => {
    return {
        type: historyActionTypes.GET_PAY_TO_GAME_HISTORY,
        result
    }
}

historyActions.getCardHistory = (result) => {
    return {
        type: historyActionTypes.GET_CARD_HISTORY,
        result
    }
}

export default historyActions;