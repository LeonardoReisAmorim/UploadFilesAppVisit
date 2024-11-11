var url = "https://localhost:7011/";
var endpoint = "Place";
var token = localStorage.getItem("token");
var usuarioId = localStorage.getItem("usuarioId");

async function GetLugares(){
    try{
        let response = await fetch(url+endpoint, {
            headers: {Authorization: `Bearer ${token}`}
        });

        if(response.status == 401){
            alert("não autorizado");
            return;
        }

        if(!response.ok){
            document.getElementById("loading").style.display = "none";
            response.text().then(x => {
                const match = x.match(/^System\.Exception: .*/m);
                const exceptionLine = match ? match[0] : null;
                alert(exceptionLine.split(": ")[1]);
            });
            return;
        }
    
        if (response.status === 404) {
            alert('não encontrou qualquer resultado');
            return;
        }
    
        document.getElementById("loading").style.display = "none";
    
        return await response.json();
    }catch(erro){
        document.getElementsByClassName("containerTable")[0].style.display = "none";
        document.getElementsByClassName("errorServer")[0].style.display = "block";
        document.getElementById("loading").style.display = "none";
    }
}

GetLugares().then(places => {
    places.forEach(element => {
        var table = document.getElementById("table");
        var row = document.createElement("tr");
        row.innerHTML = 
        `<tr>
           <td>${element.nome}</td>
           <td>${element.descricao}</td>
           <td>${element.cidade}</td>
           <td>${element.nomeArquivo}</td>
           <td>${element.instrucoesUtilizacaoVR}</td>
           <td>
           <div style="display: flex;flex-wrap: nowrap; justify-content: center">
                <div style="margin-right:20px"><button type="button" class="btn btn-primary" onclick="GetLugarById(${element.id})">Editar Lugar</button></div>
                <div><button type="button" class="btn btn-danger" onclick="apagarLugar(${element.id})">Apagar Lugar</button></div>
            </div>
           </td>
       </tr> `
       table.appendChild(row);
    });
});

async function GetLugarById(id){
    criarModal();

    try{
        let response = await fetch(url+`${endpoint}/${id}`, {
            headers: {Authorization: `Bearer ${token}`}
        });
    
        if(!response.ok){
            document.getElementById("loading").style.display = "none";
            response.text().then(x => {
                const match = x.match(/^System\.Exception: .*/m);
                const exceptionLine = match ? match[0] : null;
                alert(exceptionLine.split(": ")[1]);
            });
            return
        }
        
        if (response.status === 404) {
            alert('não encontrou qualquer resultado');
            return;
        }
    
        await response.json().then(place => {
            document.getElementById("idplace").value = place[0].id;
            document.getElementById("namePlace").value = place[0].nome;
            document.getElementById("descriptionPlace").value = place[0].descricao;
            document.getElementById("cities").value = place[0].cidadeId;
            document.getElementById("files").value = place[0].arquivoId;
            document.getElementById("instructionVRPlace").value = place[0].instrucoesUtilizacaoVR;
            document.getElementById("display").src = "data:image/png;base64,"+place[0].imagem;
            document.getElementById("display").style.width = "30%";
            document.getElementById("display").style.height = "30%";
            document.getElementById("createPlace").innerHTML = "EDITAR LUGAR"
        });
    }catch(erro){
        fecharModal();
        document.getElementsByClassName("containerTable")[0].style.display = "none";
        document.getElementsByClassName("errorServer")[0].style.display = "block";
        document.getElementById("loading").style.display = "none";
    }
    
}

async function apagarLugar(id){
    if(confirm("Tem certeza que deseja excluir"))
    {
        document.getElementById("loading").style.display = "block";
        document.getElementById("loading").style.zIndex = 99999;
    
        try{
            let response = await fetch(url+`${endpoint}/${id}`,{
                method: 'DELETE',
                headers: {Authorization: `Bearer ${token}`}
            })
        
            if(!response.ok){
                document.getElementById("loading").style.display = "none";
                response.text().then(x => {
                    const match = x.match(/^System\.Exception: .*/m);
                    const exceptionLine = match ? match[0] : null;
                    alert(exceptionLine.split(": ")[1]);
                });
                return
            }
            
            if (response.status === 404) {
                alert('não encontrou qualquer resultado');
                return;
            }
        
            document.getElementById("loading").style.display = "none";
            alert('lugar apagado com sucesso');
            location.reload();
        }catch(erro){
            document.getElementsByClassName("containerTable")[0].style.display = "none";
            document.getElementsByClassName("errorServer")[0].style.display = "block";
            document.getElementById("loading").style.display = "none";
        }
    }
}

