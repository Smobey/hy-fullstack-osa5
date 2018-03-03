import React from 'react'

import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import AddBlog from './components/AddBlog'

import './index.css'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      notification: null,
      loginVisible: false,
      username: '',
      password: '',
      user: null,
      newTitle: '',
      newAuthor: '',
      newUrl: ''
    }
  }

  componentDidMount() {
    blogService.getAll().then(blogs =>
      this.setState({ blogs })
    )

    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({user})
      blogService.setToken(user.token)
    }
  } 

  displayNotification = (notification) => {
    this.setState({notification: notification})
    setTimeout(() => {
      this.setState({notification: null})
    }, 3000)
  }

  addBlog = (event) => {
    this.displayNotification("Blog added")
    event.preventDefault()
    const blogObject = {
      title: this.state.newTitle,
      author: this.state.newAuthor,
      url: this.state.newUrl
    }

    blogService
      .create(blogObject)
      .then(newBlog => {
        this.setState({
          blogs: this.state.blogs.concat(newBlog)
        })
      })
  }

  login = async (event) => {
    event.preventDefault()

    try{
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      this.setState({ username: '', password: '', user})

    } catch(exception) {
      this.displayNotification("Invalid username or password")
    }
  }

  handleFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  logout = async (event) => {
    event.preventDefault()

    this.setState({ user: null })
    window.localStorage.clear()
  }

  render() {
    console.log(this.state.newTitle)
    const loginForm = () => (
      <Togglable buttonLabel="login">
        <LoginForm
          visible={this.state.visible}
          username={this.state.username}
          password={this.state.password}
          handleChange={this.handleFieldChange}
          handleSubmit={this.login}
        />
      </Togglable>
    )

    const addBlog = () => (
      <Togglable buttonLabel="add blog">
        <AddBlog
          visible={this.state.visible}
          title={this.state.newTitle}
          author={this.state.newAuthor}
          url={this.state.newUrl}
          handleChange={this.handleFieldChange}
          handleSubmit={this.addBlog}
        />
      </Togglable>
    )

    const userInfo = () => (
      <div>
          <p>{this.state.user.name} logged in</p>
          <button type="submit" onClick={this.logout}>kirjaudu ulos</button>
      </div>
    )

    const blogList = () => (
      <div>
          <h2>blogs</h2>
          {this.state.blogs.map(blog => 
            <Blog key={blog._id} blog={blog}/>
          )}
      </div>
    )
    
    return (
      <div>
        <Notification message={this.state.notification}/>

        {this.state.user === null && loginForm()}

        {this.state.user !== null && userInfo()}
        {this.state.user !== null && addBlog()}
        {this.state.user !== null && blogList()}
      </div>
    )
  }

}

export default App
