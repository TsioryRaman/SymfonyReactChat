import React,{Component} from "react";
import chat from "../../../css/style/Chat/chatModule.css";
import Messages from "./Message";
import {animateScroll} from "react-scroll";
import Picker from 'emoji-picker-react';
import loginRequired from "../loginRequired";

class  Message extends Component{
    constructor(props){
        super(props);
        this.props = props;
        this.state = {
            message:"",
            user: JSON.parse(localStorage.getItem("user")),
            token: loginRequired(),
            emoji:false,
            friend: JSON.parse(localStorage.getItem("Friends")),
            receiver: null,
            receiver_checked:null
        };
        this.updateMessageFriend = this.updateMessageFriend.bind(this);
        this.getIdFriend = this.getIdFriend.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.getValue = this.getValue.bind(this);
        this.setDefaultReceiver = this.setDefaultReceiver.bind(this);
        this.updateState = this.updateState.bind(this);
        //Emoji
        this.emoji = this.emoji.bind(this);
        this.onEmojiClick = this.onEmojiClick.bind(this);

        console.log("Constructeur MessageBody");
    }
    getIdFriend(value){
        alert(value)
    }
    getValue(e){
        this.setState({
            message : e.target.value
        });
    }
    updateMessageFriend(index,message,date){
        var friendTable = JSON.parse(localStorage.getItem("Friends"));
        var indexes = friendTable.findIndex(x=>x.id === index);
        friendTable[indexes].lastMessages = message;
        friendTable[indexes].receipent = index;
        friendTable[indexes].date = Date.now();
        friendTable[indexes].see = true;
        localStorage.setItem("Friends",JSON.stringify(friendTable.sort((a,b)=>{return b.date-a.date})));
        return JSON.parse(localStorage.getItem("Friends"));
    }
    updateState(){
        this.setState({
            friend : JSON.parse(localStorage.getItem("Friends"))
        })
    }
     sendMessage(receiver){
        let token = "Bearer "+this.state.token.store;
        let message = this.state.message;
        var receiver = receiver;
        /*updateState(this.updateMessageFriend(receiver,message));*/
         this.props.updateStateFriend(this.updateMessageFriend(receiver,message));
        let sender = this.state.user.id;
        let newMessage = {
            id_joueur:this.state.user.id,
            receipent:receiver,
            msg_content:message,
            time: Date.now()
        };
         var oldStorage = JSON.parse(localStorage.getItem("Messages"));
         oldStorage.push(newMessage);
         localStorage.setItem("Messages",JSON.stringify(oldStorage));
        fetch("https://localhost:8000/api/sendMessage",{
              method: "POST",
              body:  JSON.stringify({"message_content":message}),
              headers: {"Authorization":token,"id_sender":sender,"id_receiver":receiver}
        }).then(response=>{
         //this.props.refreshMessage();
        });
        //prevent user for new Messages
        fetch("https://localhost:8000/api/preventMessage",{
            method: "POST",
            body:JSON.stringify({"message_content":message}),
            headers: {"Authorization":token,"id_receiver":receiver,"sender":sender}
        }).then(response=>{
           // alert("tout le monde reçoit");
            //console.log(response);
        });
        this.setState({
            message: ""
        });
    }
    componentDidMount(){

    }

      componentWillReceiveProps(props,state){
        if (!this.state.friend){
            this.setState({
                receiver: props.friend,
                friend: JSON.parse(localStorage.getItem("Friends")),
            })
        }else
            {
                var friends = JSON.parse(localStorage.getItem("Friends"));
                var friend = null;
                for (let i=0;i<friends.length;i++) {
                    if (friends[i].id === props.friend) {
                        friend = this.state.friend[i];
                        break;
                    }
                }
                this.setState({
                    receiver: props.friend,
                    receiver_checked: friend
                })
            }
        }
    setDefaultReceiver(value,friende){
        let friends = friende;
        let friend = null;
        for (let i=0;i<friends.length;i++) {
            if (friends[i].id === value) {
                friend = friends[i];
                break;
            }
        }
            this.setState({
                receiver: value,
                receiver_checked: friend
            });
    }
    render(){
              return (
                  <div className={`${chat.contenu}  row` }>
                      <div className={`${chat.headers} indigo lighten-4`}>
                          {
                              this.state.receiver_checked ? (
                                  <>
                                  <h5 className={`${chat.header_friend}`}>
                                      {this.state.receiver_checked.username}
                                  </h5>
                                  <div className={`${chat.fonctionality}`}>
                                      <i className={`material-icons ${chat.icon}`}>
                                      phone_enabled
                                      </i>
                                      <i className={`material-icons ${chat.icon}`}>
                                      delete
                                      </i>
                                  </div>
                              </>
                              ): null
                          }

                      </div>
                      <div className={`${chat.histo_msg} col s12 m12 l12`}>
                          <div id={"scroll"} className={`${chat.message_field}`}>
                              <div className={`${chat.header_message}`}>

                              </div>

                              <ul>
                                  <Messages updateStateFriend={this.props.updateStateFriend} update={this.props.update} updateState={this.updateState} loading={this.props.loading} default={this.setDefaultReceiver} friend={this.state.receiver}/>
                              </ul>
                          </div>
                          <div className={`${chat.field_message}`}>
                              <div className={`${chat.input_field} row`}>
                                  <div className={"col s2 m3 L3"}>

                                  </div>
                                  <div className={"col s8 m6 l6"}>
                                      <div className={"input-field"}>
                                          <input type={"text"} value={this.state.message}  onChange={(e)=>this.getValue(e)} className={`${chat.text_area}`}/>
                                      </div>
                                  </div>
                                 <div className={"col s2 m1 l1 "}>
                                          <div className={`${chat.emoji_container} ${this.state.emoji ? null : chat.display_none}`}>
                                              <Picker preload={false} onEmojiClick={this.onEmojiClick}/>
                                          </div>
                                          <i className={`material-icons ${chat.emoj}`} onClick={()=>this.emoji()}>insert_emoticon</i>
                                  </div>
                                  <div className={`${chat.box_send} col s2 m2 l2`}>
                                      <div className={"input-field"}>
                                          <button className={"btn btn-block indigo"} onClick={()=>this.sendMessage(this.state.receiver)}>
                                              <i className={"material-icons"}>send</i>
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>)
    }
    scrollToBottom(){
        animateScroll.scrollToBottom({
            containerId: "scroll"
        })
    }
    componentDidUpdate(){
        this.scrollToBottom();
    }
    emoji(){
        if (this.state.emoji){
            this.setState({
                emoji:false
            })
        }else {
            this.setState({
                emoji:true
            })
        }
    }
    onEmojiClick(event, emojiObject){
        this.setState({
            message:this.state.message+""+emojiObject.emoji
        });
    }
}

export default Message;