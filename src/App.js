import React, { Component } from 'react';
import './App.css';
import { connect } from "react-redux";  
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Routes from './routes';
import './assets/css/style.css';
import PrivateRoutes from "./components/PrivateRoutes";

import {
    BrowserRouter as Router,
    Route,
    Switch
} from "react-router-dom";

class App extends Component {
    render() {
        return (
            <div className="App">
                <Router>
                    <Header></Header>
                        {this.InitRoute(Routes)}
                    <Footer></Footer>
                </Router>
            </div>
        );
    }

    InitRoute = (Routes) => {
        let result = null;
        if(Routes.length > 0){
            result = Routes.map((val, index) => {
                if(val.isLogged){
                    return <PrivateRoutes key={index} path={val.path} isLogged={this.props.login.isLogged} component={val.main} exact={val.exact}></PrivateRoutes>
                }
                return (<Route key={index} path={val.path} component={val.main} exact={val.exact}></Route>)
            })
        }
        return <Switch>{result}</Switch>
    } 
}

const mapStateToProps = state => {
    return {
      login: state.loginReducer
    };
};

const mapDispatchToProps = {
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
