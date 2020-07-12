import React,{Component} from "react";
import debounce from "lodash.debounce";
import chat from "../../../css/style/Chat/chatModule.css";
import loginRequired from "../loginRequired";

export function updateState(data) {
    if (this.is_mounted){
        this.setState({
             friend:data,
            id : this.state.id === null ? data[0].id : null
         });
    }
}
/*export function updateStates() {
    if (this.is_mounted) {
        this.setState({
            friend: JSON.parse(localStorage.getItem("Friends"))
        });
    }
}*/

class Friend extends Component {
    constructor(props){
        super(props);
        this.props= props;
        this.state = {
            user: JSON.parse(localStorage.getItem("user")),
            background:null,
            checked:false,
            search:"",
            arraySearch:null,
            id:null,
            store: loginRequired(),
            friend:  JSON.parse(localStorage.getItem("Friends"))
        };
        this.is_mounted = false;
        this.preventFriend = this.preventFriend.bind(this);
        this.findFriend = this.findFriend.bind(this);
        this.sendId = this.sendId.bind(this);
        this.listeDamis = this.listeDamis.bind(this);
        this.changeColor = this.changeColor.bind(this);
        this.lastMessage = this.lastMessage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.findFriend = debounce(this.findFriend,800);
        this.newFriendAdd = this.newFriendAdd.bind(this);
        this.parseToTime = this.parseToTime.bind(this);
        this.updateState = this.updateState.bind(this);
        this.uploadPhotos = this.uploadPhotos.bind(this);

    }
    updateState(data) {
            this.setState({
                friend:data,
                id : this.state.id === null ? data[0].id : this.state.id
            });
    }
     async uploadPhotos(filename) {
        var image = null;
        await import("../../../image/profil/" + filename).then(async value => {
            image = await value.default
            console.log(image);
        });
         return image;
     }

