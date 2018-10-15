import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { networkTitle } from '../constants/AppConstants';
import { fetchSession, exitSession } from '../actions';

import { getAsyncTracks } from '../actions/name';

class App extends React.Component{

	constructor(props){
		super(props);
		this.props.clearRegResult();
		this.props.onFetchSession();
	}

	addSkill(e){
		console.log(e.target)
		this.props.onAddSkill(this.disInput.value);
	}

	addName(e){
		this.props.onAddName();
	}

	UserExit(e){
		e.preventDefault();
		this.props.onExit();
	}

	render(){

		console.log('render')
		
		return(
			<div className="menu">

				<h1> Welcome to {networkTitle} </h1>

				{ this.props.session.name ?
					<h3> User {this.props.session.name} </h3>
					: null
				}

				<ul className="menu__list">
					<li>
						{ this.props.session.name ?
							<Link to={`/user/${this.props.session.name}`}>Profile</Link>
							: null
						}
					</li>
					<li>
						<Link to={`/login`}>Login</Link>
					</li>
					<li>
						<Link to={`/register`}>Register</Link>
					</li>
					<li>
						<Link to={`/chat`}>Chat</Link>
					</li>
					{/*
					<li>
						<input className="input-text" type="text" ref={(e)=>this.disInput = e}></input>
						<a onClick={this.addSkill.bind(this)}>Dispatch to Skills</a>
					</li>
					<li>
						<div className="skill-list">
							{this.props.skills.map(function(item,i){
								return <div key={i}>{item.skill}</div>
							})}
						</div>
					</li>
					<li>
					</li>
					<li>
						<a onClick={this.addName.bind(this)}>Dispatch Async to Names</a>
					</li>
					*/}
					<li>
						<Link onClick={this.UserExit.bind(this)} to={`/exit`}>Exit</Link>
					</li>
				</ul>
			</div>
		)
	}
}

export default connect(
	(state,ownProps) => ({
		skills: state.skills,
		ownProps,
		session: state.session
	}),
	dispatch => ({
		onAddSkill: (skillname) => {
			const skill = {
				id: Date.now().toString(),
				skill: skillname
			}
			dispatch({type: 'ADD_SKILL', skill})
		},
		onAddName: () => {
			dispatch(getAsyncTracks())
		},
		clearRegResult: () => {
			dispatch({type: 'REG_RESULT', obj: null })
		},
		onFetchSession: () => {
			dispatch(fetchSession());
		},
		onExit: () => {
			dispatch(exitSession());
		}
	})
)(App);