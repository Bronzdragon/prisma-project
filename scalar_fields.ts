type Field_Types = ID_Field | Boolean_Field | Int_Field | Float_Field | String_Field | DateTime_Field | Array_Field | Object_Field;
export default Field_Types;

class Generic_Field {
    protected has_default: boolean = false;
    protected default_value: any;
    protected is_unique: boolean = false;
    protected is_required: boolean = false;

    protected readonly TYPENAME;

    constructor(parameters) {
        
    }

    public toString(): string {
        return `${this.TYPENAME}`;
    }
}

export class ID_Field extends Generic_Field {
    public readonly TYPENAME = "ID";

    constructor(parameters){
        super(parameters);
    }
}

export class Boolean_Field extends Generic_Field {
    protected readonly TYPENAME = "Boolean";

    constructor(parameters){
        super(parameters);
    }
}

export class Int_Field extends Generic_Field {
    protected readonly TYPENAME = "int";
    
    constructor(parameters){
        super(parameters);
    }
}

export class Float_Field extends Generic_Field {
    protected readonly TYPENAME = "Float";
    
    constructor(parameters){
        super(parameters);
    }
}

export class String_Field extends Generic_Field {
    protected readonly TYPENAME = "String";
    
    constructor(parameters){
        super(parameters);
    }
}

export class DateTime_Field extends Generic_Field {
    protected readonly TYPENAME = "DateTime";
    
    constructor(parameters){
        super(parameters);
    }
}

export class Array_Field extends Generic_Field {
    protected readonly TYPENAME = "Array";
    private array_type: Field_Types;

    constructor(parameters){
        super(parameters);
    }

    public toString(): string {
        return `[${this.array_type.toString()}]${this.is_required ? '!':''}`;
    }
}

export class Object_Field extends Generic_Field {
    protected readonly TYPENAME = "Object";
    
    constructor(parameters){
        super(parameters);
    }
}