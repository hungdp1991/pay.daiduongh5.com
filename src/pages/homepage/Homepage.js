import React, { Component } from 'react'
import Games from '../../components/layout/Games'
import MainSlider from '../../components/layout/MainSlider';

export default class Homepage extends Component {
    render() {
        return (
            <React.Fragment>
                <MainSlider></MainSlider>
                <Games></Games>
            </React.Fragment>
        )
    }
}
