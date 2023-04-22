const express = require('express');
const { createLoginForm, createRegistrationForm, bootstrapField } = require('../forms');
const { getUserbyEmail, createNewUser, getUserById } = require('../dal/users');
const { getHashedPassword } = require('../utilities');
const { checkIfAuthenticated } = require('../middlewares');
const async = require('hbs/lib/async');
const router = express.Router();



// ---user signup---
router.get('/signup', function (req, res) {
    const form = createRegistrationForm();
    res.render("users/signup", {
        'form': form.toHTML(bootstrapField)
    })
})

router.post('/signup', (req, res) => {
    const form = createRegistrationForm();

    form.handle(req, {
        'success': async function (form) {
            const { confirm_password, ...userData } = form.data;
            const user = await createNewUser(userData);

            req.flash('success', 'Your account has been created!');
            res.redirect('/users/login');
        },
        "empty": async function (form) {
            res.render('users/signup', {
                'form': form.toHTML(bootstrapField)
            })
        },
        'error': async function (form) {
            res.render('users/signup', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

// ---user login---
router.get('/login', function (req, res) {
    const form = createLoginForm();
    res.render("users/login", {
        'form': form.toHTML(bootstrapField)
    });
})

router.post("/login", (req, res) => {
    const form = createLoginForm();

    form.handle(req, {

        //'success' callback to handle a successful form submission, 
        'success': async function (form) {
            // get user by email
            const user = await getUserbyEmail(form.data.email)

            //1. check email
            if (!user) {
                res.status(403);
                req.flash('error_messages', 'Invalid email. Please try again'),
                    res.redirect("/users/login")
            } else {
                // 2. check pw
                if (user.get('password') === getHashedPassword(form.data.password)) {
                    // 3. if all matches, save user info into session
                    req.session.user = {
                        id: user.get('id'),
                        first_named: user.get('first_name'),
                        last_name: user.get('last_name'),
                        email: user.get('email'),
                        username: user.get('username'),
                        contact_number: user.get('contact_number')
                    }
                    req.flash('success', `Welcome back ${user.get('username')}`);
                    res.redirect('/users/profile')
                } else {
                    req.flash('error', 'Unable to authenticate your details'),
                        res.redirect("/users/login")
                }
            }
        },

        'empty': async function (form) {
            res.render('users/login', {
                form: form.toHTML(bootstrapField)
            })
        },

        'error': async function (form) {
            res.render('users/login', {
                form: form.toHTML(bootstrapField)
            })
        }

    })
})

// ---user profile---
router.get('/profile', function (req, res) {
    const user = req.session.user;
    res.render('users/profile', {
        user: user
    })
})

// ---user logout---
router.get('/logout', function (req, res) {

    req.session.user = null;
    req.flash('success', "Bye!");
    res.redirect('/users/login');
})

// ---view all users---
router.get('/view', checkIfAuthenticated, async function (req, res) {
    const userId = req.session.user.id;
    try {
        const user = await getUserById(userId);
        res.render('users/profile',{
            user : user.toJSON(),
        });
    } catch (error) {
        console.log(error);
        req.flash('error_messages', 'An error occurred while retrieving account information. Please try again');
        res.redirect('/users/view');
    }
})


module.exports = router;