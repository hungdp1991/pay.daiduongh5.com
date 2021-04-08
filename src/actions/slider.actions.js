import sliderActionTypes from '../actionTypes/slider.actiontypes';
import Api from '../utils/Api';
import ApiConfig from '../config/ApiConfig';

const sliderActions = {};

sliderActions.getAllRequest = () => {
    let endpoint = ApiConfig.domain + ApiConfig.endpoint.getSlider;
    return async (dispatch) => {
        await Api.call('GET', endpoint ).then( result => {
            if(result.data.status === 1){
                dispatch(sliderActions.getAll(result))
            }
        })
    }
}

sliderActions.getAll = (result) => {
    return {
        type: sliderActionTypes.GET_ALL,
        result
    }
}

export default sliderActions;