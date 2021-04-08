import React, { Component } from 'react';
import { connect } from 'react-redux';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import sliderActions from "../../actions/slider.actions";
import $ from "jquery";

class MainSlider extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            sliders: {}
        }
    }

    componentDidMount(){
        let {sliders} = this.props;
        if ($.isEmptyObject(sliders)) {
            this.props.getAllRequest();
        }
    }

    static getDerivedStateFromProps(props) {
        return {
            sliders: props.sliders
        }
    }

    render() {
        var { sliders } = this.state;
        return (
            <div>
                {
                    sliders.length > 0 
                    ?
                    <OwlCarousel
                        className="owl-theme"
                        loop
                        items={1}
                        autoplay={true}
                        autoplayTimeout={5000}
                    >
                        {sliders.map((val, index) => (
                            <div className="main_slide_item" key={index}>
                                <a target="blank" rel="noopener noreferrer" href={val.link}>
                                    <img className="img-responsive" alt={val.image} src={val.image} />
                                </a>
                            </div>
                        ))}
                    </OwlCarousel>
                    :
                    null
                }   
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    sliders: state.sliderReducer
})

const mapDispatchToProps = (dispatch, props) => {
    return {
        getAllRequest: async () => {
            await dispatch(sliderActions.getAllRequest())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainSlider)