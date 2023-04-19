// import in caolan forms
const forms = require("forms");
// create some shortcuts
const fields = forms.fields;
const validators = forms.validators;
//import validatorjs
const validator = require ('validator')


var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

const createProductForm = () => {
    // the only arugment to forms.create is an object
    // each key defines one field in the form (one input element)
    // the value describes the form element
    return forms.create({
        
        "name": fields.string({
            required: true,
            errorAfterField: true,
        }),
        "age": fields.number({
            required: true,
            errorAfterField: true,
        }),
        "cost": fields.number({
            required: true,
            errorAfterField: true,
            validators:[validators.integer()]
        }),
        "strength": fields.number({
            required: true,
            errorAfterField: true,
            validators:[function (form, field, callback) {
                if (!validator.isDecimal(String(field.data))) {
                  return callback('Strength must be a decimal number.');
                }
                callback();
              }]
        }),
        "volume": fields.number({
            required: true,
            errorAfterField: true,
            validators:[validators.integer()]
        }),
        "description": fields.string({
            required: true,
            errorAfterField: true,
            widget: forms.widgets.textarea()
        }),
        "stock": fields.number({
            required: true,
            errorAfterField: true,
            validators:[validators.integer()]
        }),
    
    })
}

module.exports = { bootstrapField,createProductForm }

