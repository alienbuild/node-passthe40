import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client';
import SocketContext from '../../context/socketContext';

class Login extends Component {

    constructor(props){
      super(props);
    };

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
            this.props.socket.emit('join', params, (err) => {
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

const LoginWithSocket = props => (
    <SocketContext.Consumer>
        {socket => <Login {...props} socket={socket} />}
    </SocketContext.Consumer>
);

export default LoginWithSocket; 