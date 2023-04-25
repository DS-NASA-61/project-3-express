// import in caolan forms
const forms = require("forms");
// create some shortcuts
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;
//import validatorjs
const validator = require('validator')

var bootstrapField = function (name, object, colSize = 'col-md-6') {
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
    return `<div class="${colSize} mb-3">${label}${widget}${error}</div>`;
};

const wrapForm = (form) => {
    return `
      <div class="row">
        ${form.toHTML((name, object) => bootstrapField(name, object))}
      </div>
    `;
};

const createProductForm =
    (
        categories = [], 
        flavor_profiles = [], 
        brands = [], 
        countries = [], 
        regions = [],
        distilleries = [],
        packages = [],
        ) => {

        // the only arugment to forms.create is an object
        // each key defines one field in the form (one input element)
        // the value describes the form element
        return forms.create({
            "brand_id": fields.string({
                label: 'Brand',
                required: true,
                errorAfterField: true,
                widget: widgets.select(),
                choices: brands
            }),
            "name": fields.string({
                required: true,
                errorAfterField: true,
            }),
            "country_id": fields.string({
                label: 'Country',
                required: true,
                errorAfterField: true,
                widget: widgets.select({}),
                choices: countries,
            }),
            "region_id": fields.string({
                label: 'Region',
                required: false,
                errorAfterField: true,
                widget: widgets.select({}),
                choices: regions,
            }),
            "category_id": fields.string({
                label: 'Category',
                required: true,
                errorAfterField: true,
                widget: widgets.select(),
                choices: categories
            }),
            "distillery_id": fields.string({
                label: 'Distillery',
                required: false,
                errorAfterField: true,
                widget: widgets.select({}),
                choices: distilleries,
            }),

            "age": fields.number({
                required: true,
                errorAfterField: true,
                validators: [validators.integer()]
            }),
            "cost": fields.number({
                required: true,
                errorAfterField: true,
                validators: [validators.integer()]
            }),
            "strength": fields.number({
                required: true,
                errorAfterField: true,
                validators: [function (form, field, callback) {
                    if (!validator.isDecimal(String(field.data))) {
                        return callback('Strength must be a decimal number.');
                    }
                    callback();
                }]
            }),
            "volume": fields.number({
                required: true,
                errorAfterField: true,
                validators: [validators.integer()]
            }),
            "package_id": fields.string({
                label: 'Package',
                required: false,
                errorAfterField: true,
                widget: widgets.select({}),
                choices: packages,
            }),

            "stock": fields.number({
                required: true,
                errorAfterField: true,
                validators: [validators.integer()]
            }),
    
            "flavor_profiles": fields.string({
                label: 'Flavor_Profile',
                required: true,
                errorAfterField: true,
                widget: widgets.multipleSelect(),
                choices: flavor_profiles
            }),

            "description": fields.string({
                required: true,
                errorAfterField: true,
                widget: forms.widgets.textarea()
            }),
            "image_url": fields.string({
                'widget': widgets.hidden()
            })

        })
    }

const createRegistrationForm = () => {
    return forms.create({
        'first_name': fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.maxlength(45)]
        }),
        'last_name': fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.maxlength(45)]
        }),
        'email': fields.email({
            required: true,
            errorAfterField: true,
            validators: [validators.email()]
        }),
        'username': fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.maxlength(20)]
        }),
        'password': fields.password({
            required: validators.required('You definitely want a password'),
            errorAfterField: true,
            validators: [validators.maxlength(100)]
        }),
        'confirm_password': fields.password({
            label: 'Confirm your password',
            required: validators.required('Please enter your password again'),
            validators: [validators.matchField('password')]
        }),
        'contact_number': fields.string({
            required: false,
            errorAfterField: true,
        }),
    })
}

const createLoginForm = () => {
    return forms.create({
        'email': fields.email({
            required: true,
            errorAfterField: true,
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true,
        })
    })
}

module.exports =
{
    wrapForm,
    bootstrapField,
    createProductForm,
    createRegistrationForm,
    createLoginForm
}

