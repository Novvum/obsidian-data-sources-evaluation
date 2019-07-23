import Base, { IdDataLoader } from "./Base";

export default class BooksDataSource extends Base {
  constructor() {
    super();
  }
  booksDataLoader = new IdDataLoader(console.log);
}
