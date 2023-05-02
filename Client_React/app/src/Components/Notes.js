import React, { useState, useEffect } from 'react';
import axios from 'axios';
//axios is a js library for sending asynchronous http requests i.e. GET, POST, DELETE, etc

function Notes() {

    //initial note states
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');

    //TODO: fetch existing notes from database
    useEffect(() => {
        axios.get('/api/notes')
            .then(response => {
                setNotes(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    //TODO: (TEST) save new note to database
    const handleNoteSubmit = (event) => {
        event.preventDefault();
        const noteObject = {
            content: newNote,
            date: new Date().toISOString(),
        };

        axios.post('/api/notes', noteObject)
            .then(response => {
                setNotes(notes.concat(response.data));
                setNewNote('');
            })
            .catch(error => {
                console.log(error);
            });
    };

    //TODO: update state when user types new note
    const handleNoteChange = (event) => {
        setNewNote(event.target.value);
    };

    //html rendering
    return (
        <div id="notes">
            <h2>Notes</h2>
            <form onSubmit={handleNoteSubmit}>
                <input value={newNote} onChange={handleNoteChange} />
                <button type="submit">Save</button>
            </form>
            
            <ul>
                {notes.map(note =>
                    <li key={note.id}>{note.content}</li>
                )}
            </ul>
        </div>
    )
}

export default Notes;