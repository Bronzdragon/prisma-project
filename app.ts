import { graphql, buildSchema, printSchema } from "graphql";
// import  model from "datamodel";
import * as fs from "fs";
import Field_Types, {
  ID_Field,
  Boolean_Field,
  Int_Field, Float_Field,
  String_Field,
  DateTime_Field,
  List_Field,
  Object_Field
} from "./scalar_fields";

// const fs = require('fs'), filename = process.argv[2];
fs.readFile("./datamodel.prisma", "utf8", function(err :any , data: string): void {
  if (err) { throw err; }

  // console.log(text);

  let schema: Schema = new Schema(data);

  console.log(`--Result--\n${schema}`);

});

class Schema {
  private readonly types : Array<Type>;

  constructor(datamodel_text: string) {
    const type_regex: RegExp = /type\s*(\w+)\s*\{([\s\S]+?)\}/gm;
    this.types = [];


    // Collect types
    let type_name: string, type_body: string;
    while([ , type_name, type_body] = type_regex.exec(datamodel_text)) {
      this.types.push(new Type(type_name, type_body));
    }
  }

  public toString(): string {
    let result: string = "";
    result += `# timestamp: ${new Date().toString()}\n\n`;

    result += this.types
      .map(model => model.toString())
      .join("\n\n");

    return result;
  }
}

class Type {
  public readonly name: string;
  private readonly properties: Array<Property>;

  constructor(name: string, body: string) {
    this.name = name;
    const regex: RegExp = /(\w+)\s*:\s*(\S.*\S)\s*/gm;

    this.properties = [];

    let prop:Array<string>;
    while(prop = regex.exec(body)) {
      this.properties.push(new Property(prop[1], prop[2]));
    }
  }

  public toString(): string {
    return `Name: ${this.name}\n`
    + this.properties
      .map(prop => "\t" + prop.toString())
      .join("\n");
  }
}

class Property {
  public readonly name: string;
  public readonly type: Field_Types;

  constructor(name: string, body: string) {
    this.name = name;
    // this.type = body;
  }

  public toString(): string {
    return ( `${this.name} (Type: ${this.type})`);
  }
}

class Enum {
  public readonly name: string;
  public readonly values: Array<string>;

  constructor(name: string, body: string) {
    this.name = name;

    // Valid enum entries can only contain letters, numbers and underscores. They also must start with an uppercase letter.
    this.values = body
      .split(',')
      .map(entry => entry.trim())
      .filter(entry => /^[A-Z][\w_]*$/.test(entry));
  }

  public toString(): string {
    return "TODO";
  }
}