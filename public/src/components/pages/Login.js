import React, {Component} from 'react';

class Login extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        alert('Form submitted.');
    };
    render() {
        return (
            <div>
                <h3>Login</h3>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="Username" autoFocus/>
                    <br /> <br />
                    <input type="text" placeholder="Room"/>
                    <br />
                    <button type="submit">Login</button>
                </form>
            </div>
        );
    }
}

export default Login;