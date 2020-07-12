import React from "react";
import loginRequired from "../loginRequired";

function listeDamis(){
    let lr = loginRequired();
    let val = lr.store;
    let token = "Bearer "+val;
    let user = {
        id: 4
    };
    fetch("https://localhost:8000/api/listeAmis",{
        method: "POST",
        body: JSON.stringify(user),
        headers: { "content-type": "application/json","Authorization": token }
    }).then((response)=>{
        console.log(" La reponse =>",response);
        let data = [];
        response.json().then((value)=>{
            value.map((insert,index)=>{
                var dt = {
                    username : insert.username,
                    id : insert.id
                }
                data[index] = dt
                console.log(data);
            })
        });
        return data;
    })
}
export default listeDamis;