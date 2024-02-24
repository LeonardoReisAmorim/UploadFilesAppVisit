var url = "https://localhost:7011/";

let resultFiles = fetch(url+"Arquivo/dadosArquivos")
.then(response => {
    if(!response.ok){
        return new Error('falhou a requisição')
    }

    if (response.status === 404) {
        return new Error('não encontrou qualquer resultado')
    }

    return response.json();
});

resultFiles.then(files => {
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
                <div style="margin-right:20px"><button type="button" onclick="editarArquivo()">Editar Arquivo</button></div>
                <div><button type="button" onclick="apagarArquivo()">Apagar Arquivo</button></div>
            </div>
           </td>
       </tr> `
       table.appendChild(row);
    });
});



function InputFileChange() {
    let quantidade = document.getElementById("selecao-arquivo").files.length;
    if (quantidade > 0) {
        document.getElementById('salvar-anexos').style.display = "block";
    }
    else {
        document.getElementById('salvar-anexos').style.display = "none";
    }
    document.getElementById("labelArquivo").innerHTML = `${quantidade} Arquivo(s) Selecionado(s)`; 
}

function ChamarAjaxComArquivos() {
    var formData = new FormData();
    var file = document.getElementById("selecao-arquivo").files[0];
    var nomearquivo = document.getElementById("nomeArquivo").value;

    if(!nomearquivo){
        alert("necessario do nome do arquivo");
        return
    }

    formData.append("selecao-arquivo", file);

    formData.append("dadosArquivo", JSON.stringify({
        NomeArquivo: nomearquivo,
        DataCriacao: new Date().toLocaleString('en-US').replace(',','')
    }));

    try{
        fetch(url+"Arquivo", {
            method: "POST",
            body: formData
        })
        .then((result) => {
            if(!result.ok){
                alert(result.status);
                return
            }

            result.json().then(arquivo => {
                localStorage['arquivoId'] = arquivo.id;
                alert("Arquivo importado com sucesso");
                window.location = "/assets/pages/createPlace.html";
            });
        })
        
    }catch(error){
        alert(error);
    }
}

