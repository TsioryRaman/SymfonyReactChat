import React,{Component} from "react";
import home from "@style/style/home.css";
import loginRequired from "./loginRequired";

class AddFriend extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            store : loginRequired(),
            Demande: JSON.parse(localStorage.getItem("demande")),
            user: JSON.parse(localStorage.getItem("user"))
        };
        this.getCheckedOption = this.getCheckedOption.bind(this);
        this.mercureFriend = this.mercureFriend.bind(this);
    }
    mercureFriend(){
        localStorage.setItem("eventFriend",true);
        const url = new URL("http://localhost:3000/.well-known/mercure");
        url.searchParams.append("topic","https://chat.com/api/preventFriendAdd");
        this.eventSourceFriend = new EventSource(url,{withCredentials: true});
        this.eventSourceFriend.onmessage = (e) => {
            var data = JSON.parse(e.data);
            var newFriend = {
                id : data.id,
                username: data.username
            };
            var newFriends = JSON.parse(localStorage.getItem("demande"));
            newFriends.unshift(newFriend);
            localStorage.setItem("demande",JSON.stringify(newFriends));
            this.setState({
                Demande : JSON.parse(localStorage.getItem("demande"))
            })
        }
    }

    componentDidMount() {
       /* this.setState({
            Demande: this.props.demande
        });*/
        this.mercureFriend();
    }
    componentWillUnmount(){
        this.eventSourceFriend.close();
    }
    async getCheckedOption(options,idFriend,userFriendName){
        const option = options;
        const idUser = this.state.user.id;
        const idFriends = idFriend;
        let token = "Bearer "+this.state.store.store;
        const data = {
            "option" : option,
            "idUser" : idUser,
            "idFriends" : idFriends
        };

        const request = await fetch("https://localhost:8000/api/friendOptions",{
            method: "POST",
            body:JSON.stringify(data),
            headers: {"content-type":"application/json","Authorization":token}
        });
        if (request){
            var newDataFriend = this.state.Demande;
            var friend = newDataFriend.findIndex((x)=>x.id === idFriends);
            newDataFriend.splice(friend,1);
            localStorage.setItem("demande",JSON.stringify(newDataFriend));
            if (localStorage.getItem("Friends")){
                var oldFriends = JSON.parse(localStorage.getItem("Friends"));
                var newFriend = {
                    username : userFriendName,
                    id: idFriends
                };
                oldFriends.unshift(newFriend);
                localStorage.setItem("Friends",JSON.stringify(oldFriends));
            }
                this.setState({
                    Demande: JSON.parse(localStorage.getItem("demande"))
                })
        }

    }
    render() {
        return (
            <>
                {
                    this.state.Demande && this.state.Demande.length ? (
                        this.state.Demande.map((val, index) =>
                            (
                                    <div key={index} className={`${home.container_check}`}>
                                        <div className={`${home.content}`}>
                                            <a className={`${home.var_name}`} href={""}>{val.username}</a>
                                            <div className={`${home.options}`}>
                                                <i onClick={()=>this.getCheckedOption(true,val.id)} className={"material-icons  teal-text text-darken-2"}>
                                                    check
                                                </i>
                                                <i onClick={()=>this.getCheckedOption(false,val.id,val.username)} className={"material-icons red-text text-darken-2"}>
                                                    cancel
                                                </i>
                                            </div>
                                        </div>
                                    </div>
                            ))
                    ) : (
                        <div className={`${home.container_check}`}>
                            <div className={`${home.content}`}>
                                <a className={`${home.var_name}`} href={""}>Aucune demande</a>
                            </div>
                        </div>
                    )
                }
            </>
        )
    }
}

export default AddFriend;