    async listeDamis(){

        var data = new Array();
        var User = JSON.parse(localStorage.getItem("user"));
        var id = User.id;
        let token = "Bearer "+this.state.store.store;
        let user = {
            "id": id
        };
        let request = await fetch("https://localhost:8000/api/listeAmis",{
            method: "POST",
            body: JSON.stringify(user),
            headers: { "content-type": "application/json","Authorization": token }
        });
        await request.json().then((value)=>{
                     value.map((insert,index)=>{
                         let photo = null;
                         if (insert.filename!== "" && insert.filename!==null){
                             photo = this.uploadPhotos(insert.filename);
                         }
                        let dt =  {
                            username :  insert.username,
                            id :  insert.id,
                            filename: photo
                        };
                         data[index] =  dt;
                });
            });
        if (!localStorage.getItem("Friends") && localStorage.getItem("Friends") !== data){
            console.log("Les friends :",data);
             localStorage.setItem("Friends",JSON.stringify(data));
            var friend =  JSON.parse(localStorage.getItem("Friends"));
            /*this.setState({friend : JSON.parse(localStorage.getItem("Friends"))});*/
            friend[0] ?  this.sendId(friend[0].id) : null;
        }
    }
    changeColor(e){

    }
    lastMessage(){
        var lastMess = localStorage.getItem("Messages");
    }
  /*  insertLastMessage(){
        this.setState({
           friend :  JSON.parse(localStorage.getItem("Friends"))
        });
    }*/
    sendId(id,see,receipent){
        let friends = this.state.friend;
        if (!see && receipent===this.state.user.id){
            let token = "Bearer "+this.state.store.store;
            let index = friends.findIndex((x)=>x.id === id);
            friends[index].see = true;
            let data = {
                "receipent" : this.state.user.id,
                "id" : id
            };
            var request = fetch("https://localhost:8000/api/see",{
                method: "POST",
                body: JSON.stringify(data),
                headers: {"content-type":"application/json","Authorization":token}
            });
            localStorage.setItem("Friends",JSON.stringify(friends));
        }

        this.setState({
            friend: friends,
            id : this.state.id !== null ? id : null
        });
        this.props.friendChecked(id);
    }
    parseToTime(millisecond){
        let date = new Date(millisecond);
        let day = date.getDay();
        let month = date.getMonth();
        let hours = (date.getHours()+"").length===1 ? "0"+date.getHours() : date.getHours();
        let minutes = (date.getMinutes()+"").length===1 ? "0"+date.getMinutes() : date.getMinutes();
        return ""+hours+":"+minutes;
    }
    async componentDidMount(){
        await this.listeDamis();
        this.is_mounted = true;
    }
    newFriendAdd(){
        this.is_mounted ? this.setState({friend:JSON.parse(localStorage.getItem("Friends"))}) : null;
    }
    handleChange(e){
        this.setState(
            {
                search : e.target.value
            }
        );
        this.findFriend();

    }
    async findFriend(){
        const id = this.state.user.id;
        let token = "Bearer "+this.state.store.store;
            if (this.state.search !== "") {
                let search = this.state.search;
                var data = {
                    "id": id,
                    "search": search
                };
                const request = await fetch("https://localhost:8000/api/search", {
                        method: "POST",
                        headers: {"content-type": "application/json", "Authorization": token},
                        body: JSON.stringify(data)
                    }
                );
                var response = request.json();
                if (response){
                    response.then(val => {
                        console.log("La reponse de la recherche", val);
                        val.length ? this.setState({arraySearch: val}) : this.setState({arraySearch : null})
                    })
                }
                }else{
                    this.setState({
                        arraySearch:null
                    })
                }
    }
    async addFriend(id_user){
        const id = this.state.user.id;
        let token = "Bearer "+this.state.store.store;
        let id_amis = id_user;
        var data = {
            "id": parseInt(id),
            "id_friend": parseInt(id_amis)
        };
        const request = await fetch("https://localhost:8000/api/addFriend",{
            method: "POST",
            headers: {"content-type": "application/json", "Authorization": token},
            body: JSON.stringify(data)
        });
        const response = request.json();
        await response.then(val=>{
            var oldState = this.state.arraySearch;
            var index= oldState.findIndex((x)=>x.id === id_user);
            var oldData = oldState[index];
            oldData.id_user = this.state.user.id;
            oldData.id_amis = id_user;
            oldData.confirmed = false;
            oldState[index] = oldData;
            this.setState({
                arraySearch : oldState
            });
        });
        this.preventFriend(id_user);
    }
    preventFriend(id){
        let token = "Bearer "+this.state.store.store;
        const userId = this.state.user.id;
        var data = {
            "userId": userId,
            "id" : id
        };
        const request = fetch("https://localhost:8000/api/preventFriend",{
            method: "POST",
            headers: {"content-type": "application/json", "Authorization": token},
            body:JSON.stringify(data)
        })
    }
    render() {
        if (this.state.friend) {
            return (
                <>
                    <div className={`row cyan lighten-5 ${chat.search}`}>
                        <div className={"input-field col s12 l10 offset-l1"}>
                            <i  className={"material-icons prefix"}>search</i>
                            <input id={"recherche"} type={"text"} className={"validate"} value={this.state.search} onChange={(e)=>this.handleChange(e)}/>
                            <label htmlFor={"recherche"}>Recherche </label>
                        </div>
                    </div>
                    <ul className={` ${chat.collection} collection with-header`} style={{"overflowY":"scroll!important"}}>
                    {
                        this.state.arraySearch ?

                            this.state.arraySearch.map((val,index) =>
                                (

                                        <li key={index}  onClick={(e)=>{this.changeColor(e);val.confirmed ? this.sendId(val.id):null}} id={val.id} className={`${chat.friend_li} collection-item avatar`}>
                                            {
                                                val.filename!==null ? <img src={`require("../../../profil/${val.filename}")`} /> : <i className={"material-icons circle blue"}>person</i>
                                            }

                                            <span className={"title"}>{val.username}</span>
                                            {
                                                val.confirmed ? null : this.state.user.id === parseInt(val.id_user) && !val.confirmed? (
                                                    <i className={"material-icons right"} onClick={()=>this.addFriend(val.id)}>cancel</i>
                                                ) : this.state.user.id === parseInt(val.id_amis) && val.confirmed === false ? (
                                                    <>
                                                        <button key={"0"} className={"btn"}>ignorer</button>
                                                        <button key={"1"} className={"btn"}>Confirmé</button>
                                                    </>
                                                ) : val.confirmed === null? <i className={"material-icons right"} onClick={()=>this.addFriend(val.id)}>add</i>:null
                                            }
                                        </li>

                                )
                            )


                            :
                        this.state.friend.map((val, index) =>
                            (
                                <li key={index} onClick={(e)=>{this.sendId(val.id,val.see,val.receipent)}} id={val.id} className={`${chat.friend_li} collection-item avatar ${this.state.id === val.id ? "white-text indigo" : ""}`}>
                                    {
                                        val.filename!==null ? <img src={val.filename} /> : <i className={"material-icons circle blue"}>person</i>
                                    }
                                    <span className={"title"}>{val.username}</span>
                                    <p className={`${!val.see && this.state.user.id===val.receipent ? chat.textBold : ""}`}>{
                                        val.lastMessages ? this.state.user.id!==val.receipent ? <span className={"truncate"}><i className={"material-icons tiny"}>reply</i> Vous :{val.lastMessages}</span> :<span className={"truncate"}><i className={"material-icons tiny"}>list</i> {val.lastMessages}</span>: null
                                    } {val.date ?<span className={"right"}><i className={"material-icons tiny"}>schedule</i> {this.parseToTime(val.date)} </span>: null}</p>
                                </li>)
                        )
                    }
                        <a className="btn-floating btn-large waves-effect waves-light indigo"
                           style={{
                               "position":"fixed",
                               "bottom":"20px",
                               "left":"17px"
                           }}
                        ><i
                            className="material-icons">add</i></a>
                    </ul>
                </>
            )
        }
        return (<>
            <div className={`row cyan lighten-5 ${chat.search}`}>
                <div className={"input-field col s12 l10 offset-l1"}>
                    <i  className={"material-icons prefix"}>search</i>
                    <input id={"recherche"} type={"text"} className={"validate"} value={this.state.search} onChange={(e)=>this.handleChange(e)}/>
                    <label htmlFor={"recherche"}>Recherche </label>
                </div>
            </div>
            <p>Aucun ami</p>
            <a className="btn-floating btn-large waves-effect waves-light indigo"
               style={{
                   "position":"fixed",
                   "bottom":"20px",
                   "left":"17px"
               }}
            ><i
                className="material-icons">add</i></a>
        </>)
    }
    componentWillUnmount(){
        this.is_mounted = false;
    }
}
export default Friend;