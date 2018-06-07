import React, { Component } from 'react'

class BookshelfTitle extends Component {
	render(){
    	return (
          <div>
      		<h2 className="bookshelf-title">{this.props.shelfName}</h2>
          </div>
        )
    }
}

export default BookshelfTitle;
