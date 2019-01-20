import { graphql, buildSchema, printSchema } from "graphql";
// import  model from "datamodel";
import * as fs from "fs";
import Field_Types, { getFieldType } from "./scalar_fields";

// const fs = require('fs'), filename = process.argv[2];
fs.readFile("./datamodel.prisma", "utf8", function(err :any , data: string): void {
  if (err) { throw err; }

  // console.log(text);

  let schema: Schema = new Schema(data);

  console.log(`--Result--\n${schema}`);

});

class Schema {
  private readonly types: Array<Type> = [];
  private readonly enums: Array<Enum> = [];

  constructor(datamodel_text: string) {
    const type_regex: RegExp = /type\s*(\w+)\s*\{([\s\S]+?)\}/gm;
    const enum_regex: RegExp = /enum\s*(\w+)\s*\{([\s\S]+?)\}/gm;

    // Collect enums
    let enum_info
    while(enum_info = enum_regex.exec(datamodel_text)) {
      let [ , enum_name, enum_body] = enum_info;
      this.enums.push(new Enum(enum_name, enum_body));
    }

    // Collect types
    let type_info;
    while(type_info = type_regex.exec(datamodel_text)) {
      const [ , type_name, type_body] = type_info;
      this.types.push(new Type(type_name, type_body));
    }
  }

  public toString(): string {
    let result: string = "";

    // Adds meta data
    result += `# timestamp: ${new Date().toString()}\n\n`;

    // Adds additional scalars we support
    const custom_scalars = ['DateTime', 'Long'];
    result += custom_scalars
      .map(scalar => `scalar ${scalar}`)
      .join("\n\n") + "\n\n";

    // Adds the Enums
    result += this.enums.join("\n\n") + "\n\n";

    // Adds the query block
    result += (
`type query {
${this.types.reduce((acc, curr) => [
  ...acc,
  `  ${curr.name}: ${curr.name}!`,
  `  ${curr.name}: [${curr.name}!]!`
], []).join("\n")}
}

`);

    // Adds additional scalars we support
    result += this.types
      .map(type => type.toString())
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
    return (
`type ${this.name}: {
${this.properties
  .map(prop => `  ${prop}`)
  .join("\n")}
}`);
  }
}

class Property {
  public readonly name: string;
  public readonly type: Field_Types;

  constructor(name: string, body: string) {
    this.name = name;
    this.type = getFieldType(body);
  }

  public toString(): string {
    return ( `${this.name}: ${this.type}`);
  }
}

class Enum {
  public readonly name: string;
  public readonly values: Array<string>;

  constructor(name: string, body: string) {
    this.name = name;

    // Valid enum entries can only contain letters, numbers and underscores. They also must start with an uppercase letter.
    this.values = body
      .split(/\s+/)
      .map(entry => entry.trim())
      .filter(entry => /^[A-Z][\w_]*$/.test(entry));
  }

  public toString(): string {
    return (
`enum ${this.name} {
${this.values
  .map(val => `  ${val.toUpperCase()}`)
  .join("\n")}
}`
    );
  }
}