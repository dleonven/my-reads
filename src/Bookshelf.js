import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Route } from 'react-router-dom'
import escapeRegExp from 'escape-string-regexp'
import * as BooksAPI from './BooksAPI'
import SearchBooks from './SearchBooks.js'
import ListBooks from './ListBooks.js'
import Book from './Book.js'
import BookshelfTitle from './BookshelfTitle.js'


class Bookshelf extends Component {

	render(){
    	return (
          <div className="bookshelf">
      		<BookshelfTitle shelfName={this.props.shelfName}/>
          	<div className="bookshelf-books">

          		{/*map the list of books recieved as prop (the list can be the 'currently reading', 'want to read' or 'read' books)*/}
          		<ol className="books-grid">
          				{this.props.list.map((book) =>
							<li key={book.id}>
          						<Book
									book={book}

                                    //this prop comes from the ListBooks component, but i didn't know how to pass it directly, so i had to pass it twice...it gives the value to the select
      								value={this.props.shelfName}

      								//this prop comes from the ListBooks component, but i didn't know how to pass it directly, so i had to pass it twice
      								callback={this.props.callback}
      							/>
                            </li>)}
                     </ol>
          	</div>
          </div>
        )
    }
}

export default Bookshelf;
