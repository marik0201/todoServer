import React, { Component } from "react";
import "./TodoList.scss"

class TodoList extends React.Component {
    render() {
      return (
        <>
          {this.props.items.map(item => (
            <div className="message" key={item.id} >{item.text}
              <div className="del" onClick={() => this.props.deleteItem(item.id) }></div>
              <div className="edit" onClick={() => this.props.editItem(item.id) }></div>
            </div>
          ))}
        </>
      );
    }
  }

export default TodoList;