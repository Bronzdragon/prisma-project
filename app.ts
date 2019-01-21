import * as fs from "fs";
import Field_Types, { getFieldType } from "./scalar_fields";

const filename = process.argv[2] || "./datamodel.prisma";
fs.readFile(filename, "utf8", function(err :any , data: string): void {
  if (err) { throw err; }

  let schema: Schema = new Schema(data);

  console.log(`${schema}`);
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
    let types = []
    let type_info;
    while(type_info = type_regex.exec(datamodel_text)) {
      const [ , type_name, type_body] = type_info;
      types.push({name: type_name, body: type_body});
    }

    for (const type of types) {
      this.types.push(new Type(
        type.name,
        type.body,
        types.map(el => el.name),     // Type list
        this.enums.map(el => el.name) // Enum list
      ));
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
${this.types.map(curr => 
`  ${curr.getQuery(true)}
  ${curr.getQuery(false)}`
).join("\n")}
}\n\n`);

    // Adds our type definitions.
    result += this.types
      .map(type => type.toString())
      .join("\n\n");

    return result;
  }
}

class Type {
  public readonly name: string;
  private readonly properties: Array<Property>;

  constructor(name: string, body: string, type_list = [], enum_list = []) {
    this.name = name;
    const regex: RegExp = /(\w+)\s*:\s*(\S.*\S)\s*/gm;

    this.properties = [];

    let prop:Array<string>;
    while(prop = regex.exec(body)) {
      this.properties.push(new Property(prop[1], prop[2], type_list, enum_list));
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

  public getQuery(single: boolean = true): string {
    if (single) {
      return `${this.name}: ${this.name}!`;
    }
    const args = [
      {name: "first", type: "int"},
      {name: "last", type: "int"},
      {name: "skip", type: "int"}
    ];

    //users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
    const args_string = args.length > 0 ? `(${args.map(arg => `${arg.name}: ${arg.type}`).join(", ")})` : "";

    return `${this.name}${args_string}: [${this.name}!]!`;;
  }
}

class Property {
  public readonly name: string;
  public readonly type: Field_Types;

  constructor(name: string, body: string, type_list = [], enum_list = []) {
    this.name = name;
    this.type = getFieldType(body, type_list, enum_list);
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