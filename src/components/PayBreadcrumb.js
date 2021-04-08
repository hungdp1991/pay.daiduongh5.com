import React, { Component } from 'react'
import { NavLink } from "react-router-dom";

export default class PayBreadcrumb extends Component {

    render() {
        let {match} = this.props
        let payUrl = "/nap-vi/"+match.params.slug+'/'+match.params.id
        return (
            <div className="tab-Switch">
                <NavLink to={payUrl}>Nạp thẻ</NavLink>
                <NavLink to={"/lich-su-vi/"+match.params.slug+"/"+match.params.id}>Lịch sử ví</NavLink>
                <NavLink to={"/lich-su-game/"+match.params.slug+"/"+match.params.id}>Lịch sử game</NavLink>
            </div>
        )
    }
}
