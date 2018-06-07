import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Route } from 'react-router-dom'
import escapeRegExp from 'escape-string-regexp'
import * as BooksAPI from './BooksAPI'
import SearchBooks from './SearchBooks.js'
import ListBooks from './ListBooks.js'


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

export default BooksApp;
