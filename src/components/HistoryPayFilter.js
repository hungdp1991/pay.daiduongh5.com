import React, {Component} from 'react'
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import {connect} from 'react-redux'
import historyActions from "../actions/history.actions"
import gameActions from "../actions/games.actions"
import {withRouter} from 'react-router-dom';

class HistoryPayFilter extends Component {

    constructor(props) {
        super(props);
        var date = new Date();
        var currentDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        var currentDateRequest = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        this.state = {
            data: [],
            sltGame: '',
            inputStart: currentDate,
            inputFinish: currentDate,
            formDate: currentDateRequest,
            toDate: currentDateRequest,
            isFilter: false
        };
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value,
            isFilter: false
        });
    }

    handleEvent = (event, picker) => {
        this.setState({
            inputStart: picker.startDate.format('DD/MM/YYYY'),
            inputFinish: picker.endDate.format('DD/MM/YYYY'),
            formDate: picker.startDate.format('YYYY-MM-DD'),
            toDate: picker.endDate.format('YYYY-MM-DD'),
            isFilter: false
        });
    }

    handleFilter = (e) => {
        e.preventDefault();
        let {login} = this.props;
        // let username = JSON.parse(localStorage.getItem('user')).data.username;
        if (this.state.isFilter) {
            return false;
        }

        this.setState({
            isFilter: true
        })

        let username = login.data.username;
        if (this.props.match.url.includes('lich-su-game')) {
            this.props.filterPayToGameHistory(username, this.state.sltGame, this.state.formDate, this.state.toDate)
        } else {
            this.props.filterCardHistory(username, this.state.sltGame, this.state.formDate, this.state.toDate)
        }

        console.error()
    }

    componentDidUpdate() {
        if (this.props.match.url.includes('lich-su-game')) {
            if (this.props.historyReducer.payToGameHistory.length > 0) {
                this.props.setData(this.props.historyReducer.payToGameHistory, this.props.gamesReducer.data)
            } else {
                this.props.setData([])
            }
        } else {
            if (this.props.historyReducer.cardHistory.length > 0) {
                this.props.setData(this.props.historyReducer.cardHistory, this.props.gamesReducer.data)
            } else {
                this.props.setData([])
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (Object.keys(nextProps.gamesReducer.data).length === 0) {
            nextProps.getGameList();
        }
        return null;
    }

    render() {
        let gameElement = null
        if (this.props.gamesReducer['data'].length > 0) {
            gameElement = this.props.gamesReducer['data'].map((val, index) => {
                return <option key={index} value={val.agent}>{val.name}</option>
            })
        }
        return (
            <form method="POST" name="cardhistory" onSubmit={this.handleFilter} id="cardhistory">
                <div className="box-row width-100"><label htmlFor="config-form"
                                                          className="col-sm-2 controll-label">Product:</label>
                    <select name="sltGame" className="form-control" id="config-form" onChange={this.handleChange}>
                        <option value={""}>All</option>
                        {gameElement}
                    </select>
                </div>
                <div className="box-row width-100">
                    <label htmlFor="config-demo" className="controll-label col-sm-2">Time:</label>
                    <DateRangePicker
                        autoApply={true}
                        autoUpdateInput={false}
                        startDate={this.state.inputStart}
                        endDate={this.state.inputFinish}
                        locale={{format: "DD/MM/YYYY"}}
                        onEvent={this.handleEvent}
                    >
                        <input
                            type="text"
                            name="txtDaterange"
                            value={this.state.inputStart + ' - ' + this.state.inputFinish}
                            readOnly={true}
                            className="form-control"
                        />
                    </DateRangePicker>
                </div>
                {/* <button id="submitbutton" className="col-sm-2 btn btn-primary">Search</button> */}
                <button disabled={this.props.isLoadingReducer.isLoading} id="submitbutton"
                        className="col-sm-2 btn btn-primary">{this.props.isLoadingReducer.isLoading ?
                    <div className={'dot-loader'}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    : 'Tìm kiếm'}</button>
            </form>
        )
    }
}

const mapStateToProps = (state) => ({
    login: state.loginReducer,
    gamesReducer: state.gamesReducer,
    historyReducer: state.historyReducer,
    isLoadingReducer: state.isLoadingReducer
})

const mapDispatchToProps = (dispatch, props) => {
    return {
        filterCardHistory: (username, game, formDate, toDate) => {
            dispatch(historyActions.getCardHistoryRequest(username, game, formDate, toDate))
        },
        filterPayToGameHistory: (username, game, formDate, toDate) => {
            dispatch(historyActions.filterPayToGameHistoryRequest(username, game, formDate, toDate))
        },
        getGameList: () => {
            dispatch(gameActions.getAllRequest())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HistoryPayFilter));