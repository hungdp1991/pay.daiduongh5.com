import React, { Component } from 'react'
import { connect } from "react-redux";
import postActions from "../actions/post.actions";
 
class Detail extends Component {
    constructor(props){
        super(props)
        this.state = {
            postDetail: null
        }
    }

    componentDidMount(){
        this.props.getDetailPost(this.props.slug);
    }   

    componentDidUpdate(prevProps) {
        if (prevProps.slug !== this.props.slug) {
            this.props.getDetailPost(this.props.slug);
        }
    }
      
    render() {
        let {postsReducer} = this.props
        return (
            <div>
            { 
                postsReducer.detailPost !== null ?
                    <div className="container content">
                        <h3>{postsReducer.detailPost.title}</h3>
                        <div className="desc">
                            <span>MKT</span>
                            <span>{postsReducer.detailPost.created_at}</span>
                        </div>
                        <div className="main-content" dangerouslySetInnerHTML={ { __html: postsReducer.detailPost.content } }>
                        </div>
                    </div>
                :null
            }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        postsReducer: state.postReducer
    }
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        getDetailPost: (slug) => {
            return dispatch(postActions.getPostDetailRequest(slug))
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Detail);