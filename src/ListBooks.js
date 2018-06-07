import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Route } from 'react-router-dom'
import escapeRegExp from 'escape-string-regexp'
import * as BooksAPI from './BooksAPI'
import SearchBooks from './SearchBooks.js'
import Book from './Book.js'
import Bookshelf from './Bookshelf.js'



class ListBooks extends Component {

  state = {
  	displayedBooks: []
  }

	//from the API, get the list of books that are currently on a shelf, and set the displayed books to all that list
	setDisplayedBooks(){
    	BooksAPI.getAll().then((books) => {
      this.setState({displayedBooks: books})
    }).catch("fatal error")
    }

	//when the component mounts, set the displayed books to the whole list of books
	componentDidMount() {
    	this.setDisplayedBooks()
  	}

	  //updates the shelf of the books that have shelves at an API level
      shelfUpdateListBooks = (bookID, newShelf) => {

        	//get modified book
            let modifiedBookFinder = this.state.displayedBooks.filter(book => book.id === bookID)
            const modifiedBook = modifiedBookFinder[0]

            //API call to update the book's shelf
        	const updateBook = BooksAPI.update(modifiedBook, newShelf)

            updateBook.then(
              () => {
                BooksAPI.getAll().then((books) => {
                  this.setState({displayedBooks: books})

                  //this catch i'm not sure if it's doing anything
                  }).catch("fatal error")
              }
            )
      }


	render(){

      //get the different lists of shelves from the currently displayed books
      let currentlyReading = this.state.displayedBooks.filter((book) => book.shelf === "currentlyReading")
      let read = this.state.displayedBooks.filter((book) => book.shelf === "read")
      let wantToRead = this.state.displayedBooks.filter((book) => book.shelf === "wantToRead")

      return (

          <div className="list-books">
      		<div className="list-books-title">
          		<h1>My Reads</h1>
          	</div>

      		{/*I didn't know how to send the callback from one place so i sent it the 3 times*/}
            <div>
              <Bookshelf shelfName="Currently Reading" list={currentlyReading} callback={this.shelfUpdateListBooks}/>
            </div>

            <div>
              <Bookshelf shelfName="Want to Read" list={wantToRead} callback={this.shelfUpdateListBooks}/>
            </div>

            <div>
              <Bookshelf shelfName="Read" list={read} callback={this.shelfUpdateListBooks}/>
            </div>

          </div>

        )
    }
}

export default ListBooks;
