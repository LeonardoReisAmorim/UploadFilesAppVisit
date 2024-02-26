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
                    <div style="margin-right:20px"><button type="button" onclick="editarLugar(${element.id})">Editar Lugar</button></div>
                    <div><button type="button" onclick="apagarLugar(${element.id})">Apagar Lugar</button></div>
                </div>
               </td>
           </tr> `
           table.appendChild(row);
        });
    });
});

function editarLugar(id){
    alert(id);
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

