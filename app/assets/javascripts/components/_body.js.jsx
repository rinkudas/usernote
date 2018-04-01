var Body = React.createClass({
    getInitialState: function() {
      return { notes: [],
             sort: "title",
             order: "asc",
             page: 1,
             pages: 0 }
    },

    componentDidMount: function() {
      this.getDataFromApi(this.state.page);
    },

    getDataFromApi: function(page) {
      var self = this;
      $.ajax({
        url: '/api/v1/notes.json',
        data: { page: page },
        success: function(data) {
          console.log(data);
          self.setState({ notes: data.notes, pages: parseInt(data.pages), page: parseInt(data.page) });
        },
        error: function(xhr, status, error) {
          alert('Cannot get data from API: ', error);
        }
      });
    },
    handleSearch: function(notes) {
      this.setState({ notes: notes });
    },
    handleAdd: function() {
      this.getDataFromApi(this.state.page);
    },
    handleDeleteRecord: function() {
      this.getDataFromApi(this.state.page);
    },
    handleUpdateRecord: function(old_note, note) {
      var notes = this.state.notes.slice();
      var index = notes.indexOf(old_note);
      notes.splice(index, 1, note);
      this.setState({ notes: notes });
    },
    handleSortColumn: function(title, order) {
      if (this.state.sort != title) {
        order = 'asc';
      }
      $.ajax({
        url: '/api/v1/notes.json',
        data: { sort_by: title, order: order, page: this.state.page },
        method: 'GET',
        success: function(data) {
          this.setState({ notes: data.notes, sort: title, order: order });
        }.bind(this),
        error: function(xhr, status, error) {
          alert('Cannot sort notes: ', error);
        }
      });
    },
    handleChangePage: function(page) {
      this.getDataFromApi(page);
    },

    render: function() {
        return (
          <div>
            <div className="row">
              <div className="col-md-4">
                <SearchForm handleSearch={this.handleSearch} />
              </div>
            </div><br/>
            <div className="row">
              <div className="col-md-12">
                <NewNote handleAdd={this.handleAdd} />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <NoteTable notes={this.state.notes}
                            sort={this.state.sort}
                            order={this.state.order}
                            handleDeleteRecord={this.handleDeleteRecord}
                            handleUpdateRecord={this.handleUpdateRecord}
                            handleSortColumn={this.handleSortColumn} />
                <Pagination page={this.state.page}
                            pages={this.state.pages}
                            handleChangePage={this.handleChangePage} />
              </div>
            </div>
          </div>
        )
    }
});