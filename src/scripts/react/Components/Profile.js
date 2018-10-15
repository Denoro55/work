import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { networkTitle } from '../constants/AppConstants';

import CreatePost from './CreatePost';
import PostList from './PostList';

import axios, {post} from 'axios';

import { uploadPhoto, fetchInfo, fetchSession, fetchAllPosts } from '../actions';

import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

let updater;

class Register extends React.Component{

	constructor(props,context){
		super(props);

		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onError = this.onError.bind(this);

		this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
		this.props.onGetInfo(this.props.userID);

		this.state = {
			file: null,
			photo: '',
   			imageHash: Date.now(),
   			preloader: false
		}
	}

	componentWillUnmount(){
		clearTimeout(updater);
	}

	forceUpdateHandler(){
		this.forceUpdate();
	};

	onChange(e) {
		this.setState({
			file: e.target.files[0],
			photo: e.target.value
		})
	}

	onFormSubmit(e){
		console.log('submit')
		e.preventDefault() // Stop form submit
		this.fileUpload(this.state.file).then((response)=>{
			console.log('getting new picture')
			setTimeout(()=>{
				this.props.onGetInfo(this.props.userID);
			},500)
		})
	}

	fileUpload(file){
		console.log(file)
		console.log('uploading ',window.location.origin+'/uploadavatar')
		const url = window.location.origin+'/uploadavatar';
		const formData = new FormData();
		formData.append('file',file)
		const config = {
			headers: {
				'content-type': 'multipart/form-data'
			}
		}
		this.handleReset();
		return post(url, formData,config)
	}

	handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }

	handleReset(){
        this.setState({
            name: '',
            file: '',
            photo: ''
        });
    }

    GoToMenu(){
    	this.props.history.push(`/`);
    }

    HandleURL(e){
    	var n = e.target.value.lastIndexOf('\\');
    	var result = e.target.value.substring(n + 1);
    	this.setState({
            name: result,
            file: e.target.value
        });
    }

    onError(){
    	this.setState({
		   preloader: true
		})
    	updater = setTimeout(()=>{
    		this.setState({
			   imageHash: Date.now()
			})
    	},2000)
    }

    preloaderOff(){
    	this.setState({
		   preloader: false
		})
    }

	render(){

		console.log('render')

		if (this.props.info.name){
			if (this.props.userID != this.props.info.name){
				this.props.onGetInfo(this.props.userID);
			}
		}
		
        var image;

        { this.props.info ? 
			image = <img 
			onError={this.onError.bind(this)} 
			onLoad={this.preloaderOff.bind(this)}
			src={`/images/upload/${this.props.userID}/${this.props.info.pic}`} alt=""/> 
			: image = null
		}

		// { this.props.info ? 
		// 	image = <img 
		// 	onError={this.onError.bind(this)} 
		// 	onLoad={this.preloaderOff.bind(this)}
		// 	src={`/images/upload/${this.props.userID}/${this.props.info.pic}?${this.state.imageHash}`} alt=""/> 
		// 	: image = null
		// }
		
		return(
			<div>

				{/*<div className="title-block">
					<h1 className="main-title"> Welcome to {networkTitle} </h1>
					<div className="back-link">
						<Link to="/">Back</Link>
					</div>
				</div>*/}

				<div className="profile">
					<div className="profile__left">
					<div className="profile-name">{this.props.info.name}</div>
					<div className="profile-main">
						<div className="profile-image">
							{image}
							{this.state.preloader ? <img className="preloader" src='../../../images/preloader.gif' alt="" /> : null}
						</div>
						{ this.props.info.owner ? 
						<form className="upload-account-photo form" id="upload" action="/uploadavatar" 
						method="POST" encType="multipart/form-data">
						    <label className="form__input-line">
						    	<input ref={(e)=>this.imageName=e} className="form__input" name="name" type="text" 
						    	placeholder="Описание картинки" defaultValue={this.props.name} style={{display: 'none'}} 
						    	id="file-desc"/>
						    </label>
						    <div className="form__input-line upload-block">
						    	<input onChange={this.onChange}
						    	className="inputfile form__input" name="photo" 
						    	type="file" required="required" accept="image/*" id="file-select" />
						    	<label className="upload-label" htmlFor="file-select">Load image</label>
						        <div className="loaded-pic"></div>
						    </div>
						    <div className="status">{this.state.photo}</div>
						    <div className="form__btns form__input-line">
							    <button className="change-avatar" type="submit">Change photo</button>
							    <button className="change-avatar" type="reset" onClick={this.handleReset.bind(this)}>Reset</button>
						    </div>
						</form>
						: null }
						{ this.props.info.owner ? 
						<div className="create-post">
				        	<CreatePost />
				        </div> : null }
				        <div className="back-link">
							<Link to="/">Back</Link>
						</div>
					</div>

					</div>
					<div className="profile__right">
				        <div>
				        	<PostList />
				        </div>
					</div>
					
				</div>
				
			</div>
		)
	}
}

Register.contextTypes = {
	router: PropTypes.object
}

const mapStateToProps = (state,ownProps) => {
	return {
		session: state.session,
		info: state.info,
		userID: ownProps.match.params.id
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onUpload: (data) => {
			dispatch(uploadPhoto(data));
		},
		onGetInfo: (name) => {
			dispatch(fetchInfo(name));
		},
		onAddInfo: (name) => {
			dispatch({type: 'USER_INFO', info: name})
		},
		onFetchSession: () => {
			dispatch(fetchSession());
		},
		onUploadPosts: (id) => {
			dispatch(fetchAllPosts(id))
		}

	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Register);