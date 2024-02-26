var url = "https://localhost:7011/";

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
                alert("Arquivo importado com sucesso");
                window.location = "/assets/pages/file/File.html";
            });
        })
        
    }catch(error){
        alert(error);
    }
}