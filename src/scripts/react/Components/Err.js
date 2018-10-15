import React from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';

class App extends React.Component{

	render(){

		return(
			<div className="menu">
				<h1> Hello from SocialNetwork </h1>
				<p> Error 404! Page not found </p>
				<Link to="/">Back</Link>
			</div>
		)
	}
}

export default connect(
	(state,ownProps) => ({
		testStore: state,
		ownProps
	}),
	dispatch => ({

	})
)(App);