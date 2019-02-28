import React, { Component } from "react";
import TodoList from "../TodoList/TodoList";
import axios from "axios";
import "./App.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { items: [], text: "", loading: false, errorMessage: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.editItem = this.editItem.bind(this);
  }

  componentDidMount() {
    this.setState({ errorMessage: "", loading: true });

    axios
      .get("http://localhost:3000/api/messages")
      .then(res => {
        if (res.data.message) {
          console.log(res.data.message);
          console.log(1);

          this.setState({
            errorMessage: res.data.message,
            loading: false
          });
        } else {
          this.setState({ items: res.data.result.items, loading: false });
        }
      })
      .catch(err => {
        console.log(2);

        this.setState({
          errorMessage: "Нет подключения к серверу",
          loading: false
        });
      });
  }

  deleteItem(id) {
    // const items = this.state.items.filter(item => item.id !== id);
    // filter(item => item.id !== id);

    axios
      .delete("http://localhost:3000/api/messages/" + id, {})
      .then(res => {
        const items = res.data.items;

        this.setState({
          items
        });
      })
      .catch(err => console.log(err));
  }

  editItem(key, value) {
    console.log(value);

    axios
      .put("http://localhost:3000/api/messages/" + key, { value })
      .then(res => {
        const items = res.data.items;

        this.setState({
          items,
          text: ""
        });
      });
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.text.length) {
      return;
    }
    const newItem = {
      text: this.state.text,
      id: Date.now()
    };

    const items = this.state.items.concat(newItem);

    axios
      .post("http://localhost:3000/api/messages", {
        items
      })
      .then(res => {
        console.log(res);

        this.setState({
          items,
          text: ""
        });
      });
  }

  render() {
    return !this.state.loading ? (
      <div className="container">
        <span className="errorSpan">{this.state.errorMessage}</span>
        <form onSubmit={this.handleSubmit}>
          <input
            id="new-todo"
            onChange={this.handleChange}
            value={this.state.text}
          />
          <br />
          <button>Отправить</button>
        </form>
        <TodoList
          items={this.state.items}
          deleteItem={this.deleteItem}
          editItem={this.editItem}
        />
      </div>
    ) : (
      <div>Loading...</div>
    );
  }
}

export default App;
