let newTodo = document.getElementById("new-todo");
let todosList = document.getElementById("todos");

const addTodo = () => {
    let todos = localStorage.getItem("todos");
    if (!todos) {
        todos = [];
    }
    else {
        todos = JSON.parse(todos);
    }
    todos.push(newTodo.value);
    localStorage.setItem("todos", JSON.stringify(todos));
    todosList.innerHTML += `<li>${newTodo.value}<button onclick="editTodo()">Edit</button><button onclick="deleteTodo()">Delete</button></li>`;
    newTodo.value = "";
}

const getTodos = () => {
    let oldTodos = JSON.parse(localStorage.getItem("todos"));
    for (let i = 0; i < oldTodos.length; i++) {
        todosList.innerHTML += `<li>${oldTodos[i]}<button onclick="editTodo()">Edit</button><button onclick="deleteTodo()">Delete</button></li>`;
    }
}

const editTodo = () => {
    console.log("hello");
}
const deleteTodo = () => {
    console.log("world");
}