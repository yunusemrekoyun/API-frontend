import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [users, setUsers] = useState([]);
    const [senderId, setSenderId] = useState('');
    const [receiverId, setReceiverId] = useState('');
    const [amount, setAmount] = useState('');
    const [newUser, setNewUser] = useState({ firstName: '', lastName: '', balance: '' });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const [showForm, setShowForm] = useState(true);
    const [showTransfer, setShowTransfer] = useState(true);
    const [showAddUser, setShowAddUser] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await fetch('https://localhost:7023/api/UserList/all');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // Sort users by id
            data.sort((a, b) => a.id - b.id);
            setUsers(data);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const handleTransfer = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('https://localhost:7023/api/Transfer/transfer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ senderId: parseInt(senderId), receiverId: parseInt(receiverId), amount: parseFloat(amount) }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            if (result.success) {
                setMessage('Transfer successful!');
                setMessageType('success');
            } else {
                setMessage('Transfer failed!');
                setMessageType('error');
            }

            // Clear input fields
            setSenderId('');
            setReceiverId('');
            setAmount('');
            fetchUsers(); // Refresh user list
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setMessage('Transfer failed!');
            setMessageType('error');
        }
    };

    const handleAddUser = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('https://localhost:7023/api/Users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    balance: parseFloat(newUser.balance),
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            setMessage('User added successfully!');
            setMessageType('success');
            setNewUser({ firstName: '', lastName: '', balance: '' });
            fetchUsers(); // Refresh user list
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setMessage('Failed to add user!');
            setMessageType('error');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="container">
            <div className="message-box" style={{ display: message ? 'block' : 'none', backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da' }}>
                {message}
            </div>
            <div className="section">
                <button className="toggle-button" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Hide User List' : 'Show User List'}
                </button>
                <div className={`user-list ${showForm ? 'show' : 'hide'}`}>
                    <h2>User List</h2>
                    <ul>
                        {users.map(user => (
                            <li key={user.id}>
                                ID: {user.id} - {user.firstName} {user.lastName} - Balance: {user.balance}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="section">
                <button className="toggle-button" onClick={() => setShowTransfer(!showTransfer)}>
                    {showTransfer ? 'Hide Money Transfer' : 'Show Money Transfer'}
                </button>
                <div className={`money-transfer ${showTransfer ? 'show' : 'hide'}`}>
                    <h2>Money Transfer</h2>
                    <form onSubmit={handleTransfer}>
                        <div className="form-group">
                            <label htmlFor="sender">Sender ID:</label>
                            <input type="number" id="sender" value={senderId} onChange={(e) => setSenderId(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="receiver">Receiver ID:</label>
                            <input type="number" id="receiver" value={receiverId} onChange={(e) => setReceiverId(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="amount">Amount:</label>
                            <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                        </div>
                        <button type="submit">Transfer Money</button>
                    </form>
                </div>
            </div>
            <div className="section">
                <button className="toggle-button" onClick={() => setShowAddUser(!showAddUser)}>
                    {showAddUser ? 'Hide Add User' : 'Show Add User'}
                </button>
                <div className={`add-user ${showAddUser ? 'show' : 'hide'}`}>
                    <h2>Add User</h2>
                    <form onSubmit={handleAddUser}>
                        <div className="form-group">
                            <label htmlFor="firstName">First Name:</label>
                            <input type="text" id="firstName" value={newUser.firstName} onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name:</label>
                            <input type="text" id="lastName" value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="balance">Balance:</label>
                            <input type="number" id="balance" value={newUser.balance} onChange={(e) => setNewUser({ ...newUser, balance: e.target.value })} required />
                        </div>
                        <button type="submit">Add User</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;