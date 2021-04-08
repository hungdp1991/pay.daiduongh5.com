import loginActionTypes from '../actionTypes/login.actiontypes';
import Api from '.././utils/Api';
import ApiConfig from '../config/ApiConfig';
import isLoading from "./isloading.actions";

const loginAction = {};

loginAction.Login = (username, password) => {
    let endpoint = ApiConfig.domain + ApiConfig.endpoint.login + '?username='+ username + '&password=' + password;
    return async (dispatch) => {
        dispatch(isLoading.showLoader())
        await Api.call('GET', endpoint ).then( result => {
            if(result.data.status === 1){
                dispatch(loginAction.success(result))
            }
            else{
                dispatch(loginAction.failure(result))
            }
        })
        dispatch(isLoading.hideLoader())
    }
}

loginAction.loginFacebookRequest = (accessToken) => {
    let endpoint = 'https://graph.facebook.com/me?fields=token_for_business&access_token='+accessToken;
    return async (dispatch) => {
        //Get bussiness token
        dispatch(isLoading.showLoader())
        await Api.call('GET', endpoint ).then(res => {
            if(res.status === 200 && res.data.token_for_business)
            {
                dispatch(loginAction.loginFacebook(res.data.token_for_business));
            }            
        })
        
    }
}

loginAction.loginFacebook = (bussinessToken) => {
    let endpoint = ApiConfig.domain + ApiConfig.endpoint.loginFb + "?tokenForBusiness="+ bussinessToken;
    return async (dispatch) => {
        //Get data form api
        await Api.call('GET', endpoint ).then(result => {
            if(result.data.status === 1){
                dispatch(loginAction.success(result))
            }
            else{
                dispatch(loginAction.failure(result))
            }
        })
        dispatch(isLoading.hideLoader())
    }
}

loginAction.loginGoogle = (email) => {
    let endpoint = ApiConfig.domain + ApiConfig.endpoint.loginGg + "?email="+ email;
    return async (dispatch) => {
        //Get data form api
        dispatch(isLoading.showLoader())
        await Api.call('GET', endpoint ).then(result => {
            if(result.data.status === 1){
                dispatch(loginAction.success(result))
            }
            else{
                dispatch(loginAction.failure(result))
            }
        })
        dispatch(isLoading.showLoader())
    }
}

loginAction.LoginApple = (sub) => {
    let endpoint = ApiConfig.domain + ApiConfig.endpoint.loginApple + "?sub="+sub;
    return async (dispatch) => {
        //Get data form api
        dispatch(isLoading.showLoader())
        await Api.call('GET', endpoint ).then(result => {
            if(result.data.status === 1){
                dispatch(loginAction.success(result))
            }
            else{
                dispatch(loginAction.failure(result))
            }
        })
        dispatch(isLoading.hideLoader())
    }
}

loginAction.success = (result) => {
    return {
        type: loginActionTypes.LOGIN_SUCCESS,
        result
    };
}

loginAction.failure = (result) => {
    return {
        type: loginActionTypes.LOGIN_FAILURE,
        result
    };
}

loginAction.logout = () => {
    return {
        type: loginActionTypes.LOGOUT,
    };
}

export default loginAction;