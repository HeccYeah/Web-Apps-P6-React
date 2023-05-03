function Notes() {
    //html rendering
    return (
        <div id="notes">
            <h2>Notes</h2>
            <form>
                <input id="noteWriter"/>
                <button type="submit" id="noteSubmitter">Save</button>
            </form>
            
            <ul id="noteList">
                
            </ul>
        </div>
    )
}

export default Notes;