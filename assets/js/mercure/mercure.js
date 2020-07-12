
function mercure() {
    const url = new URL("http://localhost:3000/.well-known/mercure");
    url.searchParams.append('topic', 'https://chat.com/api/preventNotif');
    const eventSource = new EventSource(url,{withCredentials:true});
    eventSource.onmessage = e => {
        alert(e.data.message);
    }
}

export default mercure;