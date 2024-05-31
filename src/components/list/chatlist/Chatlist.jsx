import './chatlist.css'
import AddUser from './addUser/AddUser.jsx'
import { useState } from 'react'

const Chatlist = () => {
    const [addMode, setAddMode] = useState(false)
    return (
        <div className="chatlist">
            <div className="search">
                <div className="searchbar">
                    <img src="./search.png" alt="" />
                    <input type="text" placeholder="Search" />
                </div>
                <img
                    src={addMode ? './minus.png' : './plus.png'}
                    onClick={() => setAddMode((prev) => !prev)}
                    className="add"
                />
            </div>
            <div className="item">
                <img src="./avatar.png" />
                <div className="texts">
                    <span>Roshan Ali</span>
                    <p>Hello Roshan!</p>
                </div>
            </div>

            <div className="item">
                <img src="./avatar.png" />
                <div className="texts">
                    <span>Roshan Ali</span>
                    <p>Hello Roshan!</p>
                </div>
            </div>

            <div className="item">
                <img src="./avatar.png" />
                <div className="texts">
                    <span>Roshan Ali</span>
                    <p>Hello Roshan!</p>
                </div>
            </div>

            <div className="item">
                <img src="./avatar.png" />
                <div className="texts">
                    <span>Roshan Ali</span>
                    <p>Hello Roshan!</p>
                </div>
            </div>

            <div className="item">
                <img src="./avatar.png" />
                <div className="texts">
                    <span>Roshan Ali</span>
                    <p>Hello Roshan!</p>
                </div>
            </div>

            <div className="item">
                <img src="./avatar.png" />
                <div className="texts">
                    <span>Roshan Ali</span>
                    <p>Hello Roshan!</p>
                </div>
            </div>

            <div className="item">
                <img src="./avatar.png" />
                <div className="texts">
                    <span>Roshan Ali</span>
                    <p>Hello Roshan!</p>
                </div>
            </div>

            <div className="item">
                <img src="./avatar.png" />
                <div className="texts">
                    <span>Roshan Ali</span>
                    <p>Hello Roshan!</p>
                </div>
            </div>
            {addMode && <AddUser />}
        </div>
    )
}

export default Chatlist
