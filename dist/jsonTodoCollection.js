"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const todo_1 = require("./todo");
const collection_1 = require("./collection");
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
class JsonTodoCollection extends collection_1.Collection {
    constructor(userName, todoItems = []) {
        super(userName, []);
        this.userName = userName;
        this.database = lowdb(new FileSync('Todos.json'));
        if (this.database.has('tasks').value()) {
            let dbItems = this.database.get('tasks').value();
            dbItems.forEach(item => {
                return this.itemMap.set(item.id, new todo_1.TodoItem(item.id, item.task, item.complete));
            });
        }
        else {
            this.database.set('tasks', todoItems).write();
            todoItems.forEach(element => this.itemMap.set(element.id, element));
        }
    }
    addTodo(task) {
        let result = super.addTodo(task);
        this.storeTasks();
        return result;
    }
    markComplete(id, complete) {
        super.markComplete(id, complete);
        this.storeTasks();
    }
    removeComplete() {
        super.removeComplete();
        this.storeTasks();
    }
    storeTasks() {
        this.database.set('tasks', [...this.itemMap.values()]).write();
    }
}
exports.JsonTodoCollection = JsonTodoCollection;
