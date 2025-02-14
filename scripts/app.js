import { Storage, taskForm, sections, tasks } from './storage.js';

function createTaskElement(task, idx) {
    const card = document.createElement('div');
    card.className = 'task-card';


    const header = document.createElement('div');
    header.className = 'task-header';
    
    const title = document.createElement('h3');
    title.className = 'task-title';
    title.textContent = task.name;
    
    const priority = document.createElement('span');
    priority.className = `priority-dot priority-${task.priority.toLowerCase()}`;
    header.append(title, priority);


    const desc = document.createElement('p');
    desc.className = 'task-description';
    desc.textContent = task.description;

    const meta = document.createElement('div');
    meta.className = 'task-meta';
    
    const due = document.createElement('span');
    due.textContent = task.dueDate;
    
    const statusSelect = document.createElement('select');
    statusSelect.className = 'status-select';
    statusSelect.idx = idx;
    
    const statusOptions = ['ToDo', 'InProgress', 'Complete'];
    for (let j = 0; j < statusOptions.length; j++) {
        const option = document.createElement('option');
        option.value = statusOptions[j];
        option.textContent = statusOptions[j];
        if (statusOptions[j] === task.status) option.selected = true;
        statusSelect.appendChild(option);
    }
    
    meta.append(due, statusSelect);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.idx = idx;

    card.append(header, desc, meta, deleteBtn);
    return card;
}

function renderTasks() {
    const sectionKeys = Object.keys(sections);
    for (let i = 0; i < sectionKeys.length; i++) {
        const section = sections[sectionKeys[i]];
        while (section.children.length > 1) {
            section.removeChild(section.lastChild);
        }
    }

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const card = createTaskElement(task, i);
        sections[task.status].appendChild(card);
    }
}

function handleStatusChange(e) {
    if (e.target.className === 'status-select') {
        const select = e.target;
        tasks[select.idx].status = select.value;
        Storage.save(tasks);
        renderTasks();
    }
}

function handleTaskAction(e) {
    if (e.target.tagName === 'BUTTON') {
        tasks.splice(e.target.idx, 1);
        Storage.save(tasks);
        renderTasks();
    }
}

taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    tasks.push({
        name: this.taskName.value,
        description: this.taskDescription.value,
        status: this.taskStatus.value,
        priority: this.taskPriority.value,
        dueDate: this.taskDueDate.value
    });
    Storage.save(tasks);
    renderTasks();
    this.reset();
});

const sectionIds = ['todo-tasks', 'inprogress-tasks', 'complete-tasks'];
for (let i = 0; i < sectionIds.length; i++) {
    const section = document.getElementById(sectionIds[i]);
    section.addEventListener('change', handleStatusChange);
    section.addEventListener('click', handleTaskAction);
}

renderTasks();