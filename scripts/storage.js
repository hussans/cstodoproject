export const Storage = {
    save: tasks => localStorage.setItem('tasks', JSON.stringify(tasks)),
    load: () => JSON.parse(localStorage.getItem('tasks')) || []
};

export const taskForm = document.getElementById('taskForm');
export const sections = {
    'ToDo': document.getElementById('todo-tasks'),
    'InProgress': document.getElementById('inprogress-tasks'),
    'Complete': document.getElementById('complete-tasks')
};

export let tasks = Storage.load();