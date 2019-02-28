import React, { Component } from "react";
import "./TodoList.scss"

class TodoList extends Component {
  constructor(props){
    super(props);
    this.state = {
      value : ""
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

    render() {
      return (
        <>
          {this.props.items.map(item => (
            <div className="message" key={item.id} >{item.text}
              <div className="del" onClick={() => this.props.deleteItem(item.id) }></div>
              <div className="edit" onClick={() =>{ this.props.editItem(item.id, this.state.value); this.state.value = "" }}></div>
              <input  onChange={this.handleChange}></input>
            </div>
          ))}
        </>
      );
    }
  }

export default TodoList;