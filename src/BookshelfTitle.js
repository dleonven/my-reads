import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Route } from 'react-router-dom'
import escapeRegExp from 'escape-string-regexp'
import * as BooksAPI from './BooksAPI'
import SearchBooks from './SearchBooks.js'
import ListBooks from './ListBooks.js'
import Book from './Book.js'

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
