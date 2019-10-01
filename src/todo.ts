export class TodoItem {
  constructor(
    public id: number,
    public task: string,
    public complete: boolean = false
  ) {}

  printDetails(): void {
    console.log(`${this.id}\n${this.task} \n ${this.complete}
    `);
  }
}
