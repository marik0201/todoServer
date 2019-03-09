import React, { Component } from "react";
import TodoList from "../TodoList/TodoList";
import axios from "axios";
import "./App.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { items: [], text: "", loading: false, errorMessage: "", loadingForm: false, name:"", password:"", user:"", errorLogin:"", token:""};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.submitform = this.submitform.bind(this);    
    this.closeApp = this.closeApp.bind(this);
  }

  componentDidMount() {

     const token =  localStorage.getItem('token');
    this.setState({ errorMessage: "", loading: true, token: token });

    // userName ? this.setState({ loadingForm: true, user: userName }) : this.setState({ loadingForm:false });

  

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
    console.log(id);
    
    axios
      .delete("http://localhost:3001/api/messages/" + id, {}, {headers: {"Authorization":`JWT ${this.state.token}`}})
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
      id: Date.now(), 
      user: this.state.user
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
    const name = this.state.name;
    const password = this.state.password;
    
    axios.post("http://localhost:3001/api/login", {
      name,
      password
    }).then( res => {
      console.log(res);
      this.setState({
        loadingForm: true,
        user: res.data.user, 
        token: res.data.token
      });
      localStorage.setItem('token', res.data.token);
    }).catch(err => {
      console.log(err);
      this.setState({
        errorLogin:"Неверные данные",
        name:"",
        password:""
      })
    });
     e.preventDefault();
  }


  closeApp() {
    this.setState({
      loadingForm:false
    });
    localStorage.removeItem('token');
  }

  render() {
    return !this.state.loading ? 
    
    !this.state.loadingForm ?
    (<form  onSubmit={this.submitform}>
        <div>
        <span className="errorLogin">{this.state.errorLogin}</span>
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
      <div className="closeApp" onClick={this.closeApp}></div>
        <span className="errorSpan">{this.state.errorMessage}</span>
        <span className="userSpan">Hi {this.state.user}</span>
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
          user={this.state.user}
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
