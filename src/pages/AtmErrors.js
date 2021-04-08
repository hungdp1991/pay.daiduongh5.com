import React, { Component } from 'react'
import * as _ from 'lodash';

export default class AtmErrors extends Component {

    constructor(props){
        super(props)
        this.state = {
            isLoading: false
        }
    }

    componentDidMount(){
        let queryString = require('query-string');
        let strParams = this.props.match.location.search;
        let params = queryString.parse(strParams);
        if (_.has(params, 'status')) {
            let modalATMReport = window.$('.modal-atm-report');
            modalATMReport.modal('show');
            modalATMReport.on('click', function () {
                modalATMReport.modal('hide')
            });
        }else{
            this.setState({
                isLoading: true
            })
        }
    }

    handleRefresh = (event) =>{
        event.preventDefault();
        window.location.href = '/';
    }
    
    render() {
        if(this.state.isLoading){
            return  <div style={{textAlign: "center"}}>
                        <div className="lds-dual-ring"></div>
                    </div>
        }
        return (
            <div>
                <div onClick={this.handleRefresh} className="modal modal-atm-report fade" tabIndex="-1" role="dialog" data-backdrop="false">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <p className={"text-center"}>Nạp ATM không thành công</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
