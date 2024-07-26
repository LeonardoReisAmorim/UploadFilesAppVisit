var url = "https://localhost:7011/";
var endpoint = "Arquivo";

async function GetDadosArquivos(){
    try{
        let response = await fetch(url+`${endpoint}/dadosArquivos`);

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

GetDadosArquivos().then(files => {
    files.forEach(element => {
        var table = document.getElementById("table");
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

async function editarArquivo(id){
    criarModal();

    try{
        let response = await fetch(url+`${endpoint}/dadosArquivos/${id}`)

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

        await response.json().then(file => {
            document.getElementById("nomeArquivo").value = file[0].nomeArquivo;
            document.getElementById("labelEditFile").style.display = "block";
            document.getElementById("idFile").value = file[0].id;
        });
    }catch(error){
        fecharModal();
        document.getElementById("loading").style.display = "none";
        document.getElementsByClassName("containerTable")[0].style.display = "none";
        document.getElementsByClassName("errorServer")[0].style.display = "block";
    }
}

async function apagarArquivo(id){
    if(confirm("Tem certeza que deseja excluir"))
    {
        document.getElementById("loading").style.display = "block";
        document.getElementById("loading").style.zIndex = 99999;

        try{
            let response = await fetch(url+`${endpoint}/${id}`,{
                method: 'DELETE'
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
            alert('arquivo apagado com sucesso');
            location.reload();
        }catch(error){
            document.getElementById("loading").style.display = "none";
            document.getElementsByClassName("containerTable")[0].style.display = "none";
            document.getElementsByClassName("errorServer")[0].style.display = "block";
        }
    }
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

async function ChamarAjaxComArquivos() {
    let formData = new FormData();
    let file = document.getElementById("selecao-arquivo").files[0];
    let nomearquivo = document.getElementById("nomeArquivo").value;
    let idFile = document.getElementById("idFile").value
    let urlFile;
    let method;

    if(!idFile){
        urlFile = url+endpoint;
        method = "POST";
    }else{
        urlFile = url+`${endpoint}/${idFile}`
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

    try{
        let response = await fetch(urlFile, {
            method: method,
            body: formData
        })

        if(!response.ok && response.status === 400){
            document.getElementById("loading").style.display = "none";
            result.json().then(x => {
                alert(x.error);
            });
            return
        }else if(!response.ok){
            document.getElementById("loading").style.display = "none";
            response.text().then(x => {
                const match = x.match(/^System\.Exception: .*/m);
                const exceptionLine = match ? match[0] : null;
                alert(exceptionLine.split(": ")[1]);
            });
            return
        }

        if(response.status === 204){
            document.getElementById("loading").style.display = "none";
            alert("Arquivo atualizado com sucesso");
            location.reload();
            return
        }

        document.getElementById("loading").style.display = "none";
        alert("Arquivo importado com sucesso");
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