import React,{Component} from "react";
import chat from "../../css/style/Chat/chatModule.css";
import loginRequired from "./loginRequired";
import Friend from "./chatFriendComponent/Friend";
import MessageBody from "./chatFriendComponent/MessageBody";
import DotLoader from "react-spinners/DotLoader";
import cssAcc from "../../css/style/Acceuil.css";


class Chat extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: JSON.parse(localStorage.getItem("user")),
            receiver: parseInt(localStorage.getItem("LastReceiver")),
            store: loginRequired(),
            friend: JSON.parse(localStorage.getItem("Friends")),
            newMessage: "",
            loading:true
        };
        this.friend = React.createRef();
        this._isMounted = false;
        this.disableSpin =this.disableSpin.bind(this);
       this.getFriend = this.getFriend.bind(this);
       this.updateFriend = this.updateFriend.bind(this);
       console.log("Constructeur Chat");

    }
    disableSpin(){
        this.setState({
            loading:false
        })
    }
    getFriend(value){
        this.setState({
            receiver:value
        });
    }
    componentDidMount(){
        document.title = "Chat | Messages";
        localStorage.getItem("Messages") ? setTimeout(()=>{this.setState({loading:false})},1000) :null
    }
    componentWillUnmount(){
        this._isMounted = false;
    }
    updateFriend(data){
        this.friend.current.updateState(data);
    }
     render(){
        if (this.state.user){
            return(
                <>
                    <div className={`${chat.row100} row`}>
                        <div className={`${chat.list} col s12 m4 l3`}>

                                <div className={"collection-header  cyan lighten-5"}>
                                    <p className={`${chat.header_name}`}>
                                        <span className={`truncate ${chat.username}`}>{this.state.user.username}</span>
                                        <i className={"material-icons right"}>share</i>
                                        <i className={"material-icons right"}>settings</i>
                                    </p>

                                </div>
                                <Friend ref={this.friend} friendChecked={this.getFriend}/>
                            {/*    <a className="btn-floating btn-large waves-effect waves-light indigo"
                                style={{
                                    "position":"fixed",
                                    "bottom":"20px",
                                    "left":"17px"
                                }}
                                    ><i
                                    className="material-icons">add</i></a>*/}

                        </div>
                        {
                            this.state.loading ? (
                                <div className={`${cssAcc.sweet_loading}`}>
                                    <DotLoader
                                        size={150}
                                        color={"#123abc"}
                                        loading={true}
                                    />
                                </div>
                            )    : null
                        }
                        <div className={`${chat.message_container} col s12 m8 l9`}>
                             <MessageBody updateStateFriend={this.updateFriend} update={this.updateChild} loading={this.disableSpin} newMessage={this.state.newMessage}  friend={this.state.receiver} refreshMessage={this.getAllMessage}/>
                        </div>
                    </div>
                </>
            )
        }else
        {
            return null
        }

    }
}

export default Chat;