import React, { Component } from 'react'
import Detail from '../../components/Detail'
import MainSlider from '../../components/layout/MainSlider'


export default class Detailpage extends Component {
    render() {
        return (
            <React.Fragment>
                <MainSlider></MainSlider>
                <Detail slug={this.props.match.params.slug}></Detail>
            </React.Fragment>
        )
    }
}
