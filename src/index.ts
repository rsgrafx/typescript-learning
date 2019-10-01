import { TodoItem } from './todo';
import { Collection } from './collection';
import * as inquirer from 'inquirer';

let todos = [
  new TodoItem(1, 'Buy Flowers'),
  new TodoItem(2, 'Get Shoes'),
  new TodoItem(3, 'Collect Tickets'),
  new TodoItem(4, 'Call Joe', true)
];
let collection = new Collection('Adam', todos);

console.clear();
console.log(`${collection.userName}'s Todo List`);
let newId = collection.addTodo('Go for run');
let todoItem = collection.getTodoById(newId);
let showCompleted = true;

console.log(JSON.stringify(todoItem));
console.log('CURRENT ITEMS');
console.log(JSON.stringify(collection.showAll()));

collection.getTodoItems(showCompleted).forEach(item => item.printDetails());

function displayTodoList(): void {
  console.log(`${collection.userName}'s Todo List`) +
    `(${collection.getItemCounts().incomplete}) items to do`;
  collection.getTodoItems(showCompleted).forEach(item => item.printDetails());
}
enum Commands {
  Add = 'Add new Task',
  Quit = 'Quit',
  Greet = 'Greet',
  Toggle = 'Show/Hide Completed',
  Complete = 'Mark Task Completed'
}

function promptComplete(): void {
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
      let completedTasks = answers['complete'] as number[];
      collection
        .getTodoItems(true)
        .forEach(item =>
          collection.markComplete(
            item.id,
            completedTasks.find(id => id === item.id) != undefined
          )
        );
      promptUser();
    });
}

function promptCompleted(): void {
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
      let completedTasks = answers['complete'] as number[];
      collection
        .getTodoItems(true)
        .forEach(item =>
          collection.markComplete(
            item.id,
            completedTasks.find(id => item.id === id) !== undefined
          )
        );
      promptUser();
    });
}

function promptAdd(): void {
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

function promptUser(): void {
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
          } else {
            promptUser();
          }
          break;
      }
    });
}

promptUser();
