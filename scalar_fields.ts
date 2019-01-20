type Field_Types = ID_Field | Boolean_Field | Int_Field | Float_Field | String_Field | DateTime_Field | Array_Field | Object_Field;
export default Field_Types;

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

    static from_string(body: string): List_Field {
        
        return new List_Field();
    }
}

export class Object_Field extends Generic_Field {
    protected readonly TYPENAME = "Object";
}