import Field from 'admin-config/lib/Field/Field';

class ObjKeyValueFieldConf extends Field {

    constructor(name) {
        super(name);
        this._type = "obj_key_value_field";
        this._keyValueChoices = null;
    }

    keyValueChoices(keyValueString){
        if (!arguments.length) return this._keyValueChoices;
        this._keyValueChoices = keyValueString;
        return this;
    }

}

export default ObjKeyValueFieldConf;