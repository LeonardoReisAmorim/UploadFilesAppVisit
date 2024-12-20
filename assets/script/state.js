var url = "https://localhost:7011/";
var endpoint = "State";
var token = localStorage.getItem("token");
var usuarioId = localStorage.getItem("usuarioId");

async function GetEstados(){
    try{
        let response = await fetch(url+endpoint, {
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
    
        document.getElementById("loading").style.display = "none";
    
        return await response.json();
    }catch(erro){
        document.getElementsByClassName("containerTable")[0].style.display = "none";
        document.getElementsByClassName("errorServer")[0].style.display = "block";
        document.getElementById("loading").style.display = "none";
    }
}

GetEstados().then(estado => {
    estado.forEach(element => {
        var table = document.getElementById("table");
        var row = document.createElement("tr");
        row.innerHTML = 
        `<tr>
           <td>${element.name}</td>
           <td>
           <div style="display: flex;flex-wrap: nowrap; justify-content: center">
                <div style="margin-right:20px"><button type="button" class="btn btn-primary" onclick="GetEstadoById(${element.id})">Editar Estado</button></div>
                <div><button type="button" class="btn btn-danger" onclick="apagarEstado(${element.id})">Apagar Estado</button></div>
            </div>
           </td>
       </tr> `
       table.appendChild(row);
    });
});

async function GetEstadoById(id){
    criarModal();

    try{
        let response = await fetch(url+`${endpoint}/${id}`,{
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
    
        await response.json().then(estado => {
            document.getElementById("idEstado").value = estado[0].id;
            document.getElementById("nameEstado").value = estado[0].name;
            document.getElementById("pais").value = estado[0].countryId;
            document.getElementById("createEstado").innerHTML = "EDITAR ESTADO"
        });
    }catch(erro){
        fecharModal();
        document.getElementsByClassName("containerTable")[0].style.display = "none";
        document.getElementsByClassName("errorServer")[0].style.display = "block";
        document.getElementById("loading").style.display = "none";
    }
    
}

async function apagarEstado(id){
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
            alert('estado apagado com sucesso');
            location.reload();
        }catch(erro){
            document.getElementsByClassName("containerTable")[0].style.display = "none";
            document.getElementsByClassName("errorServer")[0].style.display = "block";
            document.getElementById("loading").style.display = "none";
        }
    }
}

async function GetPaises(){
    let response = await fetch(url+"Country",{
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

GetPaises().then(paises => {
    for(var pais of paises){
        let option = document.createElement("option");
        option.value = pais.id;
        option.text = pais.name;
        document.getElementById("pais").appendChild(option)
    }
});

document.getElementById("createEstado").addEventListener('click', ()=>{
    let paisId = parseInt(document.getElementById("pais").value);
    let nomeEstado = document.getElementById("nameEstado").value;
    let idEstado = document.getElementById("idEstado").value
    let urlplace;
    let method;

    if(!nomeEstado || !paisId){
        alert("os campos Pais e Nome são obrigatórias");
        return
    }

    if(!idEstado){
        urlplace = url+endpoint;
        method = "POST";
    }else{
        urlplace = url+`${endpoint}/${idEstado}`
        method = "PUT"
    }

    let estado = {
        Name: nomeEstado,
        CountryId: paisId
    }

    CreateOrEditEstado(estado, urlplace, method);
});

async function CreateOrEditEstado(EstadoParametro, urlplace, method){

    document.getElementById("loading").style.display = "block";
    document.getElementById("loading").style.zIndex = 99999;

    try{
        let response = await fetch(urlplace, {
            method: method,
            body: JSON.stringify(EstadoParametro),
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
            alert("estado atualizado com sucesso");
            location.reload();
            return
        }

        document.getElementById("loading").style.display = "none";
        alert("estado criado com sucesso");
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
    document.getElementById("idEstado").value = "";
    document.getElementById("nameEstado").value = "";
    document.getElementById("pais").value = "";
    document.getElementById("createEstado").innerHTML = "CRIAR ESTADO"
}