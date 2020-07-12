import React from "react";
import {Redirect} from "react-router-dom"
import {Route} from "react-router-dom"
import loginRequired from "./loginRequired";
export const ProtectedRoute = ({component: Component, ...rest}) =>{
    //{..res} Lé exacte pathn lé Route
    return (
        <Route {...rest} render={
            (props) => {
                if (loginRequired()){
                    return <Component {...props}/>
                }else {
                    return <Redirect to={"/Connexion"}/>
                }

            }
        } />
    )
}