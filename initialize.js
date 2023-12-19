import { displayPost } from "./utils.js";

const usersData = [];
const body = document.body;
let allPosts = [];

function applyTheme(theme) {
    body.classList.toggle('dark-theme', theme === 'dark');
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }
});

const loader = document.getElementById('loader');
loader.style.display = 'block';


const postsPromise = fetch("https://jsonplaceholder.typicode.com/posts/")
    .then(response => response.json())
    .catch(error => {
        loader.style.display = 'none'; // Скрыть лоадер в случае ошибки
        console.error('Ошибка при получении данных о постах:', error);
    });

const usersPromise = fetch("https://jsonplaceholder.typicode.com/users")
    .then(response => response.json())
    .catch(error => {
        loader.style.display = 'none'; // Скрыть лоадер в случае ошибки
        console.error('Ошибка при получении данных о пользователях:', error);
    });

Promise.all([postsPromise, usersPromise])
    .then(([posts, users]) => {

        const userSelect = document.getElementById("userNameSelect");
        users.forEach(user => {
            usersData[user.id] = user;
            let option = document.createElement("option");
            option.text = user.name;
            userSelect.add(option);
        });

        allPosts = posts;
        posts.forEach(post => displayPost(post));

        loader.style.display = 'none';
    });

export {usersData, allPosts}