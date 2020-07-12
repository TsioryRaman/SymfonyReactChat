import React from "react";
import {Redirect} from "react-router-dom";

function loginRequired(){
    let checkLogin = JSON.parse(localStorage.getItem("login"));
    if (checkLogin){
        return checkLogin
    }else{
        return null
    }

}

export default loginRequired;
