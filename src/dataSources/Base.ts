import { RESTDataSource } from "apollo-datasource-rest";
const DataLoader = require("dataloader");

const uuid = require("uuid/v1");

export default class BaseDataSource extends RESTDataSource {
  id: number;
  constructor() {
    super();
    this.baseURL = "https://movies-api.example.com/";
    this.id = uuid();
  }
  dataLoader = new IdDataLoader(console.log);
}

export class IdDataLoader extends DataLoader {
  id: number;
  constructor(...args) {
    super(...args);
    this.id = uuid();
  }
}
