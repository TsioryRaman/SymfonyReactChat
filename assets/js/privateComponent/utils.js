export function updateState(data) {
    alert("Monté");
    if (this.is_mounted){
        this.setState({
            friend:data
        })
    }

}