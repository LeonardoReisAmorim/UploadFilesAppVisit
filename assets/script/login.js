var url = "https://localhost:7011/";
var endpoint = "User/login";

document.getElementById("submitLogin").addEventListener('click', ()=>{
    let loginUser = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    }

    let result = Login(loginUser)
           
    result.then((result)=>{
        localStorage.setItem("token", result.token);
        localStorage.setItem("usuarioId", result.token);
        window.location = '/assets/pages/main/mainPage.html'
    }).catch((error)=>{
        console.log(error);
    });

})

async function Login(loginUser) {
    let urlLogin = url+endpoint;

    try{
        let response = await fetch(urlLogin, {
            method: "POST",
            body: JSON.stringify(loginUser),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            }
        })

        if(!response.ok && response.status == 400){
            response.json().then(x => {
                alert(x.error);
            });
            return
        }

        return await response.json();
    }catch(error){

    }
}