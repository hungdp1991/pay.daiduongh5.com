import paymentActionTypes from '../actionTypes/payment.actiontypes';
import Api from '../utils/Api';
import ApiConfig from '../config/ApiConfig';
import isLoadingAction from "./isloading.actions";
const paymentActions = {};

paymentActions.chargeCardRequest = (params) => {
    let md5 = require('md5')
    let sign = md5(params.username + ApiConfig.jwtToken)
    let endpoint = ApiConfig.domain + ApiConfig.endpoint.chargeCard + '?serial='+params.txtSerie+'&code='+params.txtCardPin+'&username='+params.username+'&productAgent='+params.gameInfo.agent+'&type='+params.sltCardType+'&server_id='+params.sltServer+'&sign='+sign+'';
    return async (dispatch) => {
        dispatch(isLoadingAction.showLoader())
        await Api.call('GET', endpoint ).then( result => {
            if(result.data.status === 1 || result.data.status === 0){
                dispatch(paymentActions.chargeCard(result))
            }
        })
        dispatch(isLoadingAction.hideLoader())
    }
}

paymentActions.chargeCard = (result) => {
    return {
        type: paymentActionTypes.CHARGE_CARD,
        result
    }
}

paymentActions.chargeAtmRequest = (params) => {
    let md5 = require('md5')
    let sign = md5(params.username + ApiConfig.jwtToken)
    let endpoint = ApiConfig.domain + ApiConfig.endpoint.chargeAtm + '?amount='+params.sltAmount+'&username='+params.username+'&productAgent='+params.gameInfo.agent+'&roleId='+params.sltRoleId+'&server_id='+params.sltServer+'&sign='+sign+'';
    return async (dispatch) => {
        dispatch(isLoadingAction.showLoader())
        await Api.call('GET', endpoint ).then( result => {
            if(result.data.status === 1){
                window.location.href = result.data.data.link;
            }
        })
    }
}


paymentActions.getUserRoleRequest = (serverId, userId, agent) => {
    let md5 = require('md5')
    let sign = md5(userId + ApiConfig.jwtToken)
    let endpoint = ApiConfig.domain + ApiConfig.endpoint.getRole + '?server_id=' + serverId+'&id_user='+userId+'&productAgent='+agent+'&sign='+sign;
    return async (dispatch) => {
        dispatch(isLoadingAction.showLoader())
        await Api.call('GET', endpoint ).then( result => {
            if(result.data.status === 1){
                dispatch(paymentActions.getUserRole(result))
            }
        })
        dispatch(isLoadingAction.hideLoader());
    }
}

paymentActions.chargeAtmSuccess = (paramStr) => {
    let endpoint = ApiConfig.domain + ApiConfig.endpoint.paymentWalletChargeATMSuccess + paramStr;
    return async (dispatch) => {
        await Api.call('GET', endpoint ).then( result => {
            dispatch(paymentActions.rsChargeAtmSuccess(result))
        })
    }
}

paymentActions.rsChargeAtmSuccess = (result) => {
    return {
        type: paymentActionTypes.CHARGE_ATM_SUCCESS,
        result
    }
}

paymentActions.getUserRole = (result) => {
    return {
        type: paymentActionTypes.GET_USER_ROLE,
        result
    }
}

export default paymentActions;