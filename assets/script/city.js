var url = "https://apivisitvr.azurewebsites.net/";
var endpoint = "Cidade";

async function GetCidades(){
    try{
        let response = await fetch(url+endpoint);

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
    
        return await response.json();
    }catch(erro){
        document.getElementsByClassName("containerTable")[0].style.display = "none";
        document.getElementsByClassName("errorServer")[0].style.display = "block";
        document.getElementById("loading").style.display = "none";
    }
}

GetCidades().then(estados => {
    estados.forEach(element => {
        var table = document.getElementById("table");
        var row = document.createElement("tr");
        row.innerHTML = 
        `<tr>
           <td>${element.nome}</td>
           <td>
           <div style="display: flex;flex-wrap: nowrap; justify-content: center">
                <div style="margin-right:20px"><button type="button" class="btn btn-primary" onclick="GetCidadeById(${element.id})">Editar Cidade</button></div>
                <div><button type="button" class="btn btn-danger" onclick="apagarCidade(${element.id})">Apagar Cidade</button></div>
            </div>
           </td>
       </tr> `
       table.appendChild(row);
    });
});

async function GetCidadeById(id){
    criarModal();

    try{
        let response = await fetch(url+`${endpoint}/${id}`);
    
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
    
        await response.json().then(cidade => {
            document.getElementById("idCidade").value = cidade[0].id;
            document.getElementById("nameCidade").value = cidade[0].nome;
            document.getElementById("estado").value = cidade[0].estadoId;
            document.getElementById("createCidade").innerHTML = "EDITAR CIDADE"
        });
    }catch(erro){
        fecharModal();
        document.getElementsByClassName("containerTable")[0].style.display = "none";
        document.getElementsByClassName("errorServer")[0].style.display = "block";
        document.getElementById("loading").style.display = "none";
    }
    
}

async function apagarCidade(id){
    if(confirm("Tem certeza que deseja excluir"))
    {
        document.getElementById("loading").style.display = "block";
        document.getElementById("loading").style.zIndex = 99999;
    
        try{
            let response = await fetch(url+`${endpoint}/${id}`,{
                method: 'DELETE'
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
            alert('cidade apagada com sucesso');
            location.reload();
        }catch(erro){
            document.getElementsByClassName("containerTable")[0].style.display = "none";
            document.getElementsByClassName("errorServer")[0].style.display = "block";
            document.getElementById("loading").style.display = "none";
        }
    }
}

async function GetEstados(){
    let response = await fetch(url+"Estado");

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

GetEstados().then(estados => {
    for(var estado of estados){
        let option = document.createElement("option");
        option.value = estado.id;
        option.text = estado.nome;
        document.getElementById("estado").appendChild(option)
    }
});

document.getElementById("createCidade").addEventListener('click', ()=>{
    let estadoId = parseInt(document.getElementById("estado").value);
    let nomeCidade = document.getElementById("nameCidade").value;
    let idCidade = document.getElementById("idCidade").value;
    let urlplace;
    let method;

    if(!idCidade){
        urlplace = url+endpoint;
        method = "POST";
    }else{
        urlplace = url+`${endpoint}/${idCidade}`
        method = "PUT"
    }

    let cidade = {
        Nome: nomeCidade,
        EstadoId: estadoId
    }

    if(!cidade.Nome || !cidade.EstadoId){
        alert("os campos Estado e Nome são obrigatórias");
        return
    }

    CreateOrEditCidade(cidade, urlplace, method);
});

async function CreateOrEditCidade(cidadeParametro, urlplace, method){

    document.getElementById("loading").style.display = "block";
    document.getElementById("loading").style.zIndex = 99999;

    try{
        let response = await fetch(urlplace, {
            method: method,
            body: JSON.stringify(cidadeParametro),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
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
            alert("cidade atualizada com sucesso");
            location.reload();
            return
        }

        document.getElementById("loading").style.display = "none";
        alert("cidade criado com sucesso");
        location.reload();

    }catch(error){
        fecharModal();
        document.getElementById("loading").style.display = "none";
        document.getElementsByClassName("containerTable")[0].style.display = "none";
        document.getElementsByClassName("errorServer")[0].style.display = "block";
    }
    
}

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
    document.getElementById("idCidade").value = "";
    document.getElementById("nameCidade").value = "";
    document.getElementById("estado").value = "";
    document.getElementById("createCidade").innerHTML = "CRIAR CIDADE"
}