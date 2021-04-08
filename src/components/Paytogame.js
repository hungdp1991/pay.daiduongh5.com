import React, { Component } from 'react'
import { connect } from 'react-redux'
import "../assets/css/paytogame.css"
import gameActions from "../actions/games.actions"
import paymentActions from "../actions/payment.actions"
import { withRouter } from 'react-router-dom';
import * as _ from 'lodash';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import CheckButton from 'react-validation/build/button';
import {required, minLength, maxLength} from "../utils/validateInput";

class Paytogame extends Component {

    constructor(props){
        super(props)
        this.state = {
            username: JSON.parse(localStorage.getItem('user')).data.username,
            userRole: {},
            sltRoleId: '',
            sltServer: '',
            sltCardType: '',
            txtSerie: '',
            txtCardPin: '',
            sltAmount: '',
            gameInfo: {},
            chargeSuccessMSG : '',
            errorsAtm: [],
            errorsCard: [],
            errorSelectServer: [],
            errorSelectRole: []
        }
    }

    componentDidMount(){
        let {match} = this.props
        this.props.getDetailGameToGame(match.params.id)
        let queryString = require('query-string');
        let strParams = this.props.location.search;
        let params = queryString.parse(strParams);
        if (_.has(params, 'trans_id')) {
            this.props.chargeAtmSuccess(strParams)
            if(this.props.paymentReducer.chargeAtmSuccess.messages !== null)
            {
                let modalATMReport = window.$('.modal-atm-report');
                modalATMReport.modal('show');
                modalATMReport.on('click', function () {
                    modalATMReport.modal('hide')
                });
            }
        }
    }

