// import in caolan forms
const forms = require("forms");
// create some shortcuts
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;
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

const createProductForm = (categories=[], flavor_profiles=[]) => {
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
        "category_id": fields.string({
            label:'Category',
            required:true,
            errorAfterField:true,
            widget:widgets.select(),
            choices:categories
        }),
        "flavor_profiles":fields.string({
            label:'Flavor_Profile',
            required:true,
            errorAfterField: true,
            widget:widgets.multipleSelect(),
            choices:flavor_profiles
        })
    
    })
}

const createRegistrationForm  = ()=>{
    return forms.create({
        'first_name':fields.string({
            required:true,
            errorAfterField:true,
            validators:[validators.maxlength(45)]
        }),
        'last_name':fields.string({
            required:true,
            errorAfterField:true,
            validators:[validators.maxlength(45)]
        }),
        'email':fields.email({
            required: true,
            errorAfterField: true,
            validators:[validators.email()]
        }),
        'username': fields.string({
            required:true,
            errorAfterField:true,
            validators:[validators.maxlength(20)]
        }),
        'password': fields.password({
            required:validators.required('You definitely want a password'),
            errorAfterField:true,
            validators:[validators.maxlength(100)]
        }),
        'confirm_password':fields.password({
            label: 'Confirm your password',
            required: validators.required('Please enter your password again'),
            validators: [validators.matchField('password')]
        }),
        'contact_number': fields.string({
            required:false,
            errorAfterField:true,
        }),
    })
}

const createLoginForm = () =>{
    return forms.create({
        'email': fields.email({
            required:true,
            errorAfterField:true,
        }),
        'password': fields.password({
            required:true,
            errorAfterField:true,
        })
    })
}

module.exports = { bootstrapField,createProductForm, createRegistrationForm, createLoginForm }

