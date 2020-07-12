import React,{Component} from "react";
class Acceuil extends Component{
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            image : null
        };
    }

    async componentDidMount() {
        document.title = "Chat | Acceuil";
        await import("../../image/profil/index.png").then(image=>{
            console.log(image);
            this.setState({image : image.default});
        });
    }

    render() {

        return(<>
            <h1 className={"messageBox"}>Acceuil</h1>
            {
                this.state.image ? <img src={`${this.state.image}`}/> : null
            }
            </>)
    }
}


export default Acceuil;