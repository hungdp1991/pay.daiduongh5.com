import React, { Component } from 'react'
import Paytowallet from "../../components/Paytowallet"

export default class PaytowalletPage extends Component {
    render() {
        return (
            <Paytowallet match={this.props.match}></Paytowallet>
        )
    }
}
