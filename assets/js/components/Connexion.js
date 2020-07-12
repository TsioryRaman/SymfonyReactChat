import React,{Component} from "react";
import {Redirect} from "react-router-dom";
import login from "../../css/style/login.css";
class Connexion extends Component{
    constructor(props){
        super();
        this.state = {
            loading:false,
            username:"",
            password:"",
            login: false,
            store:null
        };
        this.sendValue = this.sendValue.bind(this);
        this.props = props;
        this.getUserData = this.getUserData.bind(this);
        this.GetFriendAdd = this.GetFriendAdd.bind(this);
    }
    componentDidMount() {
        document.title = "Chat | Connexion";
        this.storeCollector()
    }

    insertUsername(e){
        this.setState({
            username:e.target.value
        })
    }
    insertPassword(e){
        this.setState({
            password:e.target.value
        })
    }
    storeCollector(){
        JSON.parse(localStorage.getItem('login'));
    }
    async getUserData(){
        let data = JSON.parse(localStorage.getItem("login"));
        let token ="Bearer "+data.store;
        let tokens = data.store;
        var request = await fetch("https://localhost:8000/api/getUser",{
            method: "POST",
            headers: { 'Content-Type': 'application/json' ,"Authorization":token,"token":tokens}
        });
        var response = request.json();
           await response.then((val)=>{
                if (val){
                        console.log(val[0]);
                        localStorage.setItem("user",JSON.stringify(val[0]));
                }
            });
            var friends =  await this.GetFriendAdd();
            localStorage.setItem("demande",JSON.stringify(friends));
            console.log("Le friend : ",JSON.stringify(friends));
            if (data && data.login){
                this.setState({login:true,store:data})
            }
            this.props.onCheck(friends);
        }
    async sendValue(){
        this.setState({
            loading:true,
            username: this.state.username,
            password: this.state.password
        });
        const request = await fetch(
                'https://localhost:8000/api/login_check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.state)
            }
            );
        const response = request.json();
        await response.then((result)=>{
                        if (result.token){
                            localStorage.setItem('login',JSON.stringify({
                                    login:true,
                                   store:result.token}
                                )
                            );
                            this.storeCollector();
                            this.getUserData();
                        }else{
                            this.setState({
                                loading : false
                            });
                        }
                    });
    }
    async GetFriendAdd(){
        const userConnected = JSON.parse(localStorage.getItem("user"));
        const user = userConnected.id;
        let datas = JSON.parse(localStorage.getItem("login"));
        let token = "Bearer "+datas.store;
        var data = {
            "id": user
        };
        const request = await fetch("https://localhost:8000/api/getAdder",{
            method: "POST",
            body:JSON.stringify(data),
            headers: {"content-type":"application/json","Authorization":token}
        });
        var data = [];
        await request.json().then((value) => {
            value.map((val,index)=>{
                data[index] = JSON.parse(val)
            })
        });
        return data;
    }
    render(){
        return(
            <>
                {
                    !this.state.login ? (
                        <section className={"section"}>
                            <div className={"row"}>
                                <div className={"col s12 l6 offset-l3"}>
                                    <div className={`input-field col -s6 l12`}>
                                        <i className="material-icons prefix">account_circle</i>
                                        <input id={"pseudo"} className={"validate"} type={"text"} value={this.state.username} onChange={(e)=>this.insertUsername(e)}/>
                                        <label htmlFor={"pseudo"}>Pseudo</label>
                                    </div>
                                    <div className={"input-field col -s6 l12"}>
                                        <i className="material-icons prefix">lock</i>
                                        <input id={"password"} className={"validate"} type={"password"} value={this.state.password} onChange={(e)=>this.insertPassword(e)}/>
                                        <label htmlFor={"password"}>Password</label>
                                    </div>
                                    <button className={"btn indigo waves-effect"} onClick={()=>{this.sendValue()}}>
                                        {this.state.loading? (<i className={"material-icons left fa-spin"}>sync</i>) : null}
                                        Connexion
                                    </button>
                                </div>
                            </div>
                        </section>
                    )
                        :
                    (
                        <Redirect to={"/Acceuil"}/>
                    )
                }
            </>
        )
    }
}

export default Connexion;