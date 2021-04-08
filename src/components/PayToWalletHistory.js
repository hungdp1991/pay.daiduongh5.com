import React, { Component } from 'react'
import HistoryPayFilter from './HistoryPayFilter'
import PayBreadcrumb from './PayBreadcrumb'
import { withRouter } from 'react-router-dom';

class PayToWalletHistory extends Component {

    constructor(props){
        super(props)
        this.state= {
            historyCard: [],
            gameData: []
        }
    }

    getChildData = (data, gameData) => {
        this.setState({
            historyCard: data,
            gameData: gameData
        });
    }

    render() {
        let {match} = this.props
        let {historyCard, gameData} = this.state;
        let historyElement = null;
        if(historyCard.length > 0)
        {
            historyElement = historyCard.map((val, index) => {
                const gameInfo = gameData.filter(e => e.agent.includes(val.product_id));
                if(val.card_type !== 'GOLD'){
                    return (<tr key={index}>
                        <td>{val.transaction_id}</td>
                        <td>{gameInfo[0].name}</td>
                        <td>{val.card_type}</td>
                        <td>{val.amount.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</td>
                        <td>{val.gold}</td>
                        <td>{val.card_status}</td>
                        <td>{val.card_message}</td>
                        <td>{val.create_date}</td>
                    </tr>)
                }

                return null;
            })
        }
        return (
            <div className="container paytogamehistory">
                <div className="row box">
                    <PayBreadcrumb match={match}></PayBreadcrumb>
                    <h3>Lịch sử ví</h3>
                    <HistoryPayFilter setData={this.getChildData}></HistoryPayFilter>
                    <div className="table-responsive" style={{width: '100%'}}>
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <td>Transaction ID</td>
                                    <td>Game</td>
                                    <td>Loại thẻ</td>
                                    <td>Mệnh giá</td>
                                    <td>Giá trị duy đổi</td>
                                    <td>Mã lỗi</td>
                                    <td>Thông báo</td>
                                    <td>Ngày thực hiện</td>
                                </tr>
                                {
                                    historyElement !== null?
                                    historyElement:
                                    <tr>
                                        <td>Không có dữ liệu</td>
                                        <td />
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


export default withRouter(PayToWalletHistory);