const allTodosDiv = document.getElementById("all-todos"); //div
const todosList = document.getElementById("todos"); //ul
const addNewTodoDiv = document.getElementById("add-todo"); //div
const dltAllBtn = document.getElementById("dltAllBtn"); //btn

const getTodos = () => {
    const addFirstTodoImg = document.getElementById("add-first-todo");
    const noTodoImg = document.getElementById("no-todo");
    let oldTodos = JSON.parse(localStorage.getItem("todos"));
    todosList.innerHTML = "";
    if (oldTodos === null) {
        addFirstTodoImg.removeAttribute("style");
    }
    else {
        if (oldTodos.length > 0) {
            dltAllBtn.removeAttribute("style");
            addFirstTodoImg.setAttribute("style", "display: none !important")
            noTodoImg.setAttribute("style", "display: none !important")
            for (let i = 0; i < oldTodos.length; i++) {
                let newTodoItem = `<div class="todo-item d-flex">
                <input type="checkbox" />
                <div id="${i}" onclick="maintainTodo(this)">
                    <h6 class="no-margin">${oldTodos[i].title}</h6>`;
                let dueDate = new Date(oldTodos[i].dueDate);
                let dueDateTxt;
                if (dueDate.toDateString() !== "Thu Jan 01 1970") {
                    dueDateTxt = `${dueDate.toDateString()} ${(dueDate.toLocaleTimeString()).slice(0, 5)}${(dueDate.toLocaleTimeString()).slice(8)}`;
                }
                if (dueDateTxt) {
                    newTodoItem += `<p class="no-margin">${dueDateTxt}</p>`;
                }
                if (oldTodos[i].taskList !== "default") {
                    newTodoItem += `<p class="no-margin">${oldTodos[i].taskList}</p>`;
                }
                newTodoItem += `</div>
                </div>`;
                todosList.innerHTML += newTodoItem;
            }
        }
        else {
            dltAllBtn.setAttribute("style", "display: none !important")
            noTodoImg.removeAttribute("style");
        }
    }
}

const newTodoHeading = document.getElementById("new-todo-head"); //input
const newTodoTitle = document.getElementById("new-todo"); //input
const newTodoDescription = document.getElementById("todo-description");
const newTodoList = document.getElementById("task-list");
const dueDateInput = document.getElementById("due-date");
const dueTimeInput = document.getElementById("due-time");
const addTodoBtn = document.getElementById("add-todo-btn");
const saveTodoBtn = document.getElementById("save-todo");
const deleteTodoBtn = document.getElementById("delete-todo");
dueDateInput.addEventListener("change", () => {
    if (dueDateInput.value) {
        dueTimeInput.removeAttribute("style");
    }
});

/* Reusable functions */
const clearInputValues = () => {
    newTodoTitle.value = "";
    newTodoDescription.value = "";
    newTodoList.selectedIndex = 0;
    dueDateInput.value = "";
    dueTimeInput.value = "";
}

const addNewTodo = () => {
    allTodosDiv.setAttribute("style", "display:none !important");
    addNewTodoDiv.removeAttribute("style");
    addTodoBtn.removeAttribute("style");
    saveTodoBtn.setAttribute("style", "display: none !important");
    deleteTodoBtn.setAttribute("style", "display: none !important");
    dueTimeInput.setAttribute("style", "display: none !important");
    clearInputValues();
    newTodoHeading.innerHTML = "New Task";
}

const goBack = () => {
    allTodosDiv.removeAttribute("style");
    addNewTodoDiv.setAttribute("style", "display:none !important");
    dueTimeInput.setAttribute("style", "display: none !important");
}

const addTodo = () => {
    const dueDate = new Date(`${dueDateInput.value} ${dueTimeInput.value}`);
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
        todos.push(newTodo);
        localStorage.setItem("todos", JSON.stringify(todos));
        getTodos();
        clearInputValues();
        dueTimeInput.setAttribute("style", "display: none !important")
        addNewTodoDiv.setAttribute("style", "display:none !important");
        allTodosDiv.removeAttribute("style");
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

const maintainTodo = (todoItem) => {
    const allTodos = JSON.parse(localStorage.getItem("todos"))
    const todoIndex = Number(todoItem.getAttribute("id"));
    const todoToEdit = allTodos[todoIndex]
    addTodoBtn.setAttribute("style", "display: none !important")
    allTodosDiv.setAttribute("style", "display:none !important");
    saveTodoBtn.removeAttribute("style");
    deleteTodoBtn.removeAttribute("style");
    addNewTodoDiv.removeAttribute("style");
    newTodoHeading.innerHTML = "Edit Task";
    newTodoTitle.value = todoToEdit.title;
    newTodoDescription.value = todoToEdit.description;
    if (todoToEdit.dueDate) {
        dueDateInput.value = (todoToEdit.dueDate).slice(0, 10);
        if (dueDateInput.value) {
            dueTimeInput.removeAttribute("style");
        }
        let todoDueDate = new Date(todoToEdit.dueDate);
        let dueTimeEdit;
        if (todoDueDate.getHours() < 10) {
            dueTimeEdit = `0${todoDueDate.getHours()}:`;
        } else {
            dueTimeEdit = `${todoDueDate.getHours()}:`;
        }
        if (todoDueDate.getMinutes() < 10) {
            dueTimeEdit += `0${todoDueDate.getMinutes()}`;
        } else {
            dueTimeEdit += `${todoDueDate.getMinutes()}`;
        }
        dueTimeInput.value = dueTimeEdit;
        newTodoList.value = todoToEdit.taskList;
    }
    saveTodoBtn.addEventListener("click", () => {
        const dueDate = new Date(`${dueDateInput.value} ${dueTimeInput.value}`);
        const editedTodo = {
            title: newTodoTitle.value,
            description: newTodoDescription.value,
            dueDate,
            taskList: newTodoList.value
        };
        allTodos.splice(todoIndex, 1, editedTodo);
        localStorage.setItem("todos", JSON.stringify(allTodos));
        allTodosDiv.removeAttribute("style");
        addNewTodoDiv.setAttribute("style", "display: none !important");
        getTodos();
    });
    deleteTodoBtn.addEventListener("click", () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                allTodos.splice(todoIndex, 1)
                localStorage.setItem("todos", JSON.stringify(allTodos));
                allTodosDiv.removeAttribute("style");
                addNewTodoDiv.setAttribute("style", "display: none !important");
                getTodos();
            }
        })
    })
}

const deleteAll = () => {
    localStorage.setItem("todos", JSON.stringify([]));
    getTodos();
}