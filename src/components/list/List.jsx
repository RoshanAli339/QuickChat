import './list.css'
import Userinfo from './userInfo/Userinfo.jsx'
import Chatlist from './chatlist/Chatlist.jsx'

const List = () => {
    return (
        <div className="list">
            <Userinfo />
            <Chatlist />
        </div>
    )
}

export default List
