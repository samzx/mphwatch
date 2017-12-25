fetch("http://corsproxy.solexstudios.com/", {
    method: "GET",
})
.then((resp) => {
     console.log(resp)
    return resp.text();
})
.then((data) => {
    console.log(data);
})