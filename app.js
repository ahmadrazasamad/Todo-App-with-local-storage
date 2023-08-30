const allTodosDiv = document.getElementById("all-todos"); //div
const todosList = document.getElementById("todos"); //ul
const addNewTodoDiv = document.getElementById("add-todo"); //div

let addNewTodo = () => {
    allTodosDiv.setAttribute("style", "display:none !important")
    addNewTodoDiv.removeAttribute("style")
}

let addTodo = () => {
    const newTodoInput = document.getElementById("new-todo"); //input
    const newTodoDescription = document.getElementById("todo-description");
    let todos = localStorage.getItem("todos");
    if (!todos) {
        todos = [];
    }
    else {
        todos = JSON.parse(todos);
    }
    const newTodo = {
        title: newTodoInput.value,
        description: newTodoDescription.value
    }
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
    todosList.innerHTML += `<li>${newTodoInput.value}<button onclick="editTodo()">Edit</button><button onclick="deleteTodo()">Delete</button></li>`;
    newTodoInput.value = "";
}

let getTodos = () => {
    let oldTodos = JSON.parse(localStorage.getItem("todos"));
    for (let i = 0; i < oldTodos.length; i++) {
        todosList.innerHTML += `<li>${oldTodos[i]}<button onclick="editTodo()">Edit</button><button onclick="deleteTodo()">Delete</button></li>`;
    }
}

let editTodo = () => {
    console.log("hello");
}
let deleteTodo = () => {
    console.log("world");
}