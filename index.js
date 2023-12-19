import {usersData, allPosts} from "./initialize.js";
let countPosts = allPosts.length;

import {
    addToImportant,
    deletePost,
    displayPost,
    getPostById,
    importantPosts,
    isImportant,
    removeFromImportant
} from "./utils.js";

let isEditMode = false;
let postIdToEdit = null;

const body = document.body;

const clickControls = {
    postElement: postElementHandle,
    toggleThemeBtn: toggleThemeButtonHandle,
    openCreatePostModal: openPostModal,
    closePostModal: closePostModal,
    cancelDeleteBtn: closeConfirmModal,
    confirmDeleteBtn: confirmDeleteButtonHandle,
    savePostBtn: saveButtonHandle,
    "delete-btn": deleteButtonHandle,
    "important-btn": importantButtonHandle
}

const handleClick = function (target) {
    let argument;
    switch (target.id) {
        case "postElement":
            argument = target
            break;
        case "important-btn":
        case "delete-btn":
            argument = +target.dataset.postId;
            break;
    }

    clickControls[target.id] && clickControls[target.id].call(null, argument);
}

document.addEventListener("click", (e) => {
    handleClick(e.target);
})

function postElementHandle (target) {
    document.getElementById('userNameSelect').selectedIndex = target.dataset.userId - 1;
    document.getElementById('postTitle').value = target.querySelector('.post-title').textContent;
    document.getElementById('postContent').value = target.querySelector('.post-body').textContent;

    postIdToEdit = +target.dataset.id;
    openPostModal(true);
}

function saveButtonHandle(){
    event.preventDefault();
    savePost();
    closePostModal();

}

function confirmDeleteButtonHandle() {
    deletePost(postIdToEdit);
    closeConfirmModal();
}

function toggleThemeButtonHandle() {
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        saveTheme('light');
    } else {
        body.classList.add('dark-theme');
        saveTheme('dark');
    }
}

function saveTheme(theme) {
    localStorage.setItem('theme', theme);
}

function closePostModal() {
    document.getElementById('userNameSelect').selectedIndex = 0;
    document.getElementById('postTitle').value = "";
    document.getElementById('postContent').value = "";

    const modal = document.getElementById('postModal');

    modal.style.display = 'none';
    isEditMode = false;
}

function openConfirmModal(postId){
    postIdToEdit = postId;
    const modal = document.getElementById('confirmModal');
    modal.style.display = 'block';
}

function openPostModal(isEdit) {
    const modal = document.getElementById('postModal');
    modal.style.display = 'block';
    isEditMode = isEdit;
}

function closeConfirmModal(){
    const modal = document.getElementById('confirmModal');
    modal.style.display = 'none';
}

function getPostInfoFromModal(){
    const user = document.getElementById('userNameSelect');
    const postTitle = document.getElementById('postTitle');
    const postContent = document.getElementById('postContent');

    return {
        title: postTitle.value,
        body: postContent.value,
        userId: user.selectedIndex + 1,
    };
}

function savePost(){
    let postInfo = getPostInfoFromModal();
    if(postInfo) {
        isEditMode ? editPost(postInfo) : createPost(postInfo);
    }
}

function sendRequest(options) {
    fetch(options.url, {
        method: options.method,
        body: JSON.stringify(options.postInfo),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    })
        .then(options.callback);
}

function createPost(postInfo){
    sendRequest({
        url: 'https://jsonplaceholder.typicode.com/posts',
        callback: () => displayPost({
            title: postInfo.title,
            body: postInfo.body,
            userId: postInfo.userId,
            id: ++countPosts,
        }),
        method: "POST",
        postInfo: postInfo
    })

}

function editPost(postInfo){
    console.log(postInfo);
    sendRequest({
        url: `https://jsonplaceholder.typicode.com/posts/${postIdToEdit}`,
        callback: () => editPostData(getPostById(postIdToEdit), postInfo),
        method: "PUT",
        postInfo: postInfo
    })
}

function editPostData(post, data){
    post.querySelector('.post-title').textContent = data.title;
    post.querySelector('.post-body').textContent = data.body;
    post.querySelector('.post-user-name').textContent = usersData[data.userId].name;
    post.dataset.userId = data.userId;
}

function importantButtonHandle (postId) {
    const post = getPostById(postId);

    isImportant(postId) ? removeFromImportant(postId) : addToImportant(postId);

    displayPost({
        title: post.querySelector('.post-title').textContent,
        body: post.querySelector('.post-body').textContent,
        id: Number(post.dataset.id),
        userId: Number(post.dataset.userId),
    });

    localStorage.setItem('importants', JSON.stringify(importantPosts));
}
function deleteButtonHandle(postId) {
    isImportant(postId) ? openConfirmModal(postId) : deletePost(postId);
}