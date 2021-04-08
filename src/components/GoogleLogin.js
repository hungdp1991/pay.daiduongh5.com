import React, { Component } from 'react';
import { connect } from "react-redux";
import SocialConfig from "../config/SocialConfig";
import loginAction from '../actions/login.actions';

class GoogleLogin extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email : '',
        };
    }

    componentDidMount() { 
        window['googleSDKLoaded'] = () => {
            window['gapi'].load('auth2', () => {
                this.auth2 = window['gapi'].auth2.init({
                    client_id: SocialConfig.google.app_id,
                    cookiepolicy: 'single_host_origin',
                    scope: 'profile email'
                });
                this.prepareLoginButton();
            });
        }
        
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'google-jssdk'));
    }

    prepareLoginButton = () => {     
        this.auth2.attachClickHandler(this.refs.googleLoginBtn, {},
        (googleUser) => {
            let profile = googleUser.getBasicProfile();
            this.setState({
                email: profile.getEmail()
            })
            this.props.googleLogin(this.state.email);
        });
    }

    onHandleClick = (e) => {
        e.preventDefault();
    }

    render() {
        return (
            <a href="/#" onClick={this.onHandleClick} ref="googleLoginBtn"><div className="row-login" id="btnGoogle">
                <i className="fa fa-google" aria-hidden="true" />
                <p>Đăng nhập bằng Google</p>
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
        googleLogin: (email) => {
            dispatch(loginAction.loginGoogle(email))
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GoogleLogin);