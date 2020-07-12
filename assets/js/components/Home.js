import React,{Component} from "react";
import {Route, Switch,Redirect, Link, withRouter,useHistory} from 'react-router-dom';
import {ProtectedRoute} from "../privateComponent/ProtectedRoute";
import Acceuil from "./Acceuil";
import Connexion from "./Connexion";
import "react-materialize";
import AcceuilJoueur from "../privateComponent/AcceuilJoueur";
import Chat from "../privateComponent/Chat";
import home from "@style/style/home.css";
import AddFriend from "../privateComponent/AddFriend";
import Deconnexion from "../privateComponent/Deconexion";
import "../materialize/materialize.min";
import {CSSTransition,TransitionGroup} from 'react-transition-group';
import { css } from "@emotion/core";
import BounceLoader from "react-spinners/BounceLoader";
import cssAcc from "../../css/style/Acceuil.css";
import {Dropdown,SideNav,SideNavItem} from "react-materialize";

class Home extends Component{
    constructor(){
        super();
        this.state = {
            Demande:JSON.parse(localStorage.getItem("demande")),
            loading:false,
            checkLogin:false,
            notif:null,
            userPrefix: "",
            eventFriend:null
        };

/*        this.startLoading = this.startLoading.bind(this);
        this.stopLoading = this.stopLoading.bind(this);*/
        this.getNameUser = this.getNameUser.bind(this);
/*        this.mercureFriend = this.mercureFriend.bind(this);*/
        this.setNotif = this.setNotif.bind(this);
        this.disableNotif = this.disableNotif.bind(this);
        this.checkUserStatus = this.checkUserStatus.bind(this);
        this.initializeNewFriend = this.initializeNewFriend.bind(this);
/*        this.closeEvent = this.closeEvent.bind(this);*/
        this.SetEvent = this.SetEvent.bind(this);
    }
    SetEvent(event){
        this.setState({
            eventFriend:event
        });
    }
/*    closeEvent(){
        this.state.eventFriend.close();
    }*/
    initializeNewFriend(data){
        this.setState({
            Demande : data
        });
        console.log("Dans l'home : ",this.state.Demande);
    }

    checkUserStatus(dataFriend){

        dataFriend ? this.setState({checkLogin: false,Demande : dataFriend}):null;
        if (localStorage.getItem(('login'))) {
            var data = JSON.parse(localStorage.getItem('login'));
            this.setState({
                checkLogin: data.login
            })
        }else{
            this.setState({
                checkLogin: false
            })
        }
    }
    setNotif(){
        this.setState({
            notif :true
        })
    }
    disableNotif(){
        this.setState({
            notif: false
        })
    }
    getNameUser(a){
       a ? this.setState({userPrefix: a.username[0]}) : null;
    }
    componentDidMount() {
        if (localStorage.getItem(('login'))) {
            var data = JSON.parse(localStorage.getItem('login'));
            this.setState({
                checkLogin: data.login,
            });
        }
    }

