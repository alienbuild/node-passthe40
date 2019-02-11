import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client';

// Define socket
const socket = io();

// Put the socket into storage
console.log(socket);
//console.log(JSON.stringify(socket));
//localStorage.setItem('socket', JSON.stringify(socket));

class Login extends Component {

    state = {
      user: '',
      room: '',
      bool: true
    };

    // Control message input
    handleChange = (e) => {

        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });

    };

    handleSubmit = (e) => {
        e.preventDefault();
        const params = this.state;
        if (this.state.bool === true ) {
            socket.emit('join', params, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    this.props.history.push('/chat');
                }
            });
        } else {
            console.log('Well the if statement worked ? :)');
        }
    };



    render() {
        return (
            <div>
                <h3>Login</h3>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="user" placeholder="Username" autoFocus onChange={this.handleChange}/>
                    <br /> <br />
                    <input type="text" name="room" placeholder="Room" onChange={this.handleChange}/>
                    <br />
                    <button type="submit">Login</button>
                </form>
            </div>
        );
    }
}

export default Login;