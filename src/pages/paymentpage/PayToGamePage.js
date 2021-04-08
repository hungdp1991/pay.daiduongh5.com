import React, { Component } from 'react'
import Paytogame from '../../components/Paytogame'

class PayToGamePage extends Component {
    render() {
        return (
            <Paytogame match={this.props.match}></Paytogame>
        )
    }
}

export default PayToGamePage