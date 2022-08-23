const form = document.getElementById('github-form');
form.addEventListener('submit', handleSubmit);

const mainDiv = document.getElementById('main');
const listDiv = document.getElementById('github-container');
const flipButton = document.createElement('button');
flipButton.textContent = 'Users';
mainDiv.appendChild(flipButton);
mainDiv.insertBefore(flipButton, listDiv);

flipButton.addEventListener('click', e => {
    if(e.target.textContent === 'Users'){
        e.target.textContent = 'Repos'
    } else {
        e.target.textContent = 'Users'
    }
})


function handleSubmit(e) {
    e.preventDefault();
    let input = '';

    if(flipButton.textContent === 'Users'){
        input = `https://api.github.com/search/users?q=${e.target[0].value}`
    } else {
        input = `https://api.github.com/users/${e.target[0].value}/repos`
    }
    
    fetch(input, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(res => res.json())
    .then(data => {
        if(flipButton.textContent === 'Users'){
            const repoList = document.querySelectorAll('.repo-list-item');
            if(repoList !== null){
                repoList.forEach(element => element.remove());
            }
            getUsers(data);
        } else {
            const userTable = document.getElementById('user-table');
            if(userTable !== null){
                userTable.remove();
            }
            getRepos(data);
        }

    })
    .catch(err => {
        const userContainer = document.getElementById('user-list');
        const p = document.createElement('p');
        p.textContent = err.message;
        userContainer.appendChild(p);
    })
}


function getUsers(data){
    const responseItems = ['html_url', 'avatar_url', 'login'];
    let responseData = []

    data.items.forEach(element => {
        let items = [];
        responseItems.map(item => items.push(element[item]));
        responseData.push(items); 
    })

    const userListElement = document.getElementById('user-list');
    const table = document.createElement('table')
    table.id = 'user-table'

    responseData.forEach(element => {
        const row = table.insertRow(element);
        element.forEach(innerElement => {
            const cell = row.insertCell(innerElement);
            if(innerElement.includes('https://avatars.')){
                const img = document.createElement('img');
                img.src = innerElement
                img.alt = 'avatar'
                img.width = '50'
                img.height = '50'
                cell.appendChild(img);
            } else if(innerElement.includes('https://')){
                const link = document.createElement('a');
                link.href = innerElement;
                link.textContent = innerElement;
                cell.appendChild(link);
            } else {
                cell.textContent = innerElement;
            }
        })
    })
    userListElement.appendChild(table);
}


function getRepos(data){
    const repoList = document.getElementById('repos-list');

    data.forEach(element => {
        const li = document.createElement('li');
        li.className = 'repo-list-item'

        const link = document.createElement('a');
        link.href = element.html_url;
        link.textContent = element.html_url;

        li.appendChild(link);
        repoList.appendChild(li);
    })
}

