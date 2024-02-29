var url = "https://localhost:7011/";

fetch(url+"Lugar")
.then(response => {
    if(!response.ok){
        alert('falhou a requisição');
        return;
    }

    if (response.status === 404) {
        alert('não encontrou qualquer resultado');
        return;
    }

    document.getElementById("loading").style.display = "none";

    response.json().then(places => {
        places.forEach(element => {
            var table = document.getElementById("tablePlace");
            var row = document.createElement("tr");
            row.innerHTML = 
            `<tr>
               <td>${element.id}</td>
               <td>${element.nome}</td>
               <td>${element.descricao}</td>
               <td>${element.cidade}</td>
               <td>${element.nomeArquivo}</td>
               <td>
               <div style="display: flex;flex-wrap: nowrap; justify-content: center">
                    <div style="margin-right:20px"><button type="button" class="btn btn-primary" onclick="editarLugar(${element.id})">Editar Lugar</button></div>
                    <div><button type="button" class="btn btn-danger" onclick="apagarLugar(${element.id})">Apagar Lugar</button></div>
                </div>
               </td>
           </tr> `
           table.appendChild(row);
        });
    });
});

function editarLugar(id){
    criarModal();

    fetch(url+`Lugar/${id}`)
    .then(response => {
        if(!response.ok){
            alert('falhou a requisição');
            return;
        }

        if (response.status === 404) {
            alert('não encontrou qualquer resultado');
            return;
        }

        response.json()
        .then(place => {
            document.getElementById("idplace").value = place[0].id;
            document.getElementById("namePlace").value = place[0].nome;
            document.getElementById("descriptionPlace").value = place[0].descricao;
            document.getElementById("cities").value = place[0].cidadeId;
            document.getElementById("files").value = place[0].arquivoId;
            document.getElementById("display").src = "data:image/png;base64,"+place[0].imagem;
            document.getElementById("display").style.width = "30%";
            document.getElementById("display").style.height = "30%";
            document.getElementById("createPlace").innerHTML = "EDITAR LUGAR"
        });
    });
}

function apagarLugar(id){
    fetch(url+`Lugar/${id}`,{
        method: 'DELETE'
    })
    .then(response => {
        if(!response.ok){
            alert('falhou a requisição');
            return;
        }
    
        if (response.status === 404) {
            alert('não encontrou qualquer resultado');
            return;
        }

        alert('lugar apagado com sucesso');
        location.reload();
    });
}

fetch(url+"Cidade")
.then(response => {
    if(!response.ok){
        alert('falhou a requisição')
        return 
    }

    if (response.status === 404) {
        alert('não encontrou qualquer resultado')
        return
    }

    response.json().then(cidades => {
        for(var cidade of cidades){
            let option = document.createElement("option");
            option.value = cidade.id;
            option.text = cidade.nome;
            document.getElementById("cities").appendChild(option)
        }
    });
});

fetch(url+"Arquivo/dadosArquivos")
.then(response => {
    if(!response.ok){
        alert('falhou a requisição')
        return 
    }

    if (response.status === 404) {
        alert('não encontrou qualquer resultado')
        return
    }

    response.json().then(files => {
        for(var file of files){
            let option = document.createElement("option");
            option.value = file.id;
            option.text = file.nomeArquivo;
            document.getElementById("files").appendChild(option)
        }
    });
});

document.getElementById("createPlace").addEventListener('click', ()=>{
    let cidadeId = parseInt(document.getElementById("cities").value);
    let nomeLugar = document.getElementById("namePlace").value;
    let descricaoLugar = document.getElementById("descriptionPlace").value;
    let imagemBase64 = document.getElementById("display").src.replace('data:', '').replace(/^.+,/, '');
    let arquivoId = parseInt(document.getElementById("files").value);
    let idplace = document.getElementById("idplace").value
    let urlplace;
    let method;

    if(!idplace){
        urlplace = url+"Lugar";
        method = "POST";
    }else{
        urlplace = url+`Lugar/${idplace}`
        method = "PUT"
    }

    let lugar = {
        Nome: nomeLugar,
        Descricao: descricaoLugar,
        ArquivoId: arquivoId,
        CidadeId: cidadeId,
        Imagem: imagemBase64
    }

    if(!cidadeId || !nomeLugar || !descricaoLugar || !arquivoId){
        alert("necessario preencher todos os campos");
        return
    }

    CreateOrEditPlace(lugar, urlplace, method);
});

function CreateOrEditPlace(lugarParametro, urlplace, method){
    try{
        fetch(urlplace, {
            method: method,
            body: JSON.stringify(lugarParametro),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(result => {
            if(!result.ok){
                alert('falhou a requisição')
                return 
            }
    
            if (result.status === 404) {
                alert('não encontrou qualquer resultado')
                return
            }

            if(result.status == 204){
                alert("lugar atualizado com sucesso");
                window.location = "/assets/pages/place/Place.html";
                return
            }
    
            alert("lugar criado com sucesso");
            window.location = "/assets/pages/place/Place.html";
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
        var imageDisplay = document.getElementById("display");
        imageDisplay.src = reader.result;
        imageDisplay.style.width = "30%";
        imageDisplay.style.height = "30%";
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
});

function criarModal(){
    var modal = document.getElementById("myModal");
    modal.style.display = "block";

    var span = document.getElementsByClassName("close1")[0];
    span.onclick = function() {
        refreshDados();
      modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            refreshDados();
            modal.style.display = "none";
        }
    }
}


function refreshDados(){
    document.getElementById("idplace").value = "";
    document.getElementById("namePlace").value = "";
    document.getElementById("descriptionPlace").value = "";
    document.getElementById("cities").value = "";
    document.getElementById("files").value = "";
    document.getElementById("display").src = "";
    document.getElementById("imagePlace").value = "";
    document.getElementById("display").style.width = "0";
    document.getElementById("display").style.height = "0";
    document.getElementById("createPlace").innerHTML = "CRIAR LUGAR"
}