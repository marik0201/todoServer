import React, { Component } from "react";
import TodoList from "../TodoList/TodoList";
import axios from "axios";
import "./App.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { items: [], text: "", loading: false, errorMessage: "", loadingForm: false, name:"", password:"", user:"" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.submitform = this.submitform.bind(this);    
  }

  componentDidMount() {
    this.setState({ errorMessage: "", loading: true });

    axios
      .get("http://localhost:3001/api/messages")
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
        console.log(err);
        this.setState({
          errorMessage: "Нет подключения к серверу",
          loading: false
        });
      });
  }



  handleLoginChange(e) {
    this.setState({
      name: e.target.value
    })
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value
    })
  }

  deleteItem(id) {
    // const items = this.state.items.filter(item => item.id !== id);
    // filter(item => item.id !== id);

    axios
      .delete("http://localhost:3001/api/messages/" + id, {})
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
      .put("http://localhost:3001/api/messages/" + key, { value })
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
      .post("http://localhost:3001/api/messages", {
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


  submitform(e) {
    const username = this.state.name;
    const password = this.state.password;
    console.log(name,password);
    
    axios.post("http://localhost:3001/api/login", {
      username,
      password
    }).then( res => {
      console.log(res);
      this.setState({
        loadingForm: true
      })
    }).catch(err => 
      console.log(err)
     )
     e.preventDefault();
  }

  render() {
    return !this.state.loading ? 
    
    !this.state.loadingForm ?
    (<form  onSubmit={this.submitform}>
        <div>
        <label>Username:</label>
        <input type="text" name="username" vlaue={this.state.name} onChange={this.handleLoginChange}/><br/>
        </div>
        <div>
        <label>Password:</label>
        <input type="password" name="password" value={this.state.password} onChange={this.handlePasswordChange}/>
        </div>
        <div>
        <input type="submit" value="Submit"/>
        </div>
    </form> )   :    
    (
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
