import React, { Component } from "react";
import TodoList from "../TodoList/TodoList";
import axios from 'axios'
import "./App.scss";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { items: [], text: "", loading: false };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.editItem = this.editItem.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true })

    axios.get("http://localhost:3000/api/messages").then(res => {
      this.setState({ items: res.data.result.items, loading: false })
    }).catch(err => {
      console.log(err);

      this.setState({ loading: false })
    });
  }

  deleteItem(id) {
    // const items = this.state.items.filter(item => item.id !== id);
    // filter(item => item.id !== id);

    axios.delete("http://localhost:3000/api/messages/" + id, { }).then( res => {
      const items = res.data.items;
      
      this.setState({
        items
      })
    }).catch(err => console.log(err));





    // [0, 2, 4].map(item => {
    //   if (item === 2) {
    //     item = newItem 
    //   }

    //   return item
    // })

  }

  editItem(key) {
    let bufText = "";

    for (let k in this.state.items) {
      if (this.state.items[k].id === key) {
        bufText = this.state.items[k].text;
        console.log(bufText);
      }
    }

    this.setState({
      text: bufText
    });
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.text.length) {
      return
    }
    const newItem = {
      text: this.state.text,
      id: Date.now()
    };

    const items = this.state.items.concat(newItem);

    axios.post("http://localhost:3000/api/messages", {
      items
    }).then(res => {
      console.log(res);

      this.setState(({
        items,
        text: ""
      }));
    })
  }

  render() {
    return !this.state.loading ? (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <input
            id="new-todo"
            onChange={this.handleChange}
            value={this.state.text}
          />
          <br />
          <button>Отправить</button>
        </form>
        <TodoList items={this.state.items} deleteItem={this.deleteItem} editItem={this.editItem} />
      </div>
    ) : <div>Loading...</div>;
  }
}

export default App;
