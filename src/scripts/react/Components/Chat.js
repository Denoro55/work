import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { networkTitle } from '../constants/AppConstants';
import io from 'socket.io-client';

import { fetchInfo, sendMessage, getMessage, fetchSession, getUser } from '../actions';

import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

let socket;
let connected = false;

class Chat extends React.Component{

	constructor(props,context){
		super(props);
		this.state = {
			text: ''
		}
		this.props.onFetchSession();
	}

	connectSocket(){
		// console.log('connecting...')
		if (!connected){

			connected = true;

			let currUrl = window.location.origin.replace('http:','');

			// console.log(currUrl)

			socket = io('ws:'+currUrl, {transports: ['websocket']});
			this.props.onGetMessages(socket);
			this.props.onGetUsers(socket);
			// this.props.onSendMessage(socket,{image: this.props.session.pic, name: this.props.session.name});
			socket.emit('hello',{image: this.props.session.pic, name: this.props.session.name})

			socket.on('hello',function(data){
				// console.log(data);
			})

			// socket.on('users',function(data){
			// 	console.log(data.users,data.type)
			// 	this.props.onUpdateUsers(data.users,data.type);
			// })
		}
	}

	componentWillUnmount(){
		if (connected){
			this.props.onSendMessage(socket,{image: this.props.session.pic, name: this.props.session.name},'left');
			socket.disconnect()
			connected = false;
		}
   	}
   	
	handleSubmit(e){
		e.preventDefault();
		this.props.onSendMessage(socket,{image: this.props.session.pic, name: this.props.session.name, text: this.state.text},'message');
		e.target.reset();
	}

	handleChange(e){
		this.setState({
			[e.target.name]: e.target.value
		})
	}

    GoToMenu(){
    	this.props.history.push(`/`);
    }

	render(){

		if (!Array.isArray(this.props.session) && this.props.session != ''){
			this.connectSocket();
		}

		// console.log('render')

		// if (this.myArea){
		// 	this.myArea.scrollTop = this.myArea.scrollHeight;
		// }

		return(
			<div>
				<div className="chat">
					<form className="chat-block" onSubmit={this.handleSubmit.bind(this)}>
						<div className="chat-body">
							{
								this.props.session.name ?
								<div className="chat-title">Welcome to the chat room, {this.props.session.name}</div>
								: <div className="chat-title" style={{color: 'red'}}>Chat is not available</div>
							}
							<ul className="chat-content" ref={(e)=>this.myArea=e}>
								{
									this.props.messages.map(function(element,i){
										let imageUrl = element.image;
									return (
										<li key={i} className="chat-message">
											{ element.image ?
											<div className="chat-avatar" style={{background: `url(${imageUrl})`}}></div>
											: <div className="chat-avatar" style={{background: `url(/images/nouser.jpg)`}}></div>
											}
											<div className="chat-message-content">
												<div className="chat-message-name">
													{element.name}
												</div>
												<div className="chat-message-text">
													{element.text}
												</div>
											</div>
										</li>
									)
								})}
							</ul>
						</div>
						{
							this.props.session.name ?
							<div>
								<div className="chat-controls">
									<input name="text" onChange={this.handleChange.bind(this)} autoComplete="off"
									className="chat-text" type="text" placeholder="Type a message"/>
								</div>
								<div className="chat-controls">
									<button>Send</button>
									<button type="reset">Reset</button>
								</div>
							</div>
							: null
						}
						<div className="back-link">
							<Link to="/">Back</Link>
						</div>
					</form>
					<div className="user-list">
						<ul className="users">
							{ this.props.users.map(function(elem,i){
								return <li key={i} className="user-item">{elem}</li>
							})
						}
						</ul>
					</div>
				</div>
				
			</div>
		)
	}
}

Chat.contextTypes = {
  router: PropTypes.object
}

const mapStateToProps = (state={}) => {
  return {
    ...state,
    session: state.session,
    users: state.users
  };
};

const mapDispatchToProps = dispatch => {
	return {
		onSendMessage: (socket,data,name) => {
			// console.log(socket,data,name)
			dispatch(sendMessage(socket,data,name));
		},
		onGetMessages: (socket) => {
			dispatch(getMessage(socket));
		},
		onFetchSession: () => {
			dispatch(fetchSession());
		},
		onGetUsers: (socket) => {
			dispatch(getUser(socket));
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Chat);