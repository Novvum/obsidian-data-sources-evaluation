import { RESTDataSource } from "apollo-datasource-rest";
const uuid = require("uuid/v1");

export default class BaseDataSource extends RESTDataSource {
  id: number;
  constructor() {
    super();
    this.baseURL = "https://movies-api.example.com/";
    this.id = uuid();
  }
}
