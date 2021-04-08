import React, { Component } from 'react'
import SocialConfig from '../config/SocialConfig';
import { connect } from "react-redux";
import loginAction from '../actions/login.actions';

class FacebookLogin extends Component {

    constructor(props) {
        super(props)
        this.state = {
            accessToken : '',
        };
    }

    componentDidMount() {
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: SocialConfig.fb.app_id,
                false: true,  // enable cookies to allow the server to access
                xfbml: true,  // parse social plugins on this page
                version: 'v6.0' // use version 2.1
            });

            window.FB.Event.subscribe('auth.statusChange', function(response) {
                if (response.authResponse && response.status === "connected") {
                    this.setState({
                        accessToken: response.authResponse.accessToken
                    })
                    this.callApi(this.state.accessToken);
                }
            }.bind(this));
        }.bind(this);

        // Load the SDK asynchronously
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    callApi = (token) => {
        this.props.facebookLogin(token)
    }

    handleClick = (e) => {
        e.preventDefault();        
        window.FB.getLoginStatus(function (response) {
            if(response.status !== 'connected'){
                window.FB.login();
            }
        })
    }

    render() {
        return (
            <a href="/#" onClick={this.handleClick}>
                <div className="row-login" id="btnFacebook">
                    <i className="fa fa-facebook" aria-hidden="true" />
                    <p>Đăng nhập bằng Facebook</p>
                </div>
            </a>
        )
    }
}

const mapStateToProps = state => {
    return {
        login: state.loginReducer
    };
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        facebookLogin: (token) => {
            dispatch(loginAction.loginFacebookRequest(token))
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FacebookLogin);