import React, {Component} from 'react';
import moment from 'moment';
import SocketContext from '../../context/socketContext';

// Components
import UserList from '../chat/UserList';

class Chat extends Component {

    constructor(props){
        super(props);

        // Autoscroll
        const autoscroll = () => {
            // Selectors
            const messages = document.querySelector('#messages');
            const allowance = messages.lastChild;
            // Heights
            const clientHeight = messages.clientHeight;
            const scrollTop = messages.scrollTop;
            const scrollHeight = messages.scrollHeight;
            // If the user is near the bottom, auto scroll to bottom.
            if (clientHeight + scrollTop + allowance.clientHeight * 4 >= scrollHeight) {
                messages.scrollTop = scrollHeight;
            }
        };

        // Event: Disconnect
        this.props.socket.on('disconnect', () => {
            console.log('Disconnected from server.');
        });

        // Event: New messages from the server
        this.props.socket.on('newMessage', (message) => {
            // Format the timestamp
            const time = moment(message.createdAt).format('h:mm a');
            // Grab dialog box
            const messages = document.querySelector('#messages');
            // Set the template
            const output = `<li><time>${time}</time> <span class="dialog-username">${message.from}</span>: ${message.text}</li>`;
            // Output the message
            messages.insertAdjacentHTML("beforeend", output);
            // Autoscroll
            autoscroll();
        });

        // Event: Coin Flip
        this.props.socket.on('coinFlip', (result) => {
            // Grab dialog box
            const messages = document.querySelector('#messages');
            // Set the template
            const output = `<li class="message broadcast">${result.result}</li>`;
            // Output the result
            messages.insertAdjacentHTML("beforeend", output);
        });
    }

    // Init state
    state = {
        message: ''
    };

    // Control message input
    handleChange = (e) => {
        console.log(e.target.value);
        this.setState({
            message: e.target.value
        })
    };

    // Send data to server on enter/submit
    handleSubmit = (e) => {
        e.preventDefault();
        // Clear the input value
        const messageInput = document.querySelector('#message');
        messageInput.value = '';
        // Clear the state
        this.setState({
            message: ''
        });
        // Event: Send message
        this.props.socket.emit('createMessage',{
            text: this.state.message
        }, () => {

        });
    };

    // Request coin flip
    coinFlip = (e) => {
        e.preventDefault();
        this.props.socket.emit('flip');
    };

    render() {
        return (
            <React.Fragment>
                <UserList socket={this.props.socket}/>
                <main>
                    <ol id="messages"></ol>
                    <footer>
                        <form onSubmit={this.handleSubmit}>
                            <input
                                type="text"
                                id="message"
                                name="message"
                                placeholder="Type a message..."
                                onChange={this.handleChange}
                                autoComplete="off"
                                autoFocus="on"
                            />
                            <button type="submit">Send</button>
                        </form>
                        <button id="coin-flip" onClick={this.coinFlip}>Flip</button>
                    </footer>
                </main>
            </React.Fragment>
        );
    }
}

const ChatWithSocket = props => (
    <SocketContext.Consumer>
        {socket => <Chat {...props} socket={socket} />}
    </SocketContext.Consumer>
);

export default ChatWithSocket;