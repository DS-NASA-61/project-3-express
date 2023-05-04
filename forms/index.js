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
            "cask_type": fields.string({
                required: false,
                errorAfterField: true,
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
                'widget': widgets.hidden(),
            }),
            "thumbnail_url": fields.string({
                'widget': widgets.hidden(),

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

const createSearchForm = (
    categories = [],
    flavor_profiles = [],
    brands = [],
    countries = [],
    regions = [],
    distilleries = []
) => {
    return forms.create({
        "brand_id": fields.string({
            label: 'Brand',
            required: true,
            widget: widgets.select(),
            choices: brands
        }),
        "name": fields.string({
            required: false,
            errorAfterField: true,
        }),
        "country_id": fields.string({
            label: 'Country',
            required: true,
            widget: widgets.select({}),
            choices: countries,
        }),
        "region_id": fields.string({
            label: 'Region',
            required: false,
            widget: widgets.select({}),
            choices: regions,
        }),
        "category_id": fields.string({
            label: 'Category',
            required: true,
            widget: widgets.select(),
            choices: categories
        }),
        "cask_type": fields.string({
            required: false,
            errorAfterField: true,
        }),
        "distillery_id": fields.string({
            label: 'Distillery',
            required: false,
            widget: widgets.select({}),
            choices: distilleries,
        }),
        'min_age': fields.string({
            required: false,
            errorAfterField: true,
            validators: [validators.integer()]
        }),
        'max_age': fields.string({
            required: false,
            errorAfterField: true,
            validators: [validators.integer()]
        }),
        'min_cost': fields.string({
            required: false,
            errorAfterField: true,
            validators: [validators.integer()]
        }),
        'max_cost': fields.string({
            required: false,
            errorAfterField: true,
            validators: [validators.integer()]
        }),
        'min_strength': fields.string({
            required: false,
            errorAfterField: true,
            validators: [validators.integer()]
        }),
        'max_strength': fields.string({
            required: false,
            errorAfterField: true,
            validators: [validators.integer()]
        }),
        "flavor_profiles": fields.string({
            label: 'Flavor_Profile',
            required: false,
            widget: widgets.multipleSelect(),
            choices: flavor_profiles
        }),

    })
}


const createOrderForm = (orderStatuses = []) => {
    return forms.create({
        'order_status_id': fields.string({
            label: 'Order status',
            required: true,
            errorAfterField: true,
            choices: orderStatuses,
            widget: widgets.select(),
        }),
        'order_date': fields.date({
            widget: widgets.hidden()
        }),
        'shipping_address_line1': fields.string({
            label: "Shipping Address Line1",
            required: true,
            errorAfterField: true,
        }),
        'shipping_address_postal': fields.string({
            label: "Shipping Address Line2",
            required: true,
            errorAfterField: true,
        }),
        'shipping_postal_code': fields.string({
            label: "Postal Code",
            required: false,
            errorAfterField: true,
        }),
        'delivery_date': fields.date({
            required: false,
            errorAfterField: true,
            widget: widgets.date(),
            validators: [
                function (form, field, callback) {
                    if (form.data.delivery_date && field.data < form.data.order_date) {
                        callback(
                            `Please enter a date after order date ${form.data.order_date}`
                        );
                    } else {
                        callback();
                    }
                }
            ]
        })
    });
}

const createOrderSearchForm = (orderStatuses = []) => {
    return forms.create({
        'order_id': fields.string({
            required: false,
            errorAfterField: true
        }),
        'username': fields.string({
            required: false,
            errorAfterField: true,
        }),
        'user_email': fields.string({
            required: false,
            errorAfterField: true,
        }),
        'order_date_from': fields.date({
            required: false,
            errorAfterField: true,
            widget: widgets.date(),
            validators: [
                function (form, field, callback) {
                    if (form.data.order_date_to && field.data > form.data.order_date_to) {
                        callback(
                            'Please enter a date before "order date to"'
                        );
                    } else {
                        callback();
                    }
                }
            ]
        }),
        'order_date_to': fields.date({
            required: false,
            errorAfterField: true,
            widget: widgets.date(),
            validators: [
                function (form, field, callback) {
                    if (form.data.order_date_from && field.data < form.data.order_date_from) {
                        callback(
                            'Please enter date after "order date from"'
                        );
                    } else {
                        callback();
                    }
                }
            ]
        }),
        'order_status_id': fields.string({
            label: 'Order status',
            required: false,
            errorAfterField: true,
            widget: widgets.select(),
            choices: orderStatuses
        }),
    });
}



module.exports =
{
    wrapForm,
    bootstrapField,
    createProductForm,
    createRegistrationForm,
    createLoginForm,
    createSearchForm,
    createOrderForm,
    createOrderSearchForm
}

