import React, { Component } from 'react'
import ReactAppleLogin from 'react-apple-login'
import SocialConfig from "../config/SocialConfig"

class AppleLogin extends Component {

    render() {
        return (
            <div className="cover-apple-login">
                <ReactAppleLogin clientId={SocialConfig.apple.client_id} redirectURI={SocialConfig.apple.redirect_url}
                responseType={"code id_token"} 
                responseMode={"fragment"}
                designProp={
                    {
                    height: 50,
                    width: 255,
                    color: "black",
                    border: false,
                    type: "sign-in",
                    border_radius: 10,
                    scale: 1,
                    locale: "vi_VI", 
                    }
                }
                />
                <a href="/#" onClick={this.handleClick}>
                    <div className="row-login" id="btnApple">
                        <i className="fa fa-apple" aria-hidden="true" />
                        <p>Đăng nhập bằng Apple ID</p>
                    </div>
                </a>
            </div>
        )
    }
}

export default AppleLogin;