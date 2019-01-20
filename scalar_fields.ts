type Field_Types = ID_Field | Boolean_Field | Int_Field | Float_Field | String_Field | DateTime_Field | Long_Field | List_Field | JSON_Field | Other_Field;
export default Field_Types;

export function getFieldType(body: string): Field_Types {
  
  const list_test = /^\s*\[\s*(\w+\s*!?)\s*\](!?.*)$/;
  let result: Array<string>;
  if (result = body.match(list_test)){
    let list_type = getFieldType(result[1]);
    const {is_required, is_unique, default_value: value} = parseTypeArguments(result[2]);
    return new List_Field(list_type, is_required, is_unique, value);
  }
  
  const regex = /^\s*(\w+)(!?.*)$/;
  const [, type, args] = body.match(regex).map(str => str.trim());
  
  const {is_required, is_unique, default_value: value} = parseTypeArguments(args);
  
  switch (type.toLowerCase()) {
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
    
    case "long":
      return new Long_Field(is_required, is_unique, value);
    
    case "json":
      return new JSON_Field(is_required, is_unique, value);
    
    case "id":
      return new ID_Field(is_required, is_unique, value);
    
    default:
      return new Other_Field(type, is_required, is_unique, value);
      break;
  }
}

function parseTypeArguments(raw: string): args {
  const is_required: boolean = /^!/.test(raw);
  const is_unique: boolean = /@unique/.test(raw);
  let value: string, result: Array<string>;
  if (result = raw.match(/@default\s*\(\s*value\s*:\s*"(.*?)"\s*\)/)) {
    value = result[1];
  }

  return ({
    is_required: is_required,
    is_unique: is_unique,
    default_value: value
  });
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
    // if (this.is_unique) { result += ' @unique'}
    // if (this.has_default) { result += ` @default(value: "${this.default_value}")`}
    
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

export class Long_Field extends Generic_Field {
  protected readonly TYPENAME = "Long";
}

export class List_Field extends Generic_Field {
  protected readonly TYPENAME = "Array";
  private list_type: Field_Types;

  constructor(list_type: Field_Types, is_required = false, is_unique = false, default_value?: any){
    super(is_required, is_unique, default_value)
    
    this.list_type = list_type;
  }
  
  public toString(): string {
    return `[${this.list_type}]${this.is_required ? '!':''}`;
  }
}

export class JSON_Field extends Generic_Field {
  protected readonly TYPENAME = "JSON";
}

export class Other_Field extends Generic_Field {
  protected readonly TYPENAME;

  constructor(type_name: string, is_required = false, is_unique = false, default_value?: any){
    super(is_required, is_unique, default_value);
    this.TYPENAME = type_name;
  }
}