import React, { Component } from 'react'
import { withRouter, Redirect } from 'react-router-dom';
import loginAction from "../actions/login.actions"
import { connect } from "react-redux";  

class AppleLoginCallback extends Component {

    parseJwt = (token) => {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    };

    componentDidMount(){
        let queryString = require('query-string');
        let strParams = this.props.location.hash;
        let params = queryString.parse(strParams);
        if (this.props.login.isLogged === false && params.id_token !== undefined){
            let tokenData = this.parseJwt(params.id_token)        
            this.props.appleSignIn(tokenData.sub)
        }
    }

    render() {
        return <Redirect to="/" />
    }
}

const mapStateToProps = state => {
    return {
      login: state.loginReducer,
    };
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        appleSignIn: (sub) => {
            dispatch(loginAction.LoginApple(sub))
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(AppleLoginCallback))