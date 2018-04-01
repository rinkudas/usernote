var NewNote = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    body: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      title: '',
      body: '',
      tags_attributes: [Object.assign({}, this.emptyTag)]
    }
  },
  componentDidMount: function() {
    this.emptyTag = {
      tag_name: '',
      adding_tag: true,
      _destroy: false
    };
  },
  handleAddTag: function(e) {
    e.preventDefault();
    this
    .state
    .tags_attributes
    .push(Object.assign({}, this.emptyTag));

    this.setState({ state: this.state });
  },
  onTagNameChange: function(event, tag) {
    tag.tag_name = event.target.value;
    this.setState({ state: this.state });
  },
  handleAdd: function(e) {
    e.preventDefault();
    var self = this;
    if (this.validForm()) {
      self.state.tags_attributes = self.state.tags_attributes.filter(function( obj ) {
        return obj.tag_name != '';
      });
      $.ajax({
        url: '/api/v1/notes',
        method: 'POST',
        data: { note: self.state },
        success: function(data) {
          self.props.handleAdd();
          self.setState(self.getInitialState());
        },
        error: function(xhr, status, error) {
          alert('Cannot add a new record: ', error);
        }
      })
    } else {
      alert('Please fill all fields.');
    }
  },
  validForm: function() {
    if (this.state.title && this.state.body) {
      return true;
    } else {
      return false;
    }
  },
  handleChange: function(e) {
    var input_name = e.target.name;
    var value = e.target.value;
    this.setState({ [input_name] : value });
  },
  renderTagsForm: function() {
    var tagStyle = {
      padding: '5px',
      background: 'lightgrey',
      width: 'max-content'
    }
    console.log(this.state);
    console.log(this.state.tags_attributes);
    return this.state.tags_attributes.map((tag, index) => {
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
  render: function() {
    var divStyle = {
      display: 'inline-block'
    }
    return(
      <form className="form-inline" onSubmit={this.handleAdd}>
        <div className="form-group">
          <input type="text"
                 className="form-control"
                 name="title"
                 placeholder="Title"
                 ref="title"
                 value={this.state.title}
                 onChange={this.handleChange} />
        </div>
        <div className="form-group">
          <input type="text"
                 className="form-control"
                 name="body"
                 placeholder="Body"
                 ref="description"
                 value={this.state.body}
                 onChange={this.handleChange} />
        </div>
        <div className="form-group" style={divStyle}>
          {this.renderTagsForm()}
          <button
            className="btn btn-success"
            onClick={this.handleAddTag}>
            + Add Tag
          </button>
        </div>

        <button type="submit" className="btn btn-primary">Add</button>
      </form>
    )
  }
});
