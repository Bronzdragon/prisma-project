type Field_Types = ID_Field | Boolean_Field | Int_Field | Float_Field | String_Field | DateTime_Field | List_Field | JSON_Field | ENUM_Field | Object_Field;
export default Field_Types;

export function getFieldType(body: string): Field_Types {
  
  const list_test = /^\s*\[\s*\w+\s*!?\s*\](!?.*)$/;
  if (list_test.test(body)){
    
    return List_Field.fromString(body);;
  }
  
  const regex = /^\s*(\w+)(!?.*)$/;
  const [, type, args] = body.match(regex).map(str => str.toLowerCase().trim());
  
  const is_required: boolean = /^!/.test(args);
  const is_unique: boolean = /@unique/.test(args);
  let value: string, result: Array<string>;
  if (result = args.match(/@default\s*\(\s*value\s*:\s*"(.*?)"\s*\)/)) {
    value = result[1];
  }
  
  // console.log("Creating new type! " + type);
  
  
  switch (type) {
    case "string":
    return new String_Field(is_required, is_unique, value);
    
    case "int":
    return new Int_Field(is_required, is_unique, value);
    
    case "float":
    return new Float_Field(is_required, is_unique, value);
    
    case "boolean":
    return new Boolean_Field(is_required, is_unique, value);
    
    case "datetime":
    return new DateTime_Field(is_required, is_unique, value);
    
    case "json":
    return new JSON_Field(is_required, is_unique, value);
    
    case "id":
    return new ID_Field(is_required, is_unique, value);
    
    default:
    // Can be enum/object.
    break;
  }
}


interface args {
  is_required: boolean;
  is_unique: boolean;
  default_value?: any;
}

abstract class Generic_Field {
  protected has_default: boolean = false;
  protected default_value: any;
  protected is_unique: boolean = false;
  protected is_required: boolean = false;
  
  protected readonly TYPENAME;
  
  constructor(is_required = false, is_unique = false, default_value?: any) {
    this.is_required = is_required;
    this.is_unique = is_unique;
    
    this.default_value = default_value;
    this.has_default = (default_value !== undefined);
  }
  
  public toString(): string {
    let result = "";
    result += this.TYPENAME;
    if (this.is_required) { result += '!'; }
    if (this.is_unique) { result += ' @unique'}
    if (this.has_default) { result += ` @default(value: "${this.default_value}")`}
    
    return result;
  }
}

export class ID_Field extends Generic_Field {
  public readonly TYPENAME = "ID";
}

export class Boolean_Field extends Generic_Field {
  protected readonly TYPENAME = "Boolean";
}

export class Int_Field extends Generic_Field {
  protected readonly TYPENAME = "int";
}

export class Float_Field extends Generic_Field {
  protected readonly TYPENAME = "Float";
}

export class String_Field extends Generic_Field {
  protected readonly TYPENAME = "String";
}

export class DateTime_Field extends Generic_Field {
  protected readonly TYPENAME = "DateTime";
}

export class List_Field extends Generic_Field {
  protected readonly TYPENAME = "Array";
  private list_type: Field_Types;
  
  public toString(): string {
    return `[${this.list_type}]${this.is_required ? '!':''}`;
  }
  
  static fromString(body: string): List_Field {
    
    console.log(body);
    
    return new List_Field();
  }
}

export class JSON_Field extends Generic_Field {
  protected readonly TYPENAME = "JSON";
}

export class ENUM_Field extends Generic_Field {
  protected readonly TYPENAME = "ENUM";
}

export class Object_Field extends Generic_Field {
  protected readonly TYPENAME = "Object";
}