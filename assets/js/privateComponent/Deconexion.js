import React,{Component} from "react";
import { Redirect, Route } from 'react-router-dom';


class Deconexion extends Component{
    constructor(props){
        super(props);
        this.props = props;
    }
    componentDidMount() {
        localStorage.clear();
        this.props.onCheck();
        location.reload();
    }
    render() {
        return<Redirect to={"/Connexion"}/>
    }
}
export default Deconexion;