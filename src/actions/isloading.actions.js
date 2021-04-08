import isLoadingActionTypes from "../actionTypes/isloading.actiontypes";

// define action of loader
const isLoadingActions = {};

/**
 * show loader
 * @return {} dispatch
 */
isLoadingActions.showLoader = () => {
  return dispatch => {
      dispatch(isLoadingActions.showLoaderRequest());
  };
};

/**
 * hide loader
 * @return {} dispatch
 */
isLoadingActions.hideLoader = () => {
  return dispatch => {
      dispatch(isLoadingActions.hideLoaderRequest());
  };
};

/**
 * show loader request
 * @return {Action Creator}
 */
isLoadingActions.showLoaderRequest = () => {
  return {
    type: isLoadingActionTypes.SHOW_LOADING
  };
};

/**
 * hide loader request
 * @return {Action Creator}
 */
isLoadingActions.hideLoaderRequest = () => {
  return {
    type: isLoadingActionTypes.HIDE_LOADING
  };
};

export default isLoadingActions;
