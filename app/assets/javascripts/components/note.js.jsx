var Note = React.createClass({
  getInitialState: function() {
    return {
      edit: false,
      saved: false,
      note: {
        title: '',
        body: '',
        tags_attributes: [Object.assign({}, this.emptyTag)]
      }
    };
  },
  componentDidMount: function() {
    this.emptyTag = {
      tag_name: '',
      adding_tag: true,
      _destroy: false
    };
  },
  propTypes: {
    title: React.PropTypes.string,
    body: React.PropTypes.string
  },
  handleDelete: function(e) {
    e.preventDefault();
    $.ajax({
      method: 'DELETE',
      url: '/api/v1/notes/' + this.props.note.id,
      success: function(data) {
        this.props.handleDeleteRecord();
      }.bind(this),
      error: function(xhr, status, error) {
        alert('Cannot delete requested record: ', error);
      }
    });
  },
  handleToggle: function(e) {
    e.preventDefault();
    this.setState({ edit: !this.state.edit, saved: false });
    if(!this.state.saved){
      this.props.note.tags = this.props.note.tags.filter(function( obj ) {
        return ("id" in obj);
      });
    }
    console.log(this.props.note.tags);
  },
  recordValue: function(field) {
    return ReactDOM.findDOMNode(this.refs[field]).value;
  },
  handleUpdate: function(e) {
    e.preventDefault();
    if (this.validRecord()) {
      console.log(this.props.note.tags);
      var note_data = {
        title: this.recordValue("title"),
        body: this.recordValue("body"),
        tags_attributes: this.props.note.tags
      };
      $.ajax({
        method: 'PUT',
        url: '/api/v1/notes/' + this.props.note.id,
        data: { note: note_data },
        success: function(data) {
          this.props.handleUpdateRecord(this.props.note, data);
          this.setState({ edit: false, saved: true });
        }.bind(this),
        error: function(xhr, status, error) {
          alert('Cannot update requested record: ', error);
        }
      });
    } else {
      alert('Please fill all fields.');
    }
  },
  validRecord: function() {
    if (this.recordValue("title") &&
        this.recordValue("body") ) {
      return true;
    } else {
      return false;
    }
  },

  handleRemoveTag: function(tag) {
    tag._destroy = true;
    this.setState({ note: this.props.note });
    // var note_data = {
    //   title: this.recordValue("title"),
    //   body: this.recordValue("body"),
    //   tags_attributes: this.props.note.tags
    // };
    // $.ajax({
    //   method: 'PUT',
    //   url: '/api/v1/notes/' + this.props.note.id,
    //   data: { note: note_data },
    //   success: function(data) {
    //     // this.props.handleUpdateRecord(this.props.note, data);
    //     // this.setState({ edit: false });
    //     this.setState({ note: this.props.note });
    //   }.bind(this),
    //   error: function(xhr, status, error) {
    //     alert('Cannot update requested record: ', error);
    //   }
    // });
  },

  handleAddTag: function() {
    this
    .props
    .note
    .tags
    .push(Object.assign({}, this.emptyTag));

    this.setState({ note: this.props.note });
  },

  onTagNameChange: function(event, tag) {
    tag.tag_name = event.target.value;
    this.setState({ note: this.props.note });
  },

  renderTagsForm: function() {
    var tagStyle = {
      padding: '5px',
      background: 'lightgrey',
      width: 'max-content'
    }
    return this.props.note.tags.map((tag, index) => {
      if (tag._destroy === false) {
        let tagDOM = (
          <div className="tag-form" key={index}>
            <div className="form-group">
              {!tag.adding_tag ?
                <div className="clearfix" style={tagStyle}>
                  <span>
                    {tag.tag_name}
                  </span>
                  <button className="delete" onClick={e => this.handleRemoveTag(tag)}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                :
                <input
                  placeholder="Add Tag"
                  onChange={event => this.onTagNameChange(event, tag)}
                  type="text"
                  value={tag.tag_name}
                  className="form-control"
                />
              }
            </div>
          </div>
        );

        return tagDOM;
      } else {
        return null;
      }
    });
  },

  renderForm: function() {
    return(
      <tr>
        <td>
          <input name="title"
                 defaultValue={this.props.note.title}
                 className="form-control"
                 type="text"
                 ref="title"
          />
        </td>
        <td>
          <input name="body"
                 defaultValue={this.props.note.body}
                 className="form-control"
                 type="text"
                 ref="body"
          />
        </td>
        <td>
          {this.renderTagsForm()}
          <button
            className="btn btn-success"
            onClick={e => this.handleAddTag()}>
            + Add Tag
          </button>
        </td>
        <td>
          <a className="btn btn-success btn-sm"
             onClick={this.handleUpdate}>
            Save
          </a>
          <a className="btn btn-default btn-sm"
             onClick={this.handleToggle} >
            Cancel
          </a>
        </td>
      </tr>
    );
  },
  renderRecord: function() {
    var note = this.props.note;
    var tags = this.props.note.tags;
    var tagStyle = {
      padding: '5px',
      background: 'lightgrey',
      width: 'max-content',
      display: 'inline-block',
      marginRight: '10px'
    }
    if(tags.length > 0){
      var tagList = tags.map(function(tag){
                      return <div className="clearfix" style={tagStyle} key={ tag.id }>
                              <span>
                                {tag.tag_name}
                              </span>
                            </div>
                    })
    }
    return(
      <tr>
        <td>{note.title}</td>
        <td>{note.body}</td>
        <td>
          {(tags.length > 0) && tagList}
        </td>
        <td>
          <a className="btn btn-danger btn-xs"
             onClick={this.handleDelete} >
            Delete
          </a>
          <a className="btn btn-primary btn-xs"
             onClick={this.handleToggle} >
             Edit
          </a>
        </td>
      </tr>
    );
  },
  render: function() {
    if (this.state.edit) {
      return(this.renderForm());
    } else {
      return(this.renderRecord());
    }
  }
});
