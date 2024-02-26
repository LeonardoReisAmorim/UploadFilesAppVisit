var url = "https://localhost:7011/";

fetch(url+"Arquivo/dadosArquivos")
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

    response.json().then(files => {
        files.forEach(element => {
            var table = document.getElementById("tableFile");
            var row = document.createElement("tr");
            row.innerHTML = 
            `<tr>
               <td>${element.id}</td>
               <td>${element.nomeArquivo}</td>
               <td>${element.dataCriacao}</td>
               <td>
               <div style="display: flex;flex-wrap: nowrap; justify-content: center">
                    <div style="margin-right:20px"><button type="button" onclick="editarArquivo(${element.id})">Editar Arquivo</button></div>
                    <div><button type="button" onclick="apagarArquivo(${element.id})">Apagar Arquivo</button></div>
                </div>
               </td>
           </tr> `
           table.appendChild(row);
        });
    });
});

function editarArquivo(id){
    alert(id);
}

function apagarArquivo(id){
    fetch(url+`Arquivo/${id}`,{
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

        alert('arquivo apagado com sucesso');
        location.reload();
    });
}