async function GetCidades(){
    let response = await fetch(url+"Cidade", {
        headers: {Authorization: `Bearer ${token}`}
    });

    if(!response.ok){
        document.getElementById("loading").style.display = "none";
        response.text().then(x => {
            const match = x.match(/^System\.Exception: .*/m);
            const exceptionLine = match ? match[0] : null;
            alert(exceptionLine.split(": ")[1]);
        });
        return
    }
    
    if (response.status === 404) {
        alert('não encontrou qualquer resultado')
        return
    }

    return await response.json()
}

GetCidades().then(cidades => {
    for(var cidade of cidades){
        let option = document.createElement("option");
        option.value = cidade.id;
        option.text = cidade.nome;
        document.getElementById("cities").appendChild(option)
    }
});

async function GetDadosArquivos(){
    let response = await fetch(url+"Arquivo/dadosArquivos", {
        headers: {Authorization: `Bearer ${token}`}
    });
    
    if(!response.ok){
        document.getElementById("loading").style.display = "none";
        response.text().then(x => {
            const match = x.match(/^System\.Exception: .*/m);
            const exceptionLine = match ? match[0] : null;
            alert(exceptionLine.split(": ")[1]);
        });
        return
    }
    
    if (response.status === 404) {
        alert('não encontrou qualquer resultado')
        return
    }

    return await response.json();
}

GetDadosArquivos().then(files => {
    for(var file of files){
        let option = document.createElement("option");
        option.value = file.id;
        option.text = file.nomeArquivo;
        document.getElementById("files").appendChild(option)
    }
});

document.getElementById("createPlace").addEventListener('click', ()=>{
    let cidadeId = parseInt(document.getElementById("cities").value);
    let nomeLugar = document.getElementById("namePlace").value;
    let descricaoLugar = document.getElementById("descriptionPlace").value;
    let imagemBase64 = document.getElementById("display").src.replace('data:', '').replace(/^.+,/, '');
    let arquivoId = parseInt(document.getElementById("files").value);
    let idplace = document.getElementById("idplace").value
    let instrucoesUtilizacaoVR = document.getElementById("instructionVRPlace").value;
    let urlplace;
    let method;

    if(!idplace){
        urlplace = url+endpoint;
        method = "POST";
    }else{
        urlplace = url+`${endpoint}/${idplace}`
        method = "PUT"
    }

    let lugar = {
        Nome: nomeLugar,
        Descricao: descricaoLugar,
        ArquivoId: arquivoId,
        CidadeId: cidadeId,
        Imagem: imagemBase64,
        InstrucoesUtilizacaoVR: instrucoesUtilizacaoVR
    }

    if(!lugar.CidadeId || !lugar.Nome || !lugar.Descricao || !lugar.ArquivoId || !lugar.InstrucoesUtilizacaoVR){
        alert("os campos Cidade, Nome, Descricao, Arquivo e Instrucoes são obrigatórias");
        return
    }

    CreateOrEditPlace(lugar, urlplace, method);
});

async function CreateOrEditPlace(lugarParametro, urlplace, method){

    document.getElementById("loading").style.display = "block";
    document.getElementById("loading").style.zIndex = 99999;

    try{
        let response = await fetch(urlplace, {
            method: method,
            body: JSON.stringify(lugarParametro),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": "Bearer " + token
            }
        })

        if(!response.ok){
            document.getElementById("loading").style.display = "none";
            response.text().then(x => {
                const match = x.match(/^System\.Exception: .*/m);
                const exceptionLine = match ? match[0] : null;
                alert(exceptionLine.split(": ")[1]);
            });
            return
        }

        if (response.status === 404) {
            alert('não encontrou qualquer resultado')
            return
        }

        if(response.status == 204){
            document.getElementById("loading").style.display = "none";
            alert("lugar atualizado com sucesso");
            location.reload();
            return
        }

        document.getElementById("loading").style.display = "none";
        alert("lugar criado com sucesso");
        location.reload();

    }catch(error){
        fecharModal();
        document.getElementById("loading").style.display = "none";
        document.getElementsByClassName("containerTable")[0].style.display = "none";
        document.getElementsByClassName("errorServer")[0].style.display = "block";
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

function fecharModal(){
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

function refreshDados(){
    document.getElementById("idplace").value = "";
    document.getElementById("namePlace").value = "";
    document.getElementById("descriptionPlace").value = "";
    document.getElementById("cities").value = "";
    document.getElementById("files").value = "";
    document.getElementById("instructionVRPlace").value = "";
    document.getElementById("display").src = "";
    document.getElementById("imagePlace").value = "";
    document.getElementById("display").style.width = "0";
    document.getElementById("display").style.height = "0";
    document.getElementById("createPlace").innerHTML = "CRIAR LUGAR"
}