import { graphql, buildSchema, printSchema } from "graphql";
// import  model from "datamodel";
import * as fs from "fs";

// const fs = require('fs'), filename = process.argv[2];
fs.readFile("./datamodel.prisma", "utf8", function(err :any , data: string): void {
  if (err) { throw err; }
  console.log(data);
  let schema: Schema = new Schema(data);
});

class Schema {
  constructor(baseText: string) {
    // do stuff
  }
}
