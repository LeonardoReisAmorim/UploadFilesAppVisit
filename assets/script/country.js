var url = "https://localhost:7011/";
var endpoint = "Country"

async function GetPaises(){
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

GetPaises().then(paises => {
    paises.forEach(element => {
        var table = document.getElementById("table");
        var row = document.createElement("tr");
        row.innerHTML = 
        `<tr>
           <td>${element.nome}</td>
           <td>
           <div style="display: flex;flex-wrap: nowrap; justify-content: center">
                <div style="margin-right:20px"><button type="button" class="btn btn-primary" onclick="GetPlaceById(${element.id})">Editar Pais</button></div>
                <div><button type="button" class="btn btn-danger" onclick="apagarPais(${element.id})">Apagar País</button></div>
            </div>
           </td>
       </tr> `
       table.appendChild(row);
    });
});

async function GetPlaceById(id){
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
    
        await response.json().then(pais => {
            document.getElementById("idPais").value = pais[0].id;
            document.getElementById("namePais").value = pais[0].nome;
            document.getElementById("createPais").innerHTML = "EDITAR PAÍS"
        });
    }catch(erro){
        fecharModal();
        document.getElementsByClassName("containerTable")[0].style.display = "none";
        document.getElementsByClassName("errorServer")[0].style.display = "block";
        document.getElementById("loading").style.display = "none";
    }
    
}

async function apagarPais(id){
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
            alert('pais apagado com sucesso');
            location.reload();
        }catch(erro){
            document.getElementsByClassName("containerTable")[0].style.display = "none";
            document.getElementsByClassName("errorServer")[0].style.display = "block";
            document.getElementById("loading").style.display = "none";
        }
    }
}

document.getElementById("createPais").addEventListener('click', ()=>{
    let nomePais = document.getElementById("namePais").value;
    let idPais = document.getElementById("idPais").value
    let urlplace;
    let method;

    if(!idPais){
        urlplace = url+endpoint;
        method = "POST";
    }else{
        urlplace = url+`${endpoint}/${idPais}`
        method = "PUT"
    }

    let pais = {
        Nome: nomePais
    }

    if(!pais.Nome){
        alert("O campo Nome é obrigatório");
        return
    }

    CreateOrEditPais(pais, urlplace, method);
});

async function CreateOrEditPais(paisParametro, urlplace, method){

    document.getElementById("loading").style.display = "block";
    document.getElementById("loading").style.zIndex = 99999;

    try{
        let response = await fetch(urlplace, {
            method: method,
            body: JSON.stringify(paisParametro),
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
            alert("país atualizado com sucesso");
            location.reload();
            return
        }

        document.getElementById("loading").style.display = "none";
        alert("país criado com sucesso");
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
    document.getElementById("idPais").value = "";
    document.getElementById("namePais").value = "";
    document.getElementById("createPais").innerHTML = "CRIAR PAÍS"
}