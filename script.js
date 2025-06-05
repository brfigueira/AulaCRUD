/*Funções de Requisição de API*/

//função GET: busca todos os dados
function apiGet() {
    // Alterado para usar localStorage em vez de fetch
    const data = localStorage.getItem('wordList');
    return Promise.resolve(data ? JSON.parse(data) : null);
}

//função POST: criar um novo dado
function apiPost(word) {
    // Implementado com localStorage
    return apiGet().then(data => {
        const newData = data || {};
        const id = Date.now().toString();
        newData[id] = { text: word };
        localStorage.setItem('wordList', JSON.stringify(newData));
        return id;
    });
}

//função PUT: atualizar um dado existente
function apiPut(id, word) {
    // Implementado com localStorage
    return apiGet().then(data => {
        if (data && data[id]) {
            data[id].text = word;
            localStorage.setItem('wordList', JSON.stringify(data));
            return true;
        }
        return false;
    });
}

//function DELETE: Remover um dado existente
function apiDelete(id) {
    // Implementado com localStorage
    return apiGet().then(data => {
        if (data && data[id]) {
            delete data[id];
            localStorage.setItem('wordList', JSON.stringify(data));
            return true;
        }
        return false;
    });
}

/*Funções de processamento de dados*/

//função para renderizar os dados na página
function renderData(data) {
    const dataList = document.getElementById('dataList')
    dataList.innerHTML = "";

    if (data) {
        Object.keys(data).forEach(id => {
            const li = document.createElement('li');

            //campo de input para a edição
            const input = document.createElement('input');
            input.type = 'text';
            input.value = data[id].text;
            input.id = `input-${id}`;

            //botao de salvar edição
            const saveButton = document.createElement('button');
            saveButton.classList.add('save-btn');
            saveButton.textContent = 'Editar';
            saveButton.onclick = () => {
                const newText = input.value;
                handleUpdate(id, newText);
            }

            //botão deletar
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');
            deleteButton.textContent = 'Deletar';
            deleteButton.onclick = () => handleDelete(id);

            li.appendChild(input);
            li.appendChild(saveButton);
            li.appendChild(deleteButton);
            dataList.appendChild(li);
        });

    } else {
        dataList.innerHTML = '<li>Nenhum dado encontrado.</li>';
    }
}

//função para buscar e renderizar os dados
function getData() {
    apiGet().then(data => {
        renderData(data);
    }).catch(error => console.error('Erro ao buscar dados:', error));
}

//função para criar um novo dado
function handleCreate() {
    // Alterado para usar o ID correto do input (InputText)
    const inputElement = document.getElementById('InputText');
    const newWord = inputElement.value.trim();
    
    if (newWord) {
        apiPost(newWord).then(() => {
            inputElement.value = '';
            getData();
        });
    }
}

//função para atualizar um dado existente
function handleUpdate(id, newText) {
    if (newText.trim()) {
        apiPut(id, newText.trim()).then(success => {
            if (success) {
                getData();
            }
        });
    }
}

//função para deletar um dado existente
function handleDelete(id) {
    if (confirm('Tem certeza que deseja deletar este item?')) {
        apiDelete(id).then(success => {
            if (success) {
                getData();
            }
        });
    }
}

/* Configuração do event Listener */

//função para configurar os event listeners
function setupEventListeners() {
    const creatButton = document.getElementById('createButton');
    creatButton.addEventListener('click', handleCreate);
}

//função de inicialização
function init() {
    setupEventListeners();
    getData();
}

//inicializa a aplicação ao carrregar a página
window.onload = init;