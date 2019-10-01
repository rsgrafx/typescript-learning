"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const todo_1 = require("./todo");
const collection_1 = require("./collection");
const inquirer = require("inquirer");
let todos = [
    new todo_1.TodoItem(1, 'Buy Flowers'),
    new todo_1.TodoItem(2, 'Get Shoes'),
    new todo_1.TodoItem(3, 'Collect Tickets'),
    new todo_1.TodoItem(4, 'Call Joe', true)
];
let collection = new collection_1.Collection('Adam', todos);
console.clear();
console.log(`${collection.userName}'s Todo List`);
let newId = collection.addTodo('Go for run');
let todoItem = collection.getTodoById(newId);
let showCompleted = true;
console.log(JSON.stringify(todoItem));
console.log('CURRENT ITEMS');
console.log(JSON.stringify(collection.showAll()));
collection.getTodoItems(showCompleted).forEach(item => item.printDetails());
function displayTodoList() {
    console.log(`${collection.userName}'s Todo List`) +
        `(${collection.getItemCounts().incomplete}) items to do`;
    collection.getTodoItems(showCompleted).forEach(item => item.printDetails());
}
var Commands;
(function (Commands) {
    Commands["Add"] = "Add new Task";
    Commands["Quit"] = "Quit";
    Commands["Greet"] = "Greet";
    Commands["Toggle"] = "Show/Hide Completed";
    Commands["Complete"] = "Mark Task Completed";
})(Commands || (Commands = {}));
function promptComplete() {
    console.clear();
    inquirer
        .prompt({
        type: 'checkbox',
        name: 'complete',
        message: 'Mark Tasks Complete',
        choices: collection.getTodoItems(showCompleted).map(item => ({
            name: item.task,
            value: item.id,
            checked: item.complete
        }))
    })
        .then(answers => {
        let completedTasks = answers['complete'];
        collection
            .getTodoItems(true)
            .forEach(item => collection.markComplete(item.id, completedTasks.find(id => id === item.id) != undefined));
        promptUser();
    });
}
function promptCompleted() {
    console.clear();
    inquirer
        .prompt({
        type: 'checkbox',
        name: 'complete',
        message: 'Mark Tasks Complete',
        choices: collection.getTodoItems(showCompleted).map(todo => ({
            name: todo.task,
            value: todo.id,
            checked: todo.complete
        }))
    })
        .then(answers => {
        let completedTasks = answers['complete'];
        collection
            .getTodoItems(true)
            .forEach(item => collection.markComplete(item.id, completedTasks.find(id => item.id === id) !== undefined));
        promptUser();
    });
}
function promptAdd() {
    console.clear();
    inquirer
        .prompt({ type: 'input', name: 'add', message: 'Enter Task: \n' })
        .then(answers => {
        if (answers['add'] !== '') {
            collection.addTodo(answers['add']);
        }
        promptUser();
    });
}
function promptUser() {
    console.clear();
    displayTodoList();
    inquirer
        .prompt({
        type: 'list',
        name: 'command',
        message: 'choose option',
        choices: Object.values(Commands)
    })
        .then(answers => {
        switch (answers['command']) {
            case Commands.Toggle:
                showCompleted = !showCompleted;
                promptUser();
                break;
            case Commands.Add:
                promptAdd();
                break;
            case Commands.Complete:
                if (collection.getItemCounts().incomplete > 0) {
                    promptComplete();
                }
                else {
                    promptUser();
                }
                break;
        }
    });
}
promptUser();
