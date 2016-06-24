import EmbeddedListField from 'admin-config/lib/Field/EmbeddedListField';

class StamplayArrayStrField extends EmbeddedListField {

    constructor(name) {
        super(name);
        this._jsonParse = false;
        this._type = "stamplay_array_str";
        this._fieldValueStyles = null;
    }

    // attempt to convert all strings to objects, true or false
    jsonParse(trueFalse) {
        if (!arguments.length) return this._jsonParse;
        this._jsonParse = trueFalse;
        return this;
    }

    // add css attribs based on an object key/value
    // .fieldValueStyles('[{fieldName:FIELDNAME, value:VALUE, cssClass:CSS-CLASS-NAME}]')
    fieldValueStyles(objStringified){
        if (!arguments.length) return this._fieldValueStyles;
        this._fieldValueStyles = objStringified;
        return this;
    }

}

export default StamplayArrayStrField;