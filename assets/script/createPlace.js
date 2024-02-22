var urlCities = "https://localhost:7011/Cidade";
var urlPostPlace = "https://localhost:7011/Lugar";

let result = fetch(urlCities)
.then(response => {
    if(!response.ok){
        return new Error('falhou a requisição')
    }

    if (response.status === 404) {
        return new Error('não encontrou qualquer resultado')
    }

    return response.json();
});

result.then(cidades => {
    for(var cidade of cidades){
        let option = document.createElement("option");
        option.value = cidade.id;
        option.text = cidade.nome;
        document.getElementById("cities").appendChild(option)
    }
});

document.getElementById("createPlace").addEventListener('click', ()=>{
    let cidadeId = parseInt(document.getElementById("cities").value);
    let nomeLugar = document.getElementById("namePlace").value;
    let descricaoLugar = document.getElementById("descriptionPlace").value;
    let imagemBase64 = document.getElementById("base64").value;

    let lugar = {
        Nome: nomeLugar,
        Descricao: descricaoLugar,
        ArquivoId: parseInt(localStorage['arquivoId']) || 0,
        CidadeId: cidadeId,
        Imagem: imagemBase64
    }

    if(!cidadeId || !nomeLugar || !descricaoLugar){
        alert("necessario preencher todos os campos");
        return
    }

    CreatePlace(lugar);
});

function CreatePlace(lugarParametro){
    try{
        fetch(urlPostPlace, {
            method: "POST",
            body: JSON.stringify(lugarParametro),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(result => {
            if(!result.ok){
                return new Error('falhou a requisição')
            }
    
            if (result.status === 404) {
                return new Error('não encontrou qualquer resultado')
            }
    
            alert("lugar criado com sucesso");
        });
    }catch(error){
        alert(error);
    }
    
}

document.getElementById("imagePlace").addEventListener('change', ()=>{
    var file = document.getElementById("imagePlace").files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        document.getElementById("base64").innerHTML = reader.result.replace('data:', '').replace(/^.+,/, '');
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
});