    componentDidUpdate(previousProps, previousState){
        if(Object.keys(previousState.gameInfo).length === 0)
        {
            let gameData = previousProps.gamesReducer.data;
            for (var key in gameData) {
                if (gameData.hasOwnProperty(key)) {
                    if(gameData[key].slug === previousProps.match.params.slug)
                    {
                        this.setState({
                            gameInfo: gameData[key]
                        })
                    }
                }
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        let userRole = nextProps.paymentReducer.userRole.data
        
        if(prevState.sltServer !== '' && userRole)
        {
            return {
                userRole: nextProps.paymentReducer.userRole,
                sltRoleId: prevState.sltRoleId!==''?prevState.sltRoleId:userRole.role[0].roleId,
                errorSelectRole: []
            }            
        }
        return {
            userRole: {},
            sltRoleId: '',
        }
    }

    checkHasRole = () => {
        let errorSelectRole = [];
        if(this.state.sltRoleId === ''){
            errorSelectRole.push('không tìm thấy thông tin nhân vật')
        }
        this.setState({
            errorSelectRole: errorSelectRole
        })
        return errorSelectRole;
    }

    handlePayByCard = (e) =>{
        e.preventDefault();
        this.formCardPay.validateAll();
        let errorRole =  this.checkHasRole();
        if ( this.checkBtn1.context._errors.length === 0 && errorRole.length === 0) {
            this.props.chargeCard(this.state)
        }
    }

    handlePayByATM = (e) => {
        e.preventDefault();
        this.formAtmPay.validateAll();
        let errorRole =  this.checkHasRole();
        if ( this.checkBtn2.context._errors.length === 0 && errorRole.length === 0 ) {
            this.props.chargeAtm(this.state)
        }
    }

    hanleGetRole = async (event) =>{
        const target = event.target;
        const serverId = target.value;
        if(serverId !== ''){
            await this.props.getUserRole(serverId, JSON.parse(localStorage.getItem('user')).data.id, this.state.gameInfo.agent);
            if(this.props.paymentReducer.userRole.data === undefined){
                this.setState({
                    errorSelectRole: ['không tìm thấy thông tin nhân vật']
                })
            }
        }else{
            this.setState({
                errorSelectRole: ''
            })      
        }
        this.setState({
            sltServer: serverId,
        })
    }

    handleChange = (event) =>{
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }


    handleRefresh = (event) =>{
        event.preventDefault();
        window.location.href = this.props.match.url;
    }

    render() {
        let chargeAtmMSG = '';
        if(this.props.paymentReducer.chargeAtmSuccess.data !== undefined)
        {
            chargeAtmMSG = this.props.paymentReducer.chargeAtmSuccess.data.messages
        }
        let server = this.props.gamesReducer.detail;
        let serverElement = null;
        if(server.length > 0)
        {
            serverElement = server.map((val, index) => {
                return <option key={index} value={val.server_id}>{val.server_name}</option>
            })
        }
        let {errorSelectServer, gameInfo, userRole, errorSelectRole} = this.state;
        let {paymentReducer} = this.props;
        // if(Object.keys(gameInfo).length === 0){
        //     return (<div style={{textAlign: "center"}}>
        //                 <div className="lds-dual-ring"></div>
        //             </div>)
        // }else{
            return (
                <div className="container paytogame_container">
                    <div className="row box">
                        <h2>{gameInfo.name}</h2>
                        <div className="hd-Form"> Bước 1: Chọn thông tin nhân vật (*)</div>
                        <label htmlFor="sltServer" className="col-sm-12 controll-label" id="list_server"> Chọn server:</label>
                        {errorSelectServer && (<span className="input-error">{errorSelectServer[0]}</span>)}
                        <select name="sltServer" value={this.state.sltServer} onChange={this.hanleGetRole} className="form-control " id="server_list">
                            <option value="">Chọn server</option>
                            {serverElement}
                        </select>
                        {
                            Object.keys(userRole).length > 0 ?
                            (<div>
                                <label htmlFor="sltRoleId" className="col-sm-12 controll-label"> Chọn nhân vật:</label>
                                <select name="sltRoleId" onChange={this.handleChange} className="form-control " id="userRole">
                                {userRole.data.role.map((val, index) => {
                                    return <option key={index} value={val.roleId}>{val.roleName}</option>
                                })}
                                </select>
                            </div>)
                            :<span className="input-error">{errorSelectRole[0]}</span>
                        }
                        <div id="appentHtml" />
                        <div className="clearfix" /> <input type="hidden" name="id_user" id="id_user" />
                        <div className="hd-Form"> Bước 2: Chọn phương thức thanh toán (*)</div>
                        <div className="panel-group paytogame" id="accordion">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h4 className="panel-title">
                                        <a data-toggle="collapse" data-parent="#accordion" href="#collapse1">Nạp thẻ cào</a>
                                    </h4>
                                </div>
                                <div id="collapse1" className="panel-collapse collapse in">
                                    <Form onSubmit={e => this.handlePayByCard(e)} ref={c => { this.formCardPay = c }}>
                                        <div className="panel-body">
                                            <label htmlFor="sltCardType" className="col-sm-12 controll-label">
                                                <span>Loại thẻ</span>
                                                <Select name='sltCardType' onChange={this.handleChange} className="form-control" validations={[required]}>
                                                    <option value="">Chọn loại thẻ</option>
                                                    <option value="HPC">HPCode</option>
                                                    <option value="GATE">GATE</option>
                                                </Select>
                                            </label>
                                            <label htmlFor="txtSerie" className="col-sm-12 controll-label">
                                                <span>Số serie</span>
                                                <Input 
                                                    name="txtSerie" 
                                                    onChange={this.handleChange}
                                                    type="text" 
                                                    placeholder=""
                                                    className="form-control" 
                                                    validations={[required, minLength, maxLength]}
                                                />
                                            </label>
                                            <label htmlFor="txtCardPin" className="col-sm-12 controll-label">
                                                <span>Mã thẻ</span>
                                                <Input 
                                                    name="txtCardPin" 
                                                    onChange={this.handleChange}
                                                    type="text" 
                                                    placeholder=""
                                                    className="form-control" 
                                                    validations={[required, minLength, maxLength]}
                                                />
                                            </label>
                                            <button disabled={this.props.isLoadingReducer.isLoading} id="submitCard" className="col-sm-3 btn btn-primary">{this.props.isLoadingReducer.isLoading?
                                            <div className={'dot-loader'}>
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                            </div>
                                            :'thanh toán'}</button>
                                            <CheckButton style={{ display: 'none' }} ref={c => { this.checkBtn1 = c }} />
                                            {
                                            paymentReducer.chargeCard.status === 1 ?(<span className="message-success">
                                                {paymentReducer.chargeCard.messages}
                                            </span>):(<span className="message-alert">
                                                {paymentReducer.chargeCard.messages}
                                            </span>)
                                            }
                                        </div>
                                    </Form>
                                </div>
                            </div>
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h4 className="panel-title">
                                        <a data-toggle="collapse" data-parent="#accordion" href="#collapse2">Nạp thẻ ATM/iBanking</a>
                                    </h4>
                                </div>
                                <div id="collapse2" className="panel-collapse collapse">
                                    <Form onSubmit={e => this.handlePayByATM(e)} ref={c => { this.formAtmPay = c }}>
                                        <div className="panel-body">
                                            <label htmlFor="sltAmount" className="col-sm-12 controll-label">
                                                <span>Số tiền thanh toán (VNĐ)</span>
                                                <Select name='sltAmount' onChange={this.handleChange} className="form-control" validations={[required]}>
                                                    <option value="">Chọn số tiền</option>
                                                    <option value={10000}>10,000</option>
                                                    <option value={20000}>20,000</option>
                                                    <option value={50000}>50,000</option>
                                                    <option value={100000}>100,000</option>
                                                    <option value={200000}>200,000</option>
                                                    <option value={300000}>300,000</option>
                                                    <option value={500000}>500,000</option>
                                                    <option value={1000000}>1,000,000</option>
                                                    <option value={2000000}>2,000,000</option>
                                                </Select>
                                            </label>
                                            <button disabled={this.props.isLoadingReducer.isLoading} id="submitAtm" className="col-sm-3 btn btn-primary">{this.props.isLoadingReducer.isLoading?
                                            <div className={'dot-loader'}>
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                            </div>
                                            :'thanh toán'}</button>
                                            <CheckButton style={{ display: 'none' }} ref={c => { this.checkBtn2 = c }} />
                                        </div>
                                    </Form>
                                </div>
                            </div>
                            <div className="message-alert">
                                NẠP HPCODE = 100% ; GATE = 100% ; VCOIN = 90% ; ATM = 100% (Thẻ HPCode có bán ở các cửa hàng của Payoo &amp; bán online tại Website Napthegame.net )
                            </div>
                        </div>
                        <div className="clearfix" />
                        <div onClick={this.handleRefresh} className="modal modal-atm-report fade" tabIndex="-1" role="dialog" data-backdrop="false">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-body">
                                        <p className={"text-center"}>{chargeAtmMSG}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        // }
    }
}

const mapStateToProps = (state) => ({
    gamesReducer: state.gamesReducer,
    paymentReducer: state.paymentReducer,
    isLoadingReducer: state.isLoadingReducer
})

const mapDispatchToProps = (dispatch, props) => {
    return {
        getDetailGameToGame: (productId) => {
            dispatch(gameActions.getDetailGameToGameRequest(productId))
        },
        chargeCard: (params) => {
            dispatch(paymentActions.chargeCardRequest(params))
        },
        chargeAtm: (params) => {
            dispatch(paymentActions.chargeAtmRequest(params))
        },
        getUserRole: async ( serverId, userId, agent) => {
            await dispatch(paymentActions.getUserRoleRequest(serverId, userId, agent))
        },
        chargeAtmSuccess: (paramStr) => {
            dispatch(paymentActions.chargeAtmSuccess(paramStr))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Paytogame))