import React, { Component } from 'react';
import './App.css';
import Sidebar from './components/sidebar'
import NoteDetail from './components/detail'
import SearchBar from './components/searchbar'
import _ from 'lodash'
import { Grid } from 'semantic-ui-react'
import NewNoteForm from './components/NewNoteForm'
import {Switch, Route, Redirect } from 'react-router-dom'

const noteAPI = 'http://localhost:4000/api/v1/notes'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      notes: [],
      selectedNote: null
    }

    this.getNotes()
  }
  getNotes(searchTerm = null) {
    if (searchTerm) {
      fetch(noteAPI)
        .then(res => res.json())
        .then(notes => {
          this.setState({
            notes: notes.filter(note => { return note.title.includes(searchTerm) }),
            selectedNote: null
          })
        })
    } else {
      fetch(noteAPI)
        .then(res => res.json())
        .then(notes => {
          this.setState({
            notes: notes,
            selectedNote: null
          })
        })
    }
  }

  handleNewNoteClick = (event) => {
    this.setState({ selectedNote: null})
  }

  render() {
        const noteSearch = _.debounce((searchTerm) => {this.getNotes(searchTerm)}, 300)
    return (
      <div className='app-container'>
      <SearchBar onSearchTermChange={noteSearch} />
        <Grid padded>
          <Grid.Row>
            <Grid.Column width={4}>
              <div className='sidebar-container'>
                <Sidebar onNoteSelect={selectedNote => this.setState({ selectedNote })} notes={this.state.notes} handleNewNoteClick={this.handleNewNoteClick}/>
              </div>
            </Grid.Column>
            <Grid.Column width={11}>
              <div className='detail-container'>
                {this.state.selectedNote === null ? <NewNoteForm /> : <NoteDetail note={this.state.selectedNote} />}
              </div>
            </Grid.Column>
          </Grid.Row>
      </Grid>
      </div>
    )
  }
}

export default App;
