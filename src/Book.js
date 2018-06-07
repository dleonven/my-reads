import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Route } from 'react-router-dom'
import escapeRegExp from 'escape-string-regexp'
import * as BooksAPI from './BooksAPI'
import SearchBooks from './SearchBooks.js'
import ListBooks from './ListBooks.js'

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


export default Book;