    render(){
        return (
            <>
            {
                ! this.state.checkLogin ? (
                    <>

                        <nav>
                            <div className={"nav-wrapper indigo"}>
                                <div className={"container"}>
                                    <Link className={"brand-logo left"} to={"/"}>ChaT</Link>
                                    <ul className={"right hide-on-med-and-down"}>
                                        <li><Link id={"acceuil"} to={"/Acceuil"}>
                                            <i className={"material-icons left"}>home</i>
                                            Acceuil
                                        </Link></li>
                                        <li><Link  to={"/Connexion"}> <i className={"material-icons left"}>verified_user</i>Connexion</Link></li>

                                    </ul>
                                </div>
                            </div>
                        </nav>
                        <div className={"container"}>
                            <TransitionGroup>
                                <CSSTransition
                                    timeout={500}
                                    classNames="fade"
                                >
                                    <Switch>
                                        <Redirect exact path={"/"} to={"/Acceuil"}/>
                                        <Route exact path={"/Acceuil"} render={(props)=><Acceuil {...props} title={`Okok`} />}/>
                                        <Route exact path={"/Connexion"} render={(props)=><Connexion {...props} onCheck={this.checkUserStatus} />} />
                                    </Switch>
                                </CSSTransition>
                            </TransitionGroup>
                        </div>
                    </>

                ):(
                    <>
     {/*                   <li><span className={"dropdown-trigger"} data-activates={"dropdown1"} data-target="dropdown1"><i
                            className="material-icons right">supervisor_account</i></span></li>*/}
                        <nav>
                            <div className={"nav-wrapper indigo"}>

                                <div className={"container"}>
                                    <SideNav
                                        id="SideNav-10"
                                        className={`${home.pointe}`}
                                        options={{
                                            draggable: true
                                        }}
                                        trigger={<i className={"material-icons"}>menu</i> }
                                    >
                                        <SideNavItem>

                                        </SideNavItem>
                                    </SideNav>
                                    <Link className={"brand-logo left"} to={"/"}>Chat</Link>

                                    <ul className={"right hide-on-med-and-down right"}>
                                        <li>
                                            <Dropdown
                                                id="Dropdown_6"
                                                options={{
                                                    alignment: 'left',
                                                    autoTrigger: true,
                                                    closeOnClick: false,
                                                    constrainWidth: false,
                                                    container: null,
                                                    coverTrigger: false,
                                                    hover: false,
                                                    inDuration: 150,
                                                    onCloseEnd: null,
                                                    onCloseStart: null,
                                                    onOpenEnd: null,
                                                    onOpenStart: null,
                                                    outDuration: 250
                                                }}
                                                trigger={<i
                                                    className="material-icons right">supervisor_account</i>}
                                            >

                                                    <AddFriend/>

                                            </Dropdown>
                                        </li>
                                        <li><Link  to={"/"}><i className={"material-icons left"}>work</i>Bureau</Link></li>
                                        <li><Link to={"/Chat"} onClick={()=>this.disableNotif()}>
                                            <i className={"material-icons left"}>local_post_office</i>ChaT</Link></li>
                                        <li><Link onClick={()=>this.startLoading()} to={"/Chat"} onClick={()=>this.disableNotif()} className={`btn-floating indigo darken-4 z-depth-0 ${this.state.notif ? "pulse" : ""}`}>
                                            <i className={"material-icons "}>notifications</i>
                                        </Link></li>
                                        <li><Link to={"/"} className={`btn-floating pink accent-2 z-depth-0`}><i className={`material-icons`}>{ this.state.userPrefix}</i></Link>
                                        </li>
                                        <li><Link  to={"Deconnexion"}>Deconnexion</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                        <div className={"contenu"}>


                        {/*    <Route render={({location})=>(
                                <TransitionGroup>
                                    <CSSTransition
                                        key={location.key}
                                        timeout={500}
                                        classNames="fade"
                                    >
                                        <Switch location={location}>
                                            <Redirect exact path={"/"} to={"/Acceuil"}/>
                                            <ProtectedRoute exact path={"/Acceuil"} component={(props)=><AcceuilJoueur {...props} notif={this.setNotif}/>} />
                                            <ProtectedRoute exact path={"/Chat"}  component={(props)=><Chat {...props} notif={this.setNotif}/>}/>
                                            <Route exact path={"/Deconnexion"} render={(props)=><Deconnexion {...props} onCheck={this.checkUserStatus} />}/>
                                        </Switch>
                                    </CSSTransition>
                                </TransitionGroup>
                            )}
                            />*/}
                                        <Switch>
                                            <Redirect exact path={"/"} to={"/Acceuil"}/>
                                            <ProtectedRoute exact path={"/Acceuil"} component={(props)=><AcceuilJoueur {...props} eventClose={this.SetEvent} demande={this.initializeNewFriend} userPrefix={this.getNameUser}  notif={this.setNotif}/>} />
                                            <ProtectedRoute exact path={"/Chat"}  component={(props)=><Chat {...props} notif={this.setNotif}/>}/>
                                            <Route exact path={"/Deconnexion"} render={(props)=><Deconnexion {...props} onCheck={this.checkUserStatus} />}/>
                                        </Switch>

                        </div>
                    </>
                )
                }
            </>
        )
    }
}

export default Home;