import React, { Component } from 'react'
import apiConfig from "../config/ApiConfig"
import neta from "../assets/images/neta.jpg"
import Input from "react-validation/build/input";
import {lt, required} from "../utils/validateInput";
import Form from "react-validation/build/form";
import isLoading from "../actions/isloading.actions";
import Api from "../utils/Api";
import loginAction from "../actions/login.actions";
import CheckButton from "react-validation/build/button";
import {connect} from "react-redux";

class NetaloLogin extends Component {
    constructor(props){
        super(props)
        this.state = {
            script: null
        }
    }
    handleSubmit = async (e) => {
        e.preventDefault();
    }

    render() {
        return (
            <div>
                <div className="cover-netalo">

                    <a href="/#" onClick={this.netaLogin}>
                        <div className="row-login" id="btnNeta">
                            <i style={{background: "#d6682e"}} className="fa fa-blank">
                                <img alt="" src={neta} style={{marginTop:"-5px", marginLeft: "-16px"}}/>
                            </i>
                            <p  style={{background: "#d6682e"}}>Đăng nhập bằng Netalo</p>
                        </div>
                    </a>
                </div>

                <div id="neta-login" className="modal fade" tabIndex="-1" role="dialog"
                     data-backdrop="false">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title">Netalo Login</h1>
                            </div>
                            <div className="modal-body">
                                <div className="container-fluid">
                                    <Form onSubmit={e => this.handleSubmit(e)} ref={c => {
                                        this.formCardPay = c
                                    }}>
                                        <div className="row">
                                        <label htmlFor="phone" className="col-sm-12 controll-label">Số Điện Thoại
                                            *</label>
                                        <Input
                                            name="phone"
                                            id="phone"
                                            onChange={this.handleChange}
                                            type="number"
                                            placeholder=""
                                            className="form-control"
                                            minLength="10"
                                            validations={[required, lt]}
                                        />
                                        </div>
                                        <CheckButton style={{ display: 'none' }} ref={c => { this.checkBtn1 = c }} />
                                    </Form>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.requestToken}>Gửi Mã OTP</button>
                            </div>
                        </div>

                    </div>
                </div>

                <div id="neta-otp" className="modal fade" tabIndex="-1" role="dialog"
                     data-backdrop="false">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title">Netalo Login</h1>
                            </div>
                            <div className="modal-body">
                                <div className="container-fluid">
                                    <Form onSubmit={e => this.handleSubmit(e)} ref={c => {
                                        this.formOTP = c
                                    }}>
                                        <div className="row">
                                            <label htmlFor="otp" className="col-sm-12 controll-label">Mã OTP
                                                *</label>
                                            <Input
                                                name="otp"
                                                id="otp"
                                                onChange={this.handleChange}
                                                type="number"
                                                placeholder=""
                                                className="form-control"
                                                minLength="6"
                                                validations={[required, lt]}
                                            />

                                        </div>
                                        <CheckButton style={{ display: 'none' }} ref={c => { this.checkBtn2 = c }} />
                                    </Form>
                                </div>
                                <div style={{display:"none"}} id="otp-err" className="alert alert-danger" role="alert">OTP Không Hợp Lệ</div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.checkOTP}>Xác Nhận</button>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    netaLogin = (event) => {
        event.preventDefault();
        //clear old data
        window.$('#phone').val("");
        window.$('#otp').val("");
        window.$("#otp-err").hide();
        this.setState({
            script: null
        })

        // create modal
        let modal = window.$('#neta-login');

        // show modal
        modal.modal('show');

    };

    requestToken = async (event) => {
        // event.preventDefault();
        this.formCardPay.validateAll();

        if(this.checkBtn1.context._errors.length !== 0){
            console.error(this.checkBtn1)
            return false;
        } else {
            let dt = await this.props.userlogin();

            if (dt.data.status === 1) {
                this.setState({script: dt.data.script});
            }
        }
    }

    checkOTP = async (event) => {
        this.formOTP.validateAll();
        await this.props.checkOtp(this.state.script);
    }

}

const mapStateToProps = state => {
    return {
        login: state.loginReducer,
        isLoadingReducer: state.isLoadingReducer
    };
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        userlogin: async () => {
            const phone = window.$('#phone').val();
            let endpoint = apiConfig.domain + 'passport/loginNA?phone=' + phone;

            //Get bussiness token
            dispatch(isLoading.showLoader());
            let rt = await Api.call('GET', endpoint )
            dispatch(isLoading.hideLoader());
            window.$('#neta-login').modal('hide');
            window.$('#neta-otp').modal('show');

            return rt;
        },
        checkOtp: async (script) => {
            let otp = window.$('#otp').val();
            let endpoint = apiConfig.domain + 'passport/loginNA?otp=' + otp + "&script=" + script;
            //confirm otp
            dispatch(isLoading.showLoader());
            await Api.call('GET', endpoint ).then(res => {
                if(res.data.status === 1) {
                    dispatch(loginAction.success(res));
                    window.$('#neta-otp').modal('hide');
                } else {
                    window.$("#otp-err").show();

                }
            })
            dispatch(isLoading.hideLoader());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NetaloLogin);