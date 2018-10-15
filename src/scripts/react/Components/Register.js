import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { networkTitle } from '../constants/AppConstants';

import { createUser } from '../actions';

import { connect } from 'react-redux';

class Register extends React.Component{

	constructor(props){
		super(props);
		this.validate = this.validate.bind(this);
		this.state = {
            name: '',
            password: ''
        }
	}

	validate(e){
		e.preventDefault();
		if (this.pass1.value == this.pass2.value){
			this.props.onAddUser(this.state);
			this.handleReset();
			this.pass2.value = '';
		} else {
			this.props.onErrorPassword();
		}
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

	render(){

		return(
			<div>
				<h1> Welcome  to {networkTitle} </h1>
				<p> Page Registration </p>
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
						<div className="form-title">Repeat password</div>
						<input required type="password" name="password2" ref={(e)=> this.pass2 = e}></input>
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

const mapStateToProps = state => {
  return {
    reg: state.reg
  };
};

const mapDispatchToProps = dispatch => {
	return {
		onAddUser: user => {
			dispatch(createUser(user));
		},
		onErrorPassword: () => {
			dispatch({type: 'REG_RESULT', obj: {value: 'Passwords are not identical', color: 'red'}})
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Register);