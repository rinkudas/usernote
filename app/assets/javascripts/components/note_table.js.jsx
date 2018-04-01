var NoteTable = React.createClass({
  handleDeleteRecord: function() {
    this.props.handleDeleteRecord();
  },
  handleUpdateRecord: function(old_note, note) {
    this.props.handleUpdateRecord(old_note, note);
  },
  handleSortColumn: function(name, order) {
    this.props.handleSortColumn(name, order);
  },
  render: function() {
    var notes = [];
    this.props.notes.forEach(function(note) {
      notes.push(<Note note={note}
                         key={'note' + note.id}
                         handleDeleteRecord={this.handleDeleteRecord}
                         handleUpdateRecord={this.handleUpdateRecord} />)
    }.bind(this));
    return(
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="col-md-3 sortable">
              <SortColumn name="title"
                          text="Title"
                          sort={this.props.sort}
                          order={this.props.order}
                          handleSortColumn={this.handleSortColumn}/>
            </th>
            <th className="col-md-3 sortable">
              <SortColumn name="body"
                          text="Body"
                          sort={this.props.sort}
                          order={this.props.order}
                          handleSortColumn={this.handleSortColumn}/>
            </th>
            <th className="col-md-3">Tags</th>
            <th className="col-md-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {notes}
        </tbody>
      </table>
    )
  }
});
