import React,{Component} from "react";
import {Redirect} from "react-router-dom"
import loginRequired from "./loginRequired";
import article1 from "../../image/1_Jie55HRpeCmZpmldgrL2eQ.png";
import sms from "../../image/sms.png";
import sound from "../../notification/me_too.mp3";
//Pour le son ti
import UIfx from "uifx";
import {NotificationContainer, NotificationManager} from 'react-notifications';


class AcceuilJoueur extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            checkLogin : loginRequired(),
            user : JSON.parse(localStorage.getItem("user"))
        };

        this.props = props;
        /*this.props.userPrefix(this.state.user);*/
        this.playMusic = this.playMusic.bind(this);
        this.mercures = this.mercures.bind(this);
        this.closeAllEvent = this.closeAllEvent.bind(this);
 /*       this.mercureFriend = this.mercureFriend.bind(this);*/
/*        this.GetFriendAdd = this.GetFriendAdd.bind(this);*/
    }
/*    mercureFriend(){
        localStorage.setItem("eventFriend",true);
        const url = new URL("http://localhost:3000/.well-known/mercure");
        url.searchParams.append("topic","https://chat.com/api/preventFriendAdd");
        this.eventSourceFriend = new EventSource(url,{withCredentials: true});
        this.eventSourceFriend.onmessage = (e) => {
            var data = JSON.parse(e.data);
            console.log(data);
        }
    }*/
    mercures(){
        const url = new URL("http://localhost:3000/.well-known/mercure");
        url.searchParams.append('topic', 'https://chat.com/api/preventNotif');
        this.eventSource = new EventSource(url, {withCredentials: true});
        this.eventSource.onmessage = (e) => {
            let data = {};
            let message = "";
            if(localStorage.getItem("Messages") && e.data){
                let datas = JSON.parse(e.data);
                message = datas[0].message;
                data = {
                    id_joueur: parseInt(datas[0].sender),
                    receipent : this.state.user.id,
                    msg_content: datas[0].message,
                    time: Date.now()
                };
                let msg = JSON.parse(localStorage.getItem("Messages"));
                msg.push(data);
                localStorage.setItem("Messages",JSON.stringify(msg));
                }
            this.props.notif();
            this.playMusic();
                if (localStorage.getItem("Friends")){
                    let friendName = "";
                    var friends = JSON.parse(localStorage.getItem("Friends"));
                    for (var i=0;i<friends.length;i++){
                        if (data.id_joueur === friends[i].id){
                            friendName = friends[i].username;
                        }
                    }
                    return NotificationManager.info(message,friendName);
                }else{
                    return NotificationManager.info("Nouveau message reçu(s)");
                }
        }
    }
   /* async GetFriendAdd(){
        const user = this.state.user.id;
        let token = "Bearer "+this.state.checkLogin.store;
        var data = {
            "id": user
        };
        const request = await fetch("https://localhost:8000/api/getAdder",{
            method: "POST",
            body:JSON.stringify(data),
            headers: {"content-type":"application/json","Authorization":token}
        });
        await request.json().then(value => {
            this.props.demande(value);
        })
    }*/
    componentDidMount() {
        document.title = "Chat | Utilisteur";
      /*  this.GetFriendAdd();*/
        this.mercures();


    }
    closeAllEvent(){
        this.eventSourceFriend.close();
        this.eventSource.close();
    }
    componentWillUnmount(){
        this.eventSource.close();
    }
    playMusic(){
        const bell = new UIfx(
            sound,
            {
                volume: 1,
                throttleMs: 100
            }
        );
        bell.play();
    }
    render() {
        return (
            <>
                {
                    this.state.checkLogin ? (
                        <div className={"container"}>
                            <NotificationContainer/>
                            <section className={" container section"} id={"photo's"}>
                                <blockquote>
                                    Ouvert aux membres seulements
                                </blockquote>
                                    <div className={"card"}>
                                        <div className={"row"}>
                                            <div className={"col s12 l5"}>
                                                <img src={article1} alt={""} className={"responsive-img"}/>
                                            </div>
                                            <div className={"col s12 l6 offset-l1"}>
                                                <h2 className={"blue-text text-darken-4"}>
                                                    Portail
                                                </h2>
                                                <p>
                                                    Chat sécurisé sans interruption !<br></br>
                                                    Envoyé votre méssage sans aucun risque
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                <blockquote>
                                    Sécurité avant tout
                                </blockquote>
                                <div className={"card"}>
                                    <div className={"row"}>
                                        <div className={"col s12 l5 push-l7"}>
                                            <img src={sms} alt={""} className={"responsive-img"}/>
                                        </div>
                                        <div className={"col s12 l6 pull-l5 right-align"}>
                                            <h2 className={"blue-text text-darken-4"}>
                                                Sécuritaire
                                            </h2>
                                            <p>
                                                Chat sécurisé sans interruption !<br></br>
                                                Envoyé votre méssage sans aucun risque
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            </div>
                    ):(
                        <Redirect to={"/Connexion"}/>
                    )
                }

            </>
        )
    }
}
export default AcceuilJoueur;