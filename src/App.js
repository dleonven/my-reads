import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Route } from 'react-router-dom'
import escapeRegExp from 'escape-string-regexp'
import * as BooksAPI from './BooksAPI'
import './App.css'



class BookshelfTitle extends Component {
	render(){
    	return (
          <div>
      		<h2 className="bookshelf-title">{this.props.shelfName}</h2>
          </div>
        )
    }
}


class Book extends Component {

  constructor(props) {
    super(props);
    this.onShelfChange = this.onShelfChange.bind(this);
  }

  //state to know the value of the book's shef...i had to add this to be able to handle the user shelf changes in the search component at a front-end level
  state = {
  	shelf: this.props.value
  }

  //function called when the shelf of a book is changed in the select
  onShelfChange(e){
    //get the newShelf from the 'select'
    let newShelf = e.target.value

   this.setState({shelf: newShelf})

	//change the string to be able to call the API
    if(newShelf==="Want to Read"){
      newShelf = "wantToRead"
       }
    else if(newShelf==="Read"){
      newShelf = "read"
            }
    else if(newShelf==="Currently Reading"){
      newShelf = "currentlyReading"
            }

    //get the bookID passed from parent component
    const bookID = this.props.book.id

    //call the function that was passed as prop...this function is in the ListBooks component as a well as in the Search component, so depending on where the modified book was, which one is called, and it updates the shelf at an API level
    this.props.callback(bookID, newShelf)
  }

	//function that returns the style of the book...if the book has an image, returns the style with the backgroundImage, otherwise it returns the style without it
	getStyle = (book) => {
      const imageLink = book.imageLinks
			if(typeof imageLink !== "undefined"){
          		return { width: 128, height: 193, backgroundImage: `url(${imageLink.thumbnail})`}
        	}
      return { width: 128, height: 193 }
      }

  render(){

    	return (
          <div className="book">
          	<div className="book-top">
          		<div className="book-cover" style={this.getStyle(this.props.book)}></div>
        <div className="book-shelf-changer">
       		<select value={this.state.shelf} onChange={this.onShelfChange}>
            	<option>Currently Reading</option>
               	<option>Want to Read</option>
                <option>Read</option>
                <option>None</option>
            </select>
        </div>
          	</div>

      		<div className="book-title">{this.props.book.title}</div>
      		<div className="book-authors">{this.props.book.authors}</div>
          </div>
        )
    }
}

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

				{/*if the query is not empty ('')...this 'if' is here so that books are not rendered whenever the query is empty*/}
				{this.state.query !== '' &&
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


//component that renders the ListBooks component and Search component, and has al the Routing logic (the one i got from the classes examples)
class BooksApp extends Component {
  render (){
    return (
    <div className="App">
      <Route exact path="/" render={() => (
    	<div>
      		<ListBooks/>
      		<div className="open-search">
      			<Link
      			to="/search"
      			className="search-book"
      			>Add a Book</Link>
      		</div>
      	</div>
      )}/>

	<Route path="/search" render={({ history }) => (
    	<div>
      		<SearchBooks onCloseSearch={() => (history.push('/'))}/>
      	</div>
                                  )}/>
    </div>
    )
  }
}

export default BooksApp
