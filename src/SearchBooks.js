import React, { Component } from 'react'
import * as BooksAPI from './BooksAPI'
import Book from './Book.js'



class SearchBooks extends Component {

  state = {
    query: '',
    queryBooks: [],
    displayedBooks: []
  }


  //function that re-sets the query (i took this from the classes examples)
  clearQuery = () => {
    this.setState({query: ''})
  }

	//function that updates the query books with the API call
    updateQueryBooks = (query,num) => {

      //this if handles the error that the app was throwing when the user deleted the query until it was blank
      if(query !== ''){
        	//gets the query books from the API and sets the state.queryBooks to them
            BooksAPI.search(query,num).then(
              (books) => {this.setState({ queryBooks: books })}
              ).catch("fatal error")
      }
    }


	//function that updates the query
	upadteQuery = (query) => {

      	//updates the query state (i took this from the classes examples, not quite sure how the .trim works)
    	this.setState({query: query.trim() })

      	//call the method that updates the query books, giving 20 as maximum results (the .ReadMe said that, but i'm not sure if that was what the rubric asked for)
      	this.updateQueryBooks(query,20)
  	}


    //function passed as prop to the Book component
	//updates the shelf of the books from the Search component, at an API level (for when the user changes it)
	shelfUpdateSearch = (bookID, newShelf) => {

            let modifiedBookFinder = this.state.queryBooks.filter(book => book.id === bookID)
			const modifiedBook = modifiedBookFinder[0]

        	const updateBook = BooksAPI.update(modifiedBook, newShelf)

            updateBook.then(
              () => {
                BooksAPI.search(this.state.query).then((books) => {
                  this.setState({queryBooks: books})
                  }).catch("fatal error")
              }
            )
    }


	//from the API, get the list of books that are currently on a shelf, and set the displayed books to all that list
	//I used this here just to be able to know if the books that comes from the search are in the books with shelves, and if they do, then grab that shelf value and pass it as prop to the Book component
	componentDidMount(){
    	BooksAPI.getAll().then((books) => {
      this.setState({displayedBooks: books})
    }).catch("fatal error")
    }

	//function used to know if a book that comes from the search is currently on the books with shelves, if it is then return the shelf value, if not returns "none" (to pass that value as prop to the Book component)
	shelfValue = (bookID) => {

     let displayedBookFinder = this.state.displayedBooks.filter(book => book.id === bookID)
	 const displayedBook = displayedBookFinder[0]
     let shelf

     //if the book from the search is currently in the books with shelves
     if(typeof displayedBook !== "undefined"){
       shelf = displayedBook.shelf

       if(shelf==="wantToRead"){
      	shelf = "Want to Read"
       }
       else if(shelf==="read"){
      	shelf = "Read"
       }
       else if(shelf==="currentlyReading"){
      	shelf = "Currently Reading"
       }
       return shelf
     }

      //otherwise
      return "None"

    }

	render (){

		return (
        	<div className="search-books">
            <div className="search-books-bar">
              <a
          		className="close-search"
          		onClick={this.props.onCloseSearch}>Close
			  			</a>
              <div className="search-books-input-wrapper">
                <input
					type="text"
					placeholder="Search by title or author"

             		//i took this from the classes examples
					onChange={(event) => this.upadteQuery(event.target.value)}
				/>

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">

				{/*if the query is not empty ('') and there queryBooks is not undefined...
        this 'if' is here so that books are not rendered whenever the query is empty and to control
        the undefined error*/}
				{this.state.query !== '' && typeof this.state.queryBooks.length !== "undefined" &&
                  this.state.queryBooks.map((book) =>
                                          <li key={book.id}>
												<Book
												  book={book}
												  callback={this.shelfUpdateSearch}
												  value={this.shelfValue(book.id)}
												/>
											</li>

                                          )}</ol>
            </div>
          </div>
        )
    }
}






export default SearchBooks;
