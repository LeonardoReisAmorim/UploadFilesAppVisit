var url = "https://localhost:7011/";

async function GetDadosArquivos(){
    try{
        let response = await fetch(url+"Arquivo/dadosArquivos");

        if(!response.ok){
            alert('falhou a requisição');
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
    }
}

GetDadosArquivos().then(files => {
    files.forEach(element => {
        var table = document.getElementById("tableFile");
        var row = document.createElement("tr");
        row.innerHTML = 
        `<tr>
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
    }).catch((erro)=>{
        fecharModal();
        document.getElementById("loading").style.display = "none";
        document.getElementsByClassName("containerTable")[0].style.display = "none";
        document.getElementsByClassName("errorServer")[0].style.display = "block";
    });
}

function apagarArquivo(id){
    document.getElementById("loading").style.display = "block";
    document.getElementById("loading").style.zIndex = 99999;

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

        document.getElementById("loading").style.display = "none";
        alert('arquivo apagado com sucesso');
        location.reload();
    }).catch((erro)=>{
        document.getElementById("loading").style.display = "none";
        document.getElementsByClassName("containerTable")[0].style.display = "none";
        document.getElementsByClassName("errorServer")[0].style.display = "block";
    });
}

function InputFileChange() {
    let quantidade = document.getElementById("selecao-arquivo").files.length;
    if (quantidade > 0) {
        document.getElementById('salvar-anexos').style.display = "block";
        document.getElementById("labelArquivo").innerHTML = `${quantidade} Arquivo Selecionado`; 
    }
    else {
        document.getElementById('salvar-anexos').style.display = "none";
        document.getElementById("labelArquivo").innerHTML = `Selecione os arquivos`; 
    }
    
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
        alert("necessario o nome do arquivo");
        return
    }

    formData.append("selecao-arquivo", file);

    formData.append("dadosArquivo", JSON.stringify({
        NomeArquivo: nomearquivo,
        DataCriacao: new Date().toLocaleString('en-US').replace(',','')
    }));

    document.getElementById("loading").style.display = "block";
    document.getElementById("loading").style.zIndex = 99999;

    fetch(urlFile, {
        method: method,
        body: formData
    })
    .then((result) => {
        if(!result.ok){
            document.getElementById("loading").style.display = "none";
            alert(result.status);
            return
        }

        if(result.status === 204){
            document.getElementById("loading").style.display = "none";
            alert("Arquivo atualizado com sucesso");
            location.reload();
        }

        result.json().then(arquivo => {
            document.getElementById("loading").style.display = "none";
            alert("Arquivo importado com sucesso");
            location.reload();
        });
    }).catch((erro)=>{
        fecharModal();
        document.getElementById("loading").style.display = "none";
        document.getElementsByClassName("containerTable")[0].style.display = "none";
        document.getElementsByClassName("errorServer")[0].style.display = "block";
    });
        
    
}

function criarModal(){
    var modal = document.getElementById("myModal");
    modal.style.display = "block";

    var span = document.getElementsByClassName("close1")[0];
    span.onclick = function() {
        refreshDados();
        InputFileChange();
      modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            refreshDados();
            InputFileChange();
            modal.style.display = "none";
        }
    }
}

function fecharModal(){
    var modal = document.getElementById("myModal");
    modal.style.display = "none"
}


function refreshDados(){
    document.getElementById("nomeArquivo").value = "";
    document.getElementById("labelEditFile").style.display = "none";
    document.getElementById("idFile").value = "";
    document.getElementById("selecao-arquivo").value = '';
}