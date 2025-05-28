// Selectors 
const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');

// Event Listeners
toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', handleTodoAction);
document.addEventListener("DOMContentLoaded", getTodos);

// Apply saved theme
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ? changeTheme('standard') : changeTheme(savedTheme);

// Functions
function addToDo(event) {
    event.preventDefault();

    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add('todo', `${savedTheme}-todo`);

    const newToDo = document.createElement('li');
    if (toDoInput.value === '') {
        alert("You must write something!");
    } else {
        newToDo.innerText = toDoInput.value;
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);

        savelocal(toDoInput.value);

        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add('check-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(checked);

        const edited = document.createElement('button');
        edited.innerHTML = '<i class="fas fa-pen"></i>';
        edited.classList.add('edit-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(edited);

        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add('delete-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);

        toDoList.appendChild(toDoDiv);
        toDoInput.value = '';
    }
}

function handleTodoAction(event) {
    const item = event.target;
    const parent = item.closest('.todo');

    // Delete
    if (item.classList.contains('delete-btn')) {
        parent.classList.add("fall");
        removeLocalTodos(parent);
        parent.addEventListener('transitionend', function () {
            parent.remove();
        });
    }

    // Check
    if (item.classList.contains('check-btn')) {
        parent.classList.toggle("completed");
    }

    // Edit
    if (item.classList.contains('edit-btn')) {
        const li = parent.querySelector('.todo-item');
        const oldText = li.innerText;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = oldText;
        input.classList.add('edit-input');
        parent.replaceChild(input, li);
        input.focus();

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                const newText = input.value.trim();
                if (newText === '') {
                    alert("Task cannot be empty.");
                    input.focus();
                    return;
                }

                const newLi = document.createElement('li');
                newLi.innerText = newText;
                newLi.classList.add('todo-item');
                parent.replaceChild(newLi, input);

                updateLocalTodos(oldText, newText);
            }
        });
    }
}

// Local storage functions
function savelocal(todo) {
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];

    todos.forEach(function (todo) {
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add("todo", `${savedTheme}-todo`);

        const newToDo = document.createElement('li');
        newToDo.innerText = todo;
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);

        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add("check-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(checked);

        const edited = document.createElement('button');
        edited.innerHTML = '<i class="fas fa-pen"></i>';
        edited.classList.add("edit-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(edited);

        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add("delete-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);

        toDoList.appendChild(toDoDiv);
    });
}

function removeLocalTodos(todoElement) {
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    const todoText = todoElement.querySelector('.todo-item')?.innerText;
    const index = todos.indexOf(todoText);
    if (index > -1) {
        todos.splice(index, 1);
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

function updateLocalTodos(oldTodo, newTodo) {
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    const index = todos.indexOf(oldTodo);
    if (index !== -1) {
        todos[index] = newTodo;
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');

    document.body.className = color;

    if (color === 'darker') {
        document.getElementById('title').classList.add('darker-title');
    } else {
        document.getElementById('title').classList.remove('darker-title');
    }

    document.querySelector('input.todo-input').className = `todo-input ${color}-input`;

    document.querySelectorAll('.todo').forEach(todo => {
        todo.className = todo.classList.contains('completed')
            ? `todo ${color}-todo completed`
            : `todo ${color}-todo`;
    });

    document.querySelectorAll('button').forEach(button => {
        if (button.classList.contains('check-btn')) {
            button.className = `check-btn ${color}-button`;
        } else if (button.classList.contains('delete-btn')) {
            button.className = `delete-btn ${color}-button`;
        } else if (button.classList.contains('edit-btn')) {
            button.className = `edit-btn ${color}-button`;
        } else if (button.classList.contains('todo-btn')) {
            button.className = `todo-btn ${color}-button`;
        }
    });
}
