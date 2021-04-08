import React, {Component} from 'react'
import '../assets/css/paytowallet.css'

import * as _ from 'lodash';

import api from '../utils/Api';
import apiConfig from '../config/ApiConfig';
import commonConfig from '../config/CommonConfig';

import PayBreadcrumb from './PayBreadcrumb'

import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import CheckButton from 'react-validation/build/button';
import {required, minLength, maxLength} from "../utils/validateInput";
import {Redirect} from "react-router-dom";
// import loginAction from "../actions/login.actions";
import {connect} from "react-redux";
import $ from "jquery"
import cardsAction from "../actions/cards.actions";


class Paytowallet extends Component {

    /**
     * Constructor
     * @param props
     * @created 2020-03-18 LongTHK
     */
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            balance: 0,
            game: {},
            agentValid: true,
            cardsList: [],
            atmValuesList: commonConfig.ATMValuesList,
            serverGroups: [],
            serversList: [],
            goldsList: [],
            isDisableSelectServers: true,
            payItem: {},
            inLoadingPage: false,
            inProcessing: false,
            processingResult: {
                status: null,
                message: ''
            },
            errors: {},
            chargeGameItem: {},
            chargeGameResult: {},
            rolesList: null,
            modalContent: '',
            isCallBack: false,
            getRoleProccessing: false
        }
    }

    /**
     * On component did mount event
     * @created 2020-03-18 LongTHk
     */
    async componentDidMount() {
        // get md5
        let md5 = require('md5');
        // get username
        // let username = JSON.parse(localStorage.getItem('user')).data.username;
        let {login} = this.props;

        let username = login.data.username;
        // get query string
        let queryString = require('query-string');

        // set inLoadingPage status
        this.setState({
            inLoadingPage: true
        });

        let {cardsReducer} = this.props;
        let cardTypeList = [];

        if ($.isEmptyObject(cardsReducer.data)) {
            let cardTypeApi = apiConfig.domain + apiConfig.endpoint.cardType;

            await api.call('GET', cardTypeApi).then((res) => {
                this.props.getCardsList(res);
                cardTypeList = (res.data.data);
            })

        } else {
            cardTypeList = cardsReducer.data;
        }


        // call api get page content
        let slug = this.props.match.match.params.slug;
        let sign = md5(username + apiConfig.jwtToken);
        let endPoint = apiConfig.domain + apiConfig.endpoint.getDetailGameToWallet + '?slug=' + slug + '&username=' + username + '&sign=' + sign;
        api.call('GET', endPoint)
            .then((response) => {
                let data = response.data.data;
                let cardActive = [];
                if (Object.keys(data).length > 0) {
                    if (JSON.parse(data.game[0].accepted_charge_type).length === 0) {
                        cardActive = (cardTypeList);
                    } else {
                        for (let i = 0; i < cardTypeList.length; i++) {
                            //check in array
                            if (JSON.parse(data.game[0].accepted_charge_type).includes(cardTypeList[i].id.toString())) {
                                cardActive.push(cardTypeList[i])
                            }
                        }
                    }
                }

                // spit servers list into server groups
                let serverGroups = _.chunk(data.servers, 10);
                // set state
                this.setState({
                    username: username,
                    balance: data.balance,
                    game: Object.keys(data).length > 0 ? data.game[0] : null,
                    serverGroups: serverGroups,
                    goldsList: data.golds,
                    agentValid: response.data.status === 2 ? false : true,
                    cardsList: cardActive
                });

                // call api check Charging ATM status
                let strParams = this.props.match.location.search;
                let params = queryString.parse(strParams);

                if (_.has(params, 'status')) {
                    // set atm response message\
                    let resMsg = '';
                    let stsClss = 'text-success';

                    if (parseInt(params.status) === 1) {
                        resMsg = params.messages;
                    } else {
                        resMsg = 'Dữ liệu truyền vào không hợp lệ!'
                        if (params.messages.length > 0) {
                            resMsg = params.messages;
                        }

                        stsClss = 'text-danger';
                    }
                    this.setState({
                        modalContent: resMsg,
                        isCallback: true
                    });

                    // create modal
                    let modal = window.$('.modal-notification');
                    document.getElementsByClassName("modal-body").item(0).classList.add(stsClss);

                    // modal close action
                    modal.on('click', function () {
                        modal.modal('hide');
                        document.getElementsByClassName("modal-body").item(0).classList.remove(stsClss);
                    });

                    // show modal
                    modal.modal('show');
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                // set inLoadingPage status
                // this.setState({
                //     inLoadingPage: false
                // });
            });
    }

    /**
     * Action on server group changee
     * @param event
     * @crated 2020-03018 LongTHK
     */
    changeServerGroup = (event) => {
        // get server group value
        let serverGroupValue = event.target.value;

        // load servers list base on group
        if (serverGroupValue !== '') {
            this.setState({
                serversList: this.state.serverGroups[serverGroupValue],
                isDisableSelectServers: false
            })
        } else {
            this.setState({
                isDisableSelectServers: true
            })
        }
    };

    /**
     * Handle changing input data
     * @param event
     * @created 2020-03-19 LongTHK
     */
    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState(prevState => ({
            payItem: {
                ...prevState.payItem,
                [name]: value
            }
        }))
    };

    /**
     * Get role name
     * @param event
     */
    handleServerChanged = (event) => {

        // get md5
        let md5 = require('md5');

        // get params
        // let userId = JSON.parse(localStorage.getItem('user')).data.id;
        let userId = this.props.login.data.id;
        let sign = md5(userId + apiConfig.jwtToken);
        let serverId = event.target.value;

        // define endpoint
        let endPoint = apiConfig.domain + apiConfig.endpoint.getRole +
            '?server_id=' + serverId +
            '&id_user=' + userId +
            '&productAgent=' + this.state.game.agent +
            '&sign=' + sign;
        if (serverId !== '') {
            this.setState({
                getRoleProccessing: true
            })
        }
        // call api
        api.call('GET', endPoint)
            .then((response) => {
                // get response data
                let responseData = response.data;
                this.setState({
                    getRoleProccessing: false
                })
                // set roles list
                if (responseData.status) {
                    // get roles list
                    let rolesList = responseData.data.role;

                    // set roles list
                    this.setState({
                        rolesList: rolesList
                    });

                    // set charge game item
                    this.setState({
                        chargeGameItem: {
                            serverId: serverId,
                            roleId: rolesList[0].roleId,
                            roleName: rolesList[0].roleName
                        }
                    });
                } else {
                    // clear roles list
                    this.setState({
                        rolesList: []
                    });

                    // clear charge game item
                    this.setState({
                        chargeGameItem: {}
                    })
                }
            })
            .catch((error) => {
                console.log(error)
            });
    };

    /**
     * Open charge game modal
     * @param event
     * @returns {Promise<void>}
     */
    openModal = (event) => {
        // get gold id
        let goldId = window.$(event.target).data('gold-id');

        if (window.$(event.target).data('amount') > parseInt(this.state.balance)) {
            // set state
            this.setState({
                modalContent: 'Không đủ số dư trong tài khoản, hãy chọn mệnh giá thấp hơn hoặc nạp thêm tiền vào ví để tiếp tục giao dịch'
            });
            // create modal
            let modal = window.$('.modal-notification');
            // modal close action
            modal.on('click', function () {
                modal.modal('hide')
            });

            // show modal
            modal.modal('show');
        } else {
            // get gold id
            this.setState(prevState => ({
                chargeGameItem: {
                    ...prevState.chargeGameItem,
                    goldId: goldId
                }
            }));

            // create modal
            let modal = window.$('.modal-confirm');
            // modal close action
            modal.on('hidden.bs.modal', function () {
                this.setState({
                    chargeGameResult: {}
                })
            }.bind(this));

            // show modal
            modal.modal('show');
        }
    };

    /**
     * Action on change role
     * @param event
     */
    changeRoleId = (event) => {
        let index = event.nativeEvent.target.selectedIndex;
        let roleName = (event.nativeEvent.target[index].text);
        let roleId = event.nativeEvent.target.value;
        this.setState({
            chargeGameItem: Object.assign({}, this.state.chargeGameItem, {
                roleId: roleId,
                roleName: roleName
            })
        });
    };

    /**
     * Charge game
     * @param event
     */
    chargeGame = (event) => {
        // stop propagation
        event.stopPropagation();
        // get md5
        let md5 = require('md5');
        this.setState({
            inProcessing: true
        })
        // create end point
        let endPoint = apiConfig.domain + apiConfig.endpoint.payToGame +
            '?roleId=' + this.state.chargeGameItem.roleId +
            '&roleName=' + this.state.chargeGameItem.roleName +
            '&goldId=' + this.state.chargeGameItem.goldId +
            '&username=' + this.state.username +
            '&productAgent=' + this.state.game.agent +
            '&serverId=' + this.state.chargeGameItem.serverId +
            '&sign=' + md5(this.state.chargeGameItem.roleId + this.state.chargeGameItem.roleName + this.state.username + apiConfig.jwtToken);
        // call api
        api.call('GET', endPoint)
            .then((response) => {
                // get response data
                let responseData = response.data;
                // set state
                this.setState({
                    chargeGameResult: {
                        status: responseData.status,
                        message: responseData.messages
                    },
                    inProcessing: false,
                    balance: responseData.data.balance
                });
            })
            .catch((err) => {
                console.log('err');
            })
    };

    /**
     * Change pay item
     * @param payType
     * @created 2020-03-19 LongTHK
     */
    changePayItem = (payType) => {
        switch (payType) {
            case 'card':
                this.setState({
                    payItem: {
                        cardType: '',
                        serie: '',
                        number: ''
                    }
                });
                break;
            case 'atm':
                this.setState({
                    payItem: {
                        amount: '',
                    }
                });
                break;
            default :
                this.setState({
                    payItem: {
                        cardType: '',
                        serie: '',
                        number: ''
                    }
                });
        }

        // push value to pay item
        this.setState(prevState => ({
            payItem: {
                ...prevState.payItem,
                username: this.state.username,
                productAgent: this.state.game.agent
            }
        }));

        // reset error
        this.setState({
            errors: {}
        });
    };

    /**
     * Pay by card
     * @created 2020-03-19 LongTHk
     */
    payByCard = async () => {
        // reset error
        this.setState({
            errors: {}
        });
        this.formCardPay.validateAll();
        if (this.checkBtn1.context._errors.length === 0) {
            // set inProcessing mode
            this.setState({
                inProcessing: true
            });
            // get md5
            const md5 = require('md5');
            // get pay item
            const payItem = this.state.payItem;
            // generate endpoint
            const endPoint = apiConfig.domain + apiConfig.endpoint.paymentWalletChargeCard +
                '?serial=' + payItem.serie +
                '&code=' + payItem.number +
                '&username=' + payItem.username +
                '&productAgent=' + payItem.productAgent +
                '&type=' + payItem.sltCardType +
                '&sign=' + md5(payItem.username + apiConfig.jwtToken);

            // call api
            api.call('GET', endPoint)
                .then((response) => {
                    // get response data
                    let responseData = response.data;

                    // set state
                    if (responseData.status) {
                        this.setState({
                            balance: responseData.data.balance,
                            processingResult: {
                                status: true,
                                message: responseData.messages
                            }
                        });
                    } else {
                        this.setState({
                            processingResult: {
                                status: false,
                                message: responseData.messages
                            }
                        })
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {
                    // release inProcessing mode
                    this.setState({
                        inProcessing: false
                    });
                });
        }
    };

    /**
     * Pay by ATM
     * @created 2020-03-19 LongTHk
     */
    payByATM = async () => {
        // reset error
        this.setState({
            errors: {}
        });
        console.log('testes');
        this.formAtmPay.validateAll();
        if (this.checkBtn2.context._errors.length === 0) {
            // set inProcessing mode
            this.setState({
                inProcessing: true
            });
            // get md5
            const md5 = require('md5');
            // get pay item
            const payItem = this.state.payItem;

            // generate endpoint
            const endPoint = apiConfig.domain + apiConfig.endpoint.paymentWalletChargeATM +
                '?username=' + payItem.username +
                '&productAgent=' + payItem.productAgent +
                '&amount=' + payItem.amount +
                '&sign=' + md5(payItem.username + apiConfig.jwtToken);

            // call api
            api.call('GET', endPoint)
                .then((response) => {
                    window.location.href = response.data.data.link;
                })
                .catch((err) => {
                    // release inProcessing mode
                    this.setState({
                        inProcessing: false
                    });
                    console.log(err)
                });
        }
    };

    handleRefresh = (event) => {
        event.preventDefault();
        if (this.state.isCallback) {
            window.location.href = this.props.match.match.url;
        }
    }

    /**
     * Render layout
     * @returns {*}
     * @created 2020-03-18 LongTHK
     */
    render() {
        /**
         * Render in case game not found
         */
        if (!this.state.game || Object.keys(this.state.game).length === 0) {
            if (this.state.agentValid) {
                return (<div style={{textAlign: "center"}}>
                    <div className="lds-dual-ring"></div>
                </div>)
            } else {
                return <Redirect to="/"></Redirect>
            }
        }
        /**
         * Page render
         */
        let balance = parseInt(this.state.balance);
        let chargeGameResult = this.state.chargeGameResult;
        return (
            <div className="container paytowallet_container">
                <div className="row box">
                    <PayBreadcrumb match={this.props.match.match}></PayBreadcrumb>
                    <h2>{this.state.game.name}</h2>
                    <div className="qa-message-list" id="wallmessages">
                        <div className="message-item" id="accRole">
                            <div className="message-inner">
                                <div className="message-head clearfix handle-acc-role">
                                    <div className="user-detail">
                                        <h5 className="handle">Tài khoản : {this.state.username}</h5>
                                        <h6 className="handle">Số dư : {balance.toLocaleString('it-IT', {
                                            style: 'currency',
                                            currency: 'VND'
                                        })}</h6>
                                        <input type="hidden" defaultValue={0} name="balance"/>
                                        <input type="hidden" defaultValue={771866} name="id_user" id="id_user"/>
                                        <input type="hidden" defaultValue={0} name="amount" id="amount"/>
                                        <input type="hidden" defaultValue={0} name="gold_id" id="gold_id"/>
                                        <input type="hidden" defaultValue name="theThang" id="theThang"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="message-item" id="accType">
                            <div className="message-inner">
                                <div className="message-head clearfix">
                                    <div className="user-detail">
                                        <h5 className="handle">Chọn phương thức để nạp tiền vào ví</h5>
                                    </div>
                                </div>
                                <div className="qa-message-content">
                                    <div className="collapse-group" id="accordion">
                                        <div className="panel panel-default">
                                            <div className="panel-heading" role="tab" id="headingOne">
                                                <h4 className="panel-title">
                                                    <a role="button" data-toggle="collapse" href="#collapseOne"
                                                       onClick={this.changePayItem.bind(window.event, 'card')}
                                                       data-parent="#accordion"
                                                       aria-expanded="true" aria-controls="collapseOne"
                                                       className="trigger collapsed">
                                                        Thẻ cào
                                                    </a>
                                                </h4>
                                            </div>
                                            <div id="collapseOne" className="panel-collapse collapse"
                                                 role="tabpanel"
                                                 aria-labelledby="headingOne" data-id="Thẻ cào">
                                                <Form ref={c => {
                                                    this.formCardPay = c
                                                }}>
                                                    <div className="panel-body">
                                                        <div className="tab-pane active" id="tab_card_pay">
                                                            <label htmlFor="in_type"
                                                                   className="col-sm-12 controll-label">
                                                                <span>Loại thẻ</span>
                                                                <Select name='sltCardType' onChange={this.handleChange}
                                                                        className="form-control"
                                                                        validations={[required]}>
                                                                    <option value="">Chọn loại thẻ</option>
                                                                    {
                                                                        _.map(this.state.cardsList, (itemValue, itemIndex) =>
                                                                            <option key={itemIndex}
                                                                                    value={itemValue.type}>{itemValue.name}</option>
                                                                        )
                                                                    }
                                                                </Select>
                                                            </label>
                                                            <label htmlFor="in_serie"
                                                                   className="col-sm-12 controll-label">
                                                                <span>Số serie</span>
                                                                <Input
                                                                    name="serie"
                                                                    onChange={this.handleChange}
                                                                    type="text"
                                                                    placeholder=""
                                                                    className="form-control"
                                                                    validations={[required, minLength, maxLength]}
                                                                />
                                                            </label>
                                                            <label htmlFor="in_pin"
                                                                   className="col-sm-12 controll-label">
                                                                <span>Mã thẻ</span>
                                                                <Input
                                                                    name="number"
                                                                    onChange={this.handleChange}
                                                                    type="text"
                                                                    placeholder=""
                                                                    className="form-control"
                                                                    validations={[required, minLength, maxLength]}
                                                                />
                                                            </label>
                                                            <CheckButton style={{display: 'none'}} ref={c => {
                                                                this.checkBtn1 = c
                                                            }}/>
                                                            <button className="btn btn-info" id="btnCardPay"
                                                                    type={"button"}
                                                                    data-id="the-cao"
                                                                    onClick={this.payByCard}
                                                                    disabled={this.state.inProcessing}>
                                                                {
                                                                    !this.state.inProcessing &&
                                                                    <span>Thanh toán</span>
                                                                }
                                                                {
                                                                    this.state.inProcessing &&
                                                                    <div className={'dot-loader'}>
                                                                        <div></div>
                                                                        <div></div>
                                                                        <div></div>
                                                                        <div></div>
                                                                        <div></div>
                                                                    </div>
                                                                }
                                                            </button>
                                                            {
                                                                (
                                                                    this.state.processingResult.status !== null &&
                                                                    !this.state.processingResult.status &&
                                                                    <span
                                                                        className="message-alert">{this.state.processingResult.message}</span>
                                                                ) ||
                                                                (
                                                                    this.state.processingResult.status !== null &&
                                                                    this.state.processingResult.status &&
                                                                    <span
                                                                        className="message-success">{this.state.processingResult.message}</span>
                                                                )
                                                            }
                                                            <div className="clearfix"/>
                                                        </div>
                                                    </div>
                                                </Form>
                                            </div>
                                        </div>
                                        <div className="panel panel-default">
                                            <div className="panel-heading" role="tab" id="headingTwo">
                                                <h4 className="panel-title">
                                                    <a role="button" data-toggle="collapse" href="#collapseTwo"
                                                       data-parent="#accordion"
                                                       onClick={this.changePayItem.bind(window.event, 'atm')}
                                                       aria-expanded="true" aria-controls="collapseTwo"
                                                       className="trigger collapsed">
                                                        Thẻ ATM/Nội địa/NAPAS
                                                    </a>
                                                </h4>
                                            </div>
                                            <div id="collapseTwo" className="panel-collapse collapse"
                                                 role="tabpanel"
                                                 aria-labelledby="headingTwo" data-id="Thẻ ATM/Nội địa/NAPAS">
                                                <Form ref={c => {
                                                    this.formAtmPay = c
                                                }}>
                                                    <div className="panel-body">
                                                        <div id="tab_card_pay">
                                                            <label htmlFor="amount_pay"
                                                                   className="col-sm-12 controll-label">
                                                                <span>Số tiền thanh toán (VNĐ)</span>
                                                                <Select name='amount' onChange={this.handleChange}
                                                                        className="form-control"
                                                                        validations={[required]}>
                                                                    <option value="">Chọn số tiền</option>
                                                                    {
                                                                        _.map(this.state.atmValuesList, (itemValue, itemIndex) =>
                                                                            <option key={itemIndex}
                                                                                    value={itemValue.value}>{itemValue.displayText}</option>
                                                                        )
                                                                    }
                                                                </Select>
                                                            </label>
                                                            <button className="btn btn-info" id="btnXacnhan"
                                                                    type={"button"} data-id="the-atm"
                                                                    onClick={this.payByATM}
                                                                    disabled={this.state.inProcessing}>
                                                                {
                                                                    !this.state.inProcessing &&
                                                                    <span>Thanh toán</span>
                                                                }
                                                                {
                                                                    this.state.inProcessing &&
                                                                    <div className={'dot-loader'}>
                                                                        <div></div>
                                                                        <div></div>
                                                                        <div></div>
                                                                        <div></div>
                                                                        <div></div>
                                                                    </div>
                                                                }
                                                            </button>
                                                            <CheckButton style={{display: 'none'}} ref={c => {
                                                                this.checkBtn2 = c
                                                            }}/>
                                                        </div>
                                                    </div>
                                                </Form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="message-alert">NẠP HPCODE = 100% ; GATE = 100% ; ATM =
                                    100% (Thẻ HPCode có
                                    bán ở các cửa hàng của Payoo &amp; bán online tại Website hpcode.vn)
                                </div>
                            </div>
                        </div>
                        <div className="message-item" id="accGetRole">
                            <div className="message-inner">
                                <div className="message-head clearfix">
                                    <div className="user-detail">
                                        <h5 className="handle">Chọn server để nạp tiền vào game</h5>
                                    </div>
                                </div>
                                <div className="qa-message-content content_server">
                                    <div className="divserverList">
                                        <input type="hidden" name="agent" id="agent" defaultValue="m002"/>
                                        <label htmlFor="server_group" className="col-sm-12 controll-label">
                                            Chọn cụm máy chủ:
                                        </label>
                                        <select name="server_group" className="form-control "
                                                id="server_group"
                                                onChange={this.changeServerGroup}
                                        >
                                            <option value="">Chọn group server</option>
                                            {
                                                _.map(this.state.serverGroups, (serverGroupValue, serverGroupIndex) =>
                                                    <option key={serverGroupIndex} value={serverGroupIndex}>
                                                        Cụm máy
                                                        chủ {serverGroupIndex * 10 + 1} - {serverGroupIndex * 10 + 10}
                                                    </option>
                                                )
                                            }
                                        </select>
                                        <label htmlFor="server_list" className="col-sm-12 controll-label"
                                               style={{width: 'auto'}}>
                                            Chọn server:
                                        </label>
                                        <select name="server_id" className="form-control "
                                                id="server_list"
                                                disabled={this.state.isDisableSelectServers}
                                                onChange={this.handleServerChanged}
                                        >
                                            <option value="">Chọn server</option>
                                            {
                                                _.map(this.state.serversList, (serverValue, serverIndex) =>
                                                    <option key={serverIndex} value={serverValue.server_id}>
                                                        {serverValue.server_name}
                                                    </option>
                                                )
                                            }
                                        </select>
                                    </div>

                                    <div id="appentHtml">
                                        <label htmlFor="server_list"
                                               className="col-sm-12 controll-label"
                                               style={{width: 'auto'}}>&nbsp;
                                        </label>
                                        {this.state.getRoleProccessing ?
                                            <div className="custom-proccesing lds-dual-ring"></div> : ''}
                                        {
                                            this.state.rolesList !== null &&
                                            this.state.rolesList.length > 0 &&
                                            <div>
                                                <select name="rolesList" className="form-control "
                                                        id="server_list" onChange={this.changeRoleId}>
                                                    {
                                                        _.map(this.state.rolesList, (roleValue, roleIndex) =>
                                                            <option key={roleIndex}
                                                                    value={roleValue.roleId}>{roleValue.roleName}</option>
                                                        )
                                                    }
                                                </select>
                                            </div>
                                        }
                                        {
                                            this.state.rolesList !== null &&
                                            this.state.rolesList.length === 0 &&
                                            !this.state.getRoleProccessing &&
                                            <div className="role-name">
                                                Không tìm thấy nhân vật game
                                            </div>
                                        }
                                    </div>
                                    <div className="clearfix"/>
                                </div>
                            </div>
                        </div>
                        {
                            this.state.rolesList !== null &&
                            this.state.rolesList.length > 0 &&
                            <div className="message-item" id="accRang">
                                <div className="message-inner">
                                    <div className="message-head clearfix">
                                        <div className="user-detail">
                                            <h5 className="handle mr-20">Chọn gói vật phẩm</h5>
                                            <ul className="nav nav-pills">
                                                {
                                                    commonConfig.goldType.map((val, index) => {
                                                        return <li className={parseInt(val.valua) === 2 ? "active" : ""}
                                                                   key={index}><a data-toggle="pill"
                                                                                  href={'#tab-active' + val.valua}>{val.text}</a>
                                                        </li>
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="tab-content">
                                            {
                                                commonConfig.goldType.map((val, index) => {
                                                    return <div key={index} id={'tab-active' + val.valua}
                                                                className={parseInt(val.valua) === 2 ? "tab-pane fade in active" : "tab-pane fade in"}>
                                                        <h3>{val.text}</h3>
                                                        {this.state.goldsList.map((gold, goldIndex) => {
                                                            if (gold.card_month === parseInt(val.valua)) {
                                                                return <div className="gold-item" key={goldIndex}>
                                                                    <img
                                                                        src={commonConfig.assetDomain + gold.image}
                                                                        data-amount={gold.amount}
                                                                        data-gold-id={gold.id}
                                                                        onClick={this.openModal}
                                                                        alt={gold.amount}
                                                                    />
                                                                </div>
                                                            }
                                                            return null;
                                                        })}
                                                    </div>
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }


                        <div id="myModal" className="modal">
                            <div className="modal-content clearfix">
                                <h1>Xác nhận giao dịch</h1>
                                <input type="submit" name="submit" id="submitbutton"
                                       className="col-sm-3 btn btn-primary"
                                       defaultValue="Thanh toán"/>
                                <div className="clearfix"/>
                                <span className="close btn-danger">Chấp nhận</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div onClick={this.handleRefresh} className="modal modal-notification fade" tabIndex="-1" role="dialog"
                     data-backdrop="false">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <p className={"text-center"}>{this.state.modalContent}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal modal-confirm fade" tabIndex="-1" role="dialog" data-backdrop="false">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            {
                                Object.keys(chargeGameResult).length === 0
                                    ?
                                    Object.keys(this.state.chargeGameItem).length > 0 &&
                                    <div className="modal-body">
                                        <p>
                                            <b>Server:</b>&nbsp;
                                            {
                                                this.state.serversList[_.findIndex(this.state.serversList, function (item) {
                                                    return item.server_id === this.state.chargeGameItem.serverId
                                                }.bind(this))].server_name
                                            }

                                        </p>
                                        {
                                            this.state.chargeGameItem.hasOwnProperty('goldId') &&
                                            <p>
                                                <b>Gói nạp:</b>&nbsp;
                                                {
                                                    this.state.goldsList[_.findIndex(this.state.goldsList, function (item) {
                                                        return item.id === this.state.chargeGameItem.goldId
                                                    }.bind(this))].name
                                                }
                                            </p>
                                        }
                                        <p>
                                            <b>Số dư hiện tại:</b>&nbsp;{balance.toLocaleString('it-IT', {
                                            style: 'currency',
                                            currency: 'VND'
                                        })}
                                        </p>
                                        {
                                            this.state.chargeGameItem.hasOwnProperty('goldId') &&
                                            <p>
                                                <b>Số tiền cần thanh toán:</b>&nbsp;
                                                {
                                                    this.state.goldsList[_.findIndex(this.state.goldsList, function (item) {
                                                        return item.id === this.state.chargeGameItem.goldId
                                                    }.bind(this))].amount.toLocaleString('it-IT', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    })
                                                }
                                            </p>
                                        }
                                        {
                                            this.state.chargeGameItem.hasOwnProperty('goldId') &&
                                            <p>
                                                <b>Số dư còn lại:</b>&nbsp;
                                                {
                                                    (balance - this.state.goldsList[_.findIndex(this.state.goldsList, function (item) {
                                                        return item.id === this.state.chargeGameItem.goldId
                                                    }.bind(this))].amount).toLocaleString('it-IT', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    })
                                                }
                                            </p>
                                        }
                                        {
                                            this.state.chargeGameItem.hasOwnProperty('goldId') &&
                                            <p style={{color: "red"}}>
                                                {
                                                    this.state.goldsList[_.findIndex(this.state.goldsList, function (item) {
                                                        return item.id === this.state.chargeGameItem.goldId
                                                    }.bind(this))].description
                                                }
                                            </p>
                                        }
                                    </div>
                                    : (
                                        <div
                                            className={(chargeGameResult.status !== 0) ? 'text-center text-success' : 'text-center text-danger'}>
                                            {chargeGameResult.message}
                                            <p>
                                                <b>Số dư hiện tại:</b>&nbsp;{balance.toLocaleString('it-IT', {
                                                style: 'currency',
                                                currency: 'VND'
                                            })}
                                            </p>
                                        </div>
                                    )
                            }
                            <div className="modal-footer" style={{textAlign: 'center'}}>
                                {
                                    Object.keys(chargeGameResult).length === 0 ?
                                        (<button type={"button"} className="btn btn-primary"
                                                 onClick={this.chargeGame}>{this.state.inProcessing ?
                                            <div className={'dot-loader'}>
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                            </div>
                                            :
                                            'Nạp vào game'}
                                        </button>) : ''
                                }
                                <button type={"button"} className="btn btn-danger" data-dismiss="modal">Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

const mapStateToProps = state => {
    return {
        login: state.loginReducer,
        isLoadingReducer: state.isLoadingReducer,
        cardsReducer: state.cardsReducer
    };
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        getCardsList: (result) => {
            dispatch(cardsAction.getAll(result))
            // dispatch({
            //     type: "CARDS.GET_ALL",
            //     result
            // })
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Paytowallet);
