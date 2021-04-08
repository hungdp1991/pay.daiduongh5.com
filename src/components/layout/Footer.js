import React, {Component} from 'react'
import logo from "../../assets/images/logo.png"
import warning from "../../assets/images/warning.jpg"

export default class Footer extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="clearfix"></div>
                <hr/>
                <div className="pd-footer">&nbsp;</div>
                <div className="container-fuild footer">
                    <div className="row">
                        <div className="logo-footer col-md-2">
                            <img alt={""} style={{width: '100px'}} className="logo-in-footer" src={logo}></img>
                        </div>
                        <div className="col-md-8 text-center">

                            <p className="mb-1">Sản phẩm được vận hành bởi Công ty
                                TNHH Dịch Vụ Giải Trí <b>Phượng Hoàng</b></p><p className="mb-1">Giấy
                            phép G1 số: <b data-v-26370743="">221/GP-BTTTT</b> cấp ngày <b
                                data-v-26370743="">26/05/2020</b></p><p className="mb-1">Chịu trách nhiệm nội dung:
                            Ông Trần Lê Đông Nguyên</p><p className="mb-1"> Hotline: <a href="tel:0923104449"
                                                                                        className="text-primary-color">0923104449</a> -
                            Email: <a href="mailto: cskh@phoeniz.com"
                                      className="text-primary-color">cskh@phoeniz.com</a></p><p className="mb-1">Báo
                            lỗi: <span><a href="https://cskh.phoeniz.com" target="_blank"
                                          className="text-primary-color">cskh.phoeniz.com</a></span>
                        </p>
                            <p className="mb-1">Địa chỉ: Tầng trệt, Tòa nhà Centre Point, 106 Nguyễn Văn Trỗi,
                                Phường 8, Quận Phú Nhuận, Thành Phố Hồ Chí Minh</p><p className="mb-1"><a
                            href="https://phoeniz.vn/dieu-khoan" target="_blank" className="text-primary-color">Điều
                            khoản</a></p><p className="mb-1">Chơi quá 180 phút một ngày sẽ ảnh hưởng xấu đến sức
                            khỏe</p>
                        </div>

                        <div className="logo-footer col-md-2">
                            <img alt={""} className="logo-in-footer" src={warning}></img>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
