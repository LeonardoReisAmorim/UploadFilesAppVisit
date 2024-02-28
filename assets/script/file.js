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

    response.json()
    .then(files => {
        files.forEach(element => {
            var table = document.getElementById("tableFile");
            var row = document.createElement("tr");
            row.innerHTML = 
            `<tr>
               <td>${element.id}</td>
               <td>${element.nomeArquivo}</td>
               <td>${element.dataCriacao}</td>
               <td>
               <div style="display: flex;flex-wrap: nowrap;">
                    <div style="margin-right:20px"><button type="button" class="btn btn-primary" onclick="editarArquivo(${element.id})">Substituir Arquivo</button></div>
                    <div><button type="button" class="btn btn-danger" onclick="apagarArquivo(${element.id})">Apagar Arquivo</button></div>
                </div>
               </td>
           </tr> `
           table.appendChild(row);
        });
    });
});

function editarArquivo(id){
    criarModal();

    fetch(url+`Arquivo/dadosArquivos/${id}`)
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
        .then(file => {
            document.getElementById("nomeArquivo").value = file[0].nomeArquivo;
            document.getElementById("labelEditFile").style.display = "block";
            document.getElementById("idFile").value = file[0].id;
        });
    });
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
    let formData = new FormData();
    let file = document.getElementById("selecao-arquivo").files[0];
    let nomearquivo = document.getElementById("nomeArquivo").value;
    let idFile = document.getElementById("idFile").value
    let urlFile;
    let method;

    if(!idFile){
        urlFile = url+"Arquivo";
        method = "POST";
    }else{
        urlFile = url+`Arquivo/${idFile}`
        method = "PUT"
    }

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
        fetch(urlFile, {
            method: method,
            body: formData
        })
        .then((result) => {
            if(!result.ok){
                alert(result.status);
                return
            }

            if(result.status === 204){
                alert("Arquivo atualizado com sucesso");
                window.location = "/assets/pages/file/File.html";
            }

            result.json().then(arquivo => {
                alert("Arquivo importado com sucesso");
                window.location = "/assets/pages/file/File.html";
            });
        })
        
    }catch(error){
        alert(error);
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


function refreshDados(){
    document.getElementById("nomeArquivo").value = "";
    document.getElementById("labelEditFile").style.display = "none";
    document.getElementById("idFile").value = "";
}