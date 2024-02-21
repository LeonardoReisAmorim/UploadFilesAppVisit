var url = "https://localhost:7011/Arquivo";

function InputFileChange() {
    let quantidade = document.getElementById("selecao-arquivo").files.length;
    if (quantidade > 0) {
        document.getElementById('salvar-anexos').style.display = "block";
    }
    else {
        document.getElementById('salvar-anexos').style.display = "none";
    }
    document.querySelector("body > div.custom-file > label").innerHTML = `${quantidade} Arquivo(s) Selecionado(s)`; 
}

function ChamarAjaxComArquivos() {
    var formData = new FormData();
    var totalFiles = document.getElementById("selecao-arquivo").files.length;

    for (var i = 0; i < totalFiles; i++) {
        var file = document.getElementById("selecao-arquivo").files[i];

        formData.append("selecao-arquivo", file);
    }

    fetch(url, {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(arquivo => {
        localStorage['arquivoId'] = arquivo.id;
        window.location = "/createPlace.html"
    });
}