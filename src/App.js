import React from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      error: null,
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

  addBlog = (event) => {
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
          username: ''
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
      this.setState({
        error: 'invalid username or password',
      })
      setTimeout(() => {
        this.setState({ error: null })
      }, 5000)
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

  loginForm = () => (
    <div>
      <h2>Kirjaudu sovellukseen</h2>
      <form onSubmit={this.login}>
        <div>
          username
          <input type="text" name="username" value={this.state.username} onChange={this.handleFieldChange}/>
        </div>
        <div>
          password
          <input type="password" name="password" value={this.state.password} onChange={this.handleFieldChange}/>
        </div>
        <button type="submit">log in</button>
      </form>
    </div>
  )

  blogList = () => (
    <div>
        <p>{this.state.user.name} logged in</p>
        <button type="submit" onClick={this.logout}>kirjaudu ulos</button>

        <h2>create new</h2>
        <form onSubmit={this.addBlog}>
        <div>
          title
          <input type="text" name="newTitle" value={this.state.newTitle} onChange={this.handleFieldChange}/>
        </div>
        <div>
          author
          <input type="text" name="newAuthor" value={this.state.newAuthor} onChange={this.handleFieldChange}/>
        </div>
        <div>
          url
          <input type="text" name="newUrl" value={this.state.newUrl} onChange={this.handleFieldChange}/>
        </div>
        <button type="submit">create</button>
      </form>

        <h2>blogs</h2>
        {this.state.blogs.map(blog => 
          <Blog key={blog._id} blog={blog}/>
        )}
    </div>
  )

  render() {
    if (this.state.user === null) {
      return (this.loginForm())
    }
    return (this.blogList())
  }

}

export default App
