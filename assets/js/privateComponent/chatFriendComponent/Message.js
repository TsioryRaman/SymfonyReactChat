import React,{Component} from "react";
import chat from "../../../css/style/Chat/chatModule.css";
import loginRequired from "../loginRequired";
import {animateScroll} from "react-scroll";

class Messages extends Component{
    constructor(props) {
        super(props);
        this.props = props;
        this._isMounted = true;
        this.state= {
            user:JSON.parse(localStorage.getItem("user")),
            receiver: null,
            store: loginRequired(),
            data:[],
            messages : JSON.parse(localStorage.getItem("Messages")),
            newMessage: ""
        };
        this.is_mounted=false;
        this.parseToDateTime = this.parseToDateTime.bind(this);
        this.updateMessageFriend = this.updateMessageFriend.bind(this);
        this.insertLastMessageInFriend = this.insertLastMessageInFriend.bind(this);
        this.getAllMessage = this.getAllMessage.bind(this);
        this.filterMessage = this.filterMessage.bind(this);
        this.mercures = this.mercures.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);

    }
    async getAllMessage(){
        var User = this.state.user;
        var id = User.id;
        let token = "Bearer "+this.state.store.store;
        let user = {
            id: id
        };
        var request = await fetch("https://localhost:8000/api/getMessage",{
            method: "POST",
            body:JSON.stringify(user),
            headers:{"Authorization":token,"Content-type":"application/json"}
        });
         await request.json().then(value => {
              localStorage.setItem("Messages",JSON.stringify(value));
              this.setState({
                   messages : JSON.parse(localStorage.getItem("Messages")),
                });
        });
        this.props.loading();
    }
    mercures(){
        const url = new URL("http://localhost:3000/.well-known/mercure");
        url.searchParams.append('topic', 'https://chat.com/api/preventNotif');
        this.eventSource = new EventSource(url,{withCredentials:true});

        this.eventSource.onmessage = e => {
            var data = JSON.parse(e.data);
            if (e.data && this._isMounted){
                var data ={
                        id_joueur: parseInt(data[0].sender),
                        receipent : this.state.user.id,
                        msg_content: data[0].message,
                        time: Date.now(),
                        see: false
                };
                this.props.updateStateFriend(this.updateMessageFriend(data.id_joueur,data.msg_content));
                this.setState({
                    data : this.filterMessage(this.state.receiver,data),
                });
            }
        }
    }
    updateMessageFriend(index,message){
        var friendTable = JSON.parse(localStorage.getItem("Friends"));
        var indexes = friendTable.findIndex(x=>x.id === index);
        friendTable[indexes].lastMessages = message;
        friendTable[indexes].date = Date.now();
        friendTable[indexes].see = false;
        friendTable[indexes].receipent = this.state.user.id;
        localStorage.setItem("Friends",JSON.stringify(friendTable.sort((a,b)=>{return b.date-a.date})));
        return JSON.parse(localStorage.getItem("Friends"));
    }
    filterMessage(receiver,newMessage){
        var ReceipentMessage = [];
        var message = JSON.parse(localStorage.getItem("Messages"));
        if (newMessage!==undefined){
            message.push(newMessage);
            localStorage.setItem("Messages",JSON.stringify(message));
        }
            if (message){
                message.map((val,index)=>{
                    if (val.receipent === receiver)
                    {
                        ReceipentMessage[index] = val;
                    }else if (this.state.user.id === val.receipent && receiver === val.id_joueur){
                        ReceipentMessage[index] = val;
                    }
                });
        }
        return ReceipentMessage;
    }
    componentWillReceiveProps(props){
        localStorage.setItem("LastReceiver",props.friend);
        if (this.state.messages){
            this.setState({
                receiver : props.friend,
                data : this.filterMessage(props.friend)
            });
        }
    }
    parseToDateTime(time){
        if (time){
            var newTime = time.split(" ");
            var date = Date.parse(newTime[0]);
            var hour = newTime[1].split(":");
            var hours = hour[0] * 3600;
            var minutes = hour[1]*60;
            var totalHour = (hours + minutes + parseInt(hour[2])) * 1000;
            return date + parseInt(totalHour);
        }else{
            return parseInt(time);
        }

    }
    insertLastMessageInFriend(){
        var friendsNew = [];
        var friends = JSON.parse(localStorage.getItem("Friends"));
        var messages = JSON.parse(localStorage.getItem("Messages")).reverse();
        console.log(messages);
        if (friends){
            friends.map((x,index)=>{
                var indexe = messages.findIndex((y)=>x.id === y.id_joueur || x.id === y.receipent);
                if (indexe!==-1){
                    friendsNew[index] = {
                        id : x.id,
                        receipent : messages[indexe].receipent,
                        username : x.username,
                        lastMessages: messages[indexe].msg_content,
                        date: (messages[indexe].time.date ? this.parseToDateTime(messages[indexe].time.date) : messages[indexe].time ),
                        see : messages[indexe].see,
                        filename : x.filename
                    }
                }else {
                    friendsNew[index] = {
                        id: x.id,
                        username: x.username,
                        lastMessages: "Aucun message",
                        date:0,
                        filename : x.filename
                    }
                }
            });
        }
        localStorage.setItem("Friends",JSON.stringify(friendsNew.sort((a,b)=>{return b.date-a.date})));
        console.log("Les nouveaux friends: ",friendsNew);
        if(!this.is_mounted){
            this.props.default(JSON.parse(localStorage.getItem("Friends"))[0].id,JSON.parse(localStorage.getItem("Friends")));
            let receiver = JSON.parse(localStorage.getItem("Messages"));
            let idReceiv = receiver[receiver.length-1].receipent;
            /*this.props.default(parseInt(localStorage.getItem("LastReceiver")));*/
            /*this.props.default(JSON.parse(localStorage.getItem("Friends")[0].id));*/
            this.setState({
                receiver: idReceiv,
                data : this.filterMessage(parseInt(idReceiv))
            });
            this.is_mounted = true;
        }
        /*updateState(JSON.parse(localStorage.getItem("Friends")));*/
        this.props.updateStateFriend(JSON.parse(localStorage.getItem("Friends")));
        this.props.updateState();


    }
    async componentDidMount(){
        !localStorage.getItem("Messages") ? await this.getAllMessage() : null;
        //Default id
/*        if (this.state.receiver === null && this.state.messages){
            var receiver = JSON.parse(localStorage.getItem("Messages"));
            var idReceiv = receiver[receiver.length-1].receipent;
            /!*this.props.default(parseInt(localStorage.getItem("LastReceiver")));*!/
            /!*this.props.default(JSON.parse(localStorage.getItem("Friends")[0].id));*!/
            this.setState({
                receiver: idReceiv,
                data : this.filterMessage(parseInt(idReceiv))
            });
        }*/
        this.insertLastMessageInFriend();
        this.mercures();
    }
    componentWillUnmount(){
        this.eventSource.close();
        this._isMounted = false;
    }
    closeMercure(){

    }
    render() {

        if (this.state.data!==[] && this.state.receiver){
            return(
                <>
                {
                    this.state.data.map((val,index)=>
                        val.receipent === this.state.receiver ?
                        (
                        <li key={index} className={`${chat.content_receiver}`}>
                            <p className={`${chat.msg_block_receiver} right`}>{val.msg_content}</p>
                        </li>
                        ) : (
                                <li key={index} className={`${chat.content_sender}`}>
                                    <i className={`${chat.ico_receiver} material-icons circle small`}>person</i>
                                    <p className={`${chat.msg_block} indigo`}>{val.msg_content}</p>
                                </li>
                            )
                    )
                }
                </>
            )
            }
        else {
            return null
        }
    }
    scrollToBottom(){
        animateScroll.scrollToBottom({
            containerId: "scroll"
        })
    }
    componentDidUpdate(){
        this.scrollToBottom();
    }
}
export default Messages;