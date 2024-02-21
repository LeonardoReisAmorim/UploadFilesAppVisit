document.getElementById("arquivoId").innerHTML = localStorage['arquivoId'] || 'defaultValue';

function CreatePlace(){
    fetch("https://localhost:7011/Lugar", {
        method: "POST",
        body: JSON.stringify({
            nome: "",
            descricao: "",
            arquivoId: localStorage['arquivoId'] || 'defaultValue',
            cidadeId: 0,
            imagem: ""
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
}