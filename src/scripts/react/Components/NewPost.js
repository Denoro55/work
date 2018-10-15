import React from 'react';

class NewPost extends React.Component {

  constructor(props){
        super(props)
        this.state = {
            title: '',
            body: ''
        }
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleReset(){
        this.setState({
            title: '',
            body: ''
        });
    }

    handleSubmit(e){
        e.preventDefault();
        if (this.state.title.trim() && this.state.body.trim()) {
            this.props.onAddPost(this.state);
            this.handleReset();
        }
    };

  render() {
    return (
      <div>
          <form className="create-post-form" onSubmit={ this.handleSubmit.bind(this) }>
          <div className="form-group input-title">
              <input
              type="text"
              placeholder="Title"
              className="form-control"
              name="title"
              onChange={this.handleChange.bind(this)}
              value={ this.state.title }
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <textarea
              cols="19"
              rows="8"
              placeholder="Body"
              className="form-control"
              name="body"
              onChange={this.handleChange.bind(this)}
              value={ this.state.body }>
            </textarea>
          </div>
          <div className="form-group form-controls-bottom">
            <button type="submit" className="btn btn-primary">Add Post</button>
            <button type="button" className="btn btn-warning" onClick={ this.handleReset.bind(this) }>
              Reset
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default NewPost;