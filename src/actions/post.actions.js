import postActionTypes from '../actionTypes/post.actiontypes';
import Api from '../utils/Api';
import ApiConfig from '../config/ApiConfig';
import isloadingAction from "../actions/isloading.actions";

const postActions = {};

postActions.getAllPostRequest = () => {
    let endpoint = ApiConfig.domain + ApiConfig.endpoint.getPosts;
    return async (dispatch) => {
        dispatch(isloadingAction.showLoader())
        await Api.call('GET', endpoint ).then( result => {
            if(result.data.status === 1){
                dispatch(postActions.getAllPost(result))
            }
        })
        dispatch(isloadingAction.hideLoader())
    }
}

postActions.getAllPost = (result) => {
    return {
        type: postActionTypes.GET_ALL_POST,
        result
    }
}

postActions.getPostDetailRequest = (slug) => {
    let endpoint = ApiConfig.domain + ApiConfig.endpoint.getDetailPost + slug;
    return async (dispatch) => {
        await Api.call('GET', endpoint ).then( result => {
            if(result.data.status === 1){
                dispatch(postActions.getDetailPost(result))
            }
        })
    }
}

postActions.getDetailPost = (result) => {
    return {
        type: postActionTypes.GET_DETAIL_POST,
        result
    }
}

export default postActions;