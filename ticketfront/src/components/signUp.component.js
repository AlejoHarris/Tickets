import React, { Component } from "react";
import axios from "axios";
export default class SignUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            email: '',
            password: ''
        }
    }

    changeHandler = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    submitHandler = (event) => {
        event.preventDefault()
        console.log(this.state)
        axios.post("http://localhost:3000/api/users/signUp", this.state)
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    render() {
        const { username, email, password } = this.state
        return (
            <form onSubmit={this.submitHandler}>
                <h3>Sign Up</h3>

                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        name="username"
                        value={username}
                        onChange={this.changeHandler}
                    />
                </div>

                <div className="form-group">
                    <label>Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        name="email"
                        value={email}
                        onChange={this.changeHandler}
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        name="password"
                        value={password}
                        onChange={this.changeHandler}
                    />
                </div>

                <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                <p className="forgot-password text-right">
                    Already registered <a href="/sign-in">sign in?</a>
                </p>
            </form>
        );
    }
}