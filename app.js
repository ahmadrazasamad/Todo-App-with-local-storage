let getTodos = () => {
    let oldTodos = JSON.parse(localStorage.getItem("todos"));
    if (oldTodos === null) {
        const addFirstTodoImg = document.getElementById("add-first-todo");
        addFirstTodoImg.removeAttribute("style");
    }
    else {
        if (oldTodos.length > 0) {
            for (let i = 0; i < oldTodos.length; i++) {
                todosList.innerHTML += "Hello World";
            }
        }
        else {
            const noTodo = document.getElementById("no-todo");
            noTodo.removeAttribute("style");
        }
    }
}

const allTodosDiv = document.getElementById("all-todos"); //div
const todosList = document.getElementById("todos"); //ul
const addNewTodoDiv = document.getElementById("add-todo"); //div

let addNewTodo = () => {
    allTodosDiv.setAttribute("style", "display:none !important");
    addNewTodoDiv.removeAttribute("style");
}

const newTodoTitle = document.getElementById("new-todo"); //input
const newTodoDescription = document.getElementById("todo-description");
const newTodoList = document.getElementById("task-list");
const dueDateInput = document.getElementById("due-date");
const dueTimeInput = document.getElementById("due-time");
dueDateInput.addEventListener("change", () => {
    if (dueDateInput.value) {
        dueTimeInput.removeAttribute("style");
    }
});

let addTodo = () => {
    let dueDate = new Date(`${dueDateInput.value} ${dueTimeInput.value}`);
    let dueDateTxt;
    if (!dueDate) {
        dueDateTxt = `${dueDate.toDateString()} ${(dueDate.toLocaleTimeString()).slice(0, 5)} ${(dueDate.toLocaleTimeString()).slice(8)}`;
    }
    let todos = localStorage.getItem("todos");
    if (!todos) {
        todos = [];
    }
    else {
        todos = JSON.parse(todos);
    }
    if ((newTodoTitle.value).trim() !== "") {
        const newTodo = {
            title: newTodoTitle.value,
            description: newTodoDescription.value,
            dueDate,
            taskList: newTodoList.value
        }
        let newTodoItem = `<div class="todo-item d-flex">
        <input type="checkbox" />
        <div>
            <h6 class="no-margin">${newTodoTitle.value}</h6>`;
        if (dueDateTxt) {
            newTodoItem += `<p class="no-margin">${dueDateTxt}</p>`;
        }
        if (newTodoList.value !== "default") {
            newTodoItem += `<p class="no-margin">${newTodoList.value}</p>`;
        }
        newTodoItem += `</div>
        </div>`;
        todosList.innerHTML += newTodoItem;
        todos.push(newTodo);
        addNewTodoDiv.setAttribute("style", "display:none !important");
        allTodosDiv.removeAttribute("style");
        localStorage.setItem("todos", JSON.stringify(todos));
    } else {
        newTodoTitle.className += " red-border";
        newTodoTitle.nextSibling.nextSibling.removeAttribute("style");
        newTodoTitle.addEventListener("input", (e) => {
            if ((e.target.value).length > 0) {
                newTodoTitle.classList.remove("red-border");
                newTodoTitle.nextSibling.nextSibling.setAttribute("style", "display: none !important");
            }
        })
    }
}

let editTodo = () => {
    console.log("hello");
}
let deleteTodo = () => {
    console.log("world");
}