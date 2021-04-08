import React, { Component } from 'react'
import HistoryPayFilter from './HistoryPayFilter'
import PayBreadcrumb from './PayBreadcrumb'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';

class PayToGameHistory extends Component {
    constructor(props){
        super(props)
        this.state = {
            payToGameHistory: [],
            gameData: []
        }
    }

    getChildData = (data, gameData) => {
        this.setState({
            payToGameHistory: data,
            gameData: gameData
        });
    }

    render() {
        let {match} = this.props
        let {payToGameHistory, gameData} = this.state;
        let dataElement = null;
        if(payToGameHistory.length > 0)
        {
            dataElement = payToGameHistory.map((val, index) => {
                const gameInfo = gameData.filter(e => e.agent.includes(val.product_id));
                return (<tr key={index}>
                            <td>{val.transaction_id}</td>
                            <td>{val.amount.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</td>
                            <td>{val.gold}</td>
                            <td>{gameInfo[0].name}</td>
                            <td>{val.server_id}</td>
                            <td>{val.card_status}</td>
                            <td>{val.create_date}</td>
                        </tr>)
            })
        }
        return (
            <div className="container paytogamehistory">
                <div className="row box">
                    <PayBreadcrumb match={match}></PayBreadcrumb>
                    <h3>Lịch sử nạp vào game</h3>
                    <HistoryPayFilter setData={this.getChildData}></HistoryPayFilter>
                    <div className="table-responsive" style={{width: '100%'}}>
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <td>Transaction ID</td>
                                    <td>Mệnh giá</td>
                                    <td>Giá trị duy đổi</td>
                                    <td>Game</td>
                                    <td>Server</td>
                                    <td>Trạng thái nạp vào game</td>
                                    <td>Ngày thực hiện</td>
                                </tr>
                                {
                                    dataElement !== null?dataElement:
                                    <tr>
                                        <td>Không có dữ liệu</td>
                                        <td />
                                        <td />
                                        <td />
                                        <td />
                                        <td />
                                        <td />
                                    </tr>
                                }
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    historyReducer: state.historyReducer,
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PayToGameHistory));