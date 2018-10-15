import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { networkTitle } from '../constants/AppConstants';

import { loginUser } from '../actions';
import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';

class Register extends React.Component{

	constructor(props,context){
		super(props);
		this.validate = this.validate.bind(this);
		this.state = {
            name: '',
            password: ''
        }
	}

	validate(e){
		e.preventDefault();
		this.props.onEnter(this.state);
		this.handleReset();
	}

	handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }

	handleReset(){
        this.setState({
            name: '',
            password: ''
        });
    }

    GoToMenu(){
    	this.props.history.push(`/`);
    }

	render(){

		var that = this;

		if (this.props.reg && this.props.reg.value=="Successfully"){
			setTimeout(function(){
				that.GoToMenu();
			},500)
		}

		return(
			<div>
				<h1> Welcome  to {networkTitle} </h1>
				<p> Page Login </p>
				<form action="/register" method="POST" className="register-form" onSubmit={this.validate}>
					<div className="form-group">
						<div className="form-title">Your name</div>
						<input value={this.state.name} onChange={this.handleChange.bind(this)} type="text" autoComplete="off" name="name" minLength={3} required></input>
					</div>
					<div className="form-group">
						<div className="form-title">Your password</div>
						<input value={this.state.password} onChange={this.handleChange.bind(this)} required type="password" name="password" ref={(e)=> this.pass1 = e}></input>
					</div>
					<div className="form-group">
						<button className="input-submit" type="submit">Submit</button>
					</div>
				</form>

				{this.props.reg ? <div style={{color: this.props.reg.color}}className="register-form-result">{this.props.reg.value}</div> : null}

				<Link to="/">Back</Link>
			</div>
		)
	}
}

Register.contextTypes = {
  router: PropTypes.object
}

const mapStateToProps = state => {
  return {
    reg: state.reg
  };
};

const mapDispatchToProps = dispatch => {
	return {
		onEnter: data => {
			dispatch(loginUser(data));
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Register);