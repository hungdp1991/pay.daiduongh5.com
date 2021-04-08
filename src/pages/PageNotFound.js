import React, { Component } from 'react'
import "../assets/css/404.css"
import { Link } from "react-router-dom";

export default class PageNotFound extends Component {
    render() {
        return (
            <div id="notfound">
                <div className="notfound">
                    <div className="notfound-404">
                        <h1>404</h1>
                    </div>
                    <h2>Oops! Không có trang được tìm thấy</h2>
                    <p>Trang đang tìm kiếm có thể bị xóa hoặc không tồn tại. <Link to="/">Trang chủ</Link></p>
                </div>
            </div>
        )
    }
}
