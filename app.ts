import { graphql, buildSchema, printSchema } from "graphql";
// import  model from "datamodel";
import * as fs from "fs";

// const fs = require('fs'), filename = process.argv[2];
fs.readFile("./datamodel.prisma", "utf8", function(err :any , data: string): void {
  if (err) { throw err; }
  // console.log(data);

  let schema: Schema = new Schema(data);

});

class Schema {
  private models : Array<Model>;

  constructor(datamodel_text: string) {
    const regex: RegExp = /type\s*(\w+)\s*\{([\s\S]+?)\}/gm;


    let type: Array<string>;
    while(type = regex.exec(datamodel_text)) {
      this.models.push(new Model(type[1], type[2]));

      console.log("Entry: ");
      console.log(`Name: ${type[1]}\nBody:\n${type[2]}`);
    }

  }
}

class Model {
  public readonly name: string;
  constructor(name: string, body: string) {
    this.name = name;
  }
}