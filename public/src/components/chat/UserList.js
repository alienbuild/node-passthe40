import React, {Component} from 'react';
import SocketContext from '../../context/socketContext';

class UserList extends Component {
    constructor(props) {
        super(props);

        this.componentDidMount(

        );

        this.props.socket.on('updateUserList',(users) => {
            console.log('Users list: ', users);

            // Update the state
            this.setState({
                users: users
            })
        })
    }

    componentDidMount() {
        this.props.socket.emit('updateUserList');
    }

    state = {
        users: []
    };

    render() {
        const userList = this.state.users;
        return (
            <aside>
                <h3>Users</h3>
                <ul>
                    { userList.map((user) => {
                        return <li key={user.id} id={user.id}>{user.name}</li>;
                    }) }
                </ul>
            </aside>
        );
    }
}


export default UserList;