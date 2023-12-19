import {usersData} from "./initialize.js";

let importantPosts = JSON.parse(localStorage.getItem('importants')) || [];

function displayPost(jsonPost) {
    const postElement = document.createElement('div');
    postElement.dataset.userId = jsonPost.userId;
    postElement.id = 'postElement'

    const importantBtn = document.createElement('button');
    importantBtn.id = 'important-btn';

    const deleteBtn = document.createElement('button');
    deleteBtn.id = 'delete-btn';
    deleteBtn.textContent = 'Удалить';

    const userInfo = usersData[jsonPost.userId]
    postElement.className = 'post';

    postElement.innerHTML = `
    <h1 class="post-user-name not-clickable">${userInfo.name}</h1>
    <h3 class="post-title not-clickable">${jsonPost.title}</h3>
    <p class="post-body not-clickable">${jsonPost.body}</p>
  `;

    postElement.dataset.id = importantBtn.dataset.postId = deleteBtn.dataset.postId = jsonPost.id;

    isImportant(jsonPost.id) ? setImportantPost(importantBtn, postElement) : setOrdinaryPost(importantBtn, postElement);

    const btnsBox = document.createElement('div');
    btnsBox.className = 'btns-box';

    btnsBox.appendChild(deleteBtn);
    btnsBox.appendChild(importantBtn);

    postElement.appendChild(btnsBox);
}

function setOrdinaryPost(btn, postElement){
    document.querySelector('.posts-list').appendChild(postElement);
    btn.textContent = 'Добавить в важное';
    btn.className = 'add-important-btn';
}

function setImportantPost(btn, postElement) {
    document.querySelector('.important-posts-list').appendChild(postElement);
    btn.textContent = 'Убрать из важного';
    btn.className = 'remove-important-btn';
}

function isImportant(postId){
    return importantPosts.includes(postId);
}

function deletePost(postId) {
    let selector = isImportant(postId) ? '.important-posts-list' : '.posts-list';
    document.querySelector(selector).removeChild(getPostById(postId));
}

function getPostById(postId){
    let selector = isImportant(postId) ? '.important-posts-list' : '.posts-list';
    const  posts = document.querySelector(selector).children;
    return Array.from(posts).find((post) => +post.dataset.id === postId)
}

function addToImportant(postId){
    deletePost(postId);
    importantPosts.push(postId);
}

function removeFromImportant(postId){
    deletePost(postId)
    importantPosts = importantPosts.filter(value => value !== postId);
}

export {displayPost, isImportant, deletePost, getPostById, addToImportant, removeFromImportant, importantPosts};
