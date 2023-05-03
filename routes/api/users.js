const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { User, BlacklistedToken } = require('../../models');
const { checkIfAuthenticatedWithJWT } = require('../../middlewares');
const { getHashedPassword } = require('../../utilities');
const dataLayer = require('../../dal/users');
const async = require('hbs/lib/async');

// customize the strength requirements of the .isStrongPassword() method
const passwordOptions = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
};

// Generate a random token secret
// Check if the token secret is defined in the environment variables
if (!process.env.TOKEN_SECRET) {
    // Generate a random token secret
    const tokenSecret = crypto.randomBytes(32).toString('hex');
    // Store the token secret in an environment variable
    process.env.TOKEN_SECRET = tokenSecret;
}

if (!process.env.REFRESH_TOKEN_SECRET) {
    // Generate a random token secret
    const refreshTokenSecret = crypto.randomBytes(32).toString('hex');
    // Store the token secret in an environment variable
    process.env.REFRESH_TOKEN_SECRET = refreshTokenSecret;
}
// generic generate token function for both access token and refresh token
const generateToken = (user, secret, expiresIn) => {
    return jwt.sign({
        'username': user.username,
        'id': user.id,
        'email': user.email
    }, secret, {
        expiresIn
    })
}


// --- signup ---
router.post('/signup', async (req, res) => {

    try {

        const { first_name, last_name, username, email, password, contact_number } = req.body;

        console.log("req.body-->",req.body);

        if (!validator.isLength(first_name, { min: 1, max: 100 })) {
            return res.status(400).json({ error: 'First Name must be between 1 and 100 characters long' });
        }

        if (!validator.isLength(last_name, { min: 1, max: 100 })) {
            return res.status(400).json({ error: 'Last Name must be between 1 and 100 characters long' });
        }

        const existingUsername = await dataLayer.usernameTaken(req.body.username);
        if (existingUsername) {
            return res.status(400).json({ error: 'username already exists' });
        }
        if (!validator.isLength(username, { min: 1, max: 100 })) {
            return res.status(400).json({ error: 'Username must be between 1 and 100 characters long' });
        }

        const existingEmail = await dataLayer.emailTaken(req.body.email);;
        if (existingEmail) {
            return res.status(400).json({ error: 'email already exists' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        if (!validator.isStrongPassword(password, passwordOptions)) {
            return res.status(400).json({ error: 'Password must have at least 8 characters, one uppercase letter, one lowercase letter, one number, and one symbol' });
        }

        if (!validator.isMobilePhone(contact_number, undefined)) {
            return res.status(400).json({ error: 'Invalid phone number' });
        }

        // Create new Customer user
        try {
            const user = await dataLayer.createNewUser(req.body, 'customer' );
            res.status(201).json({ user: user });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }

})


// --- login ---
router.post('/login', async (req, res) => {
    // fetch the user
    const user = await User.where({
        'email': req.body.email
    }).fetch({
        require: false
    });

    if (user && user.get('password') === getHashedPassword(req.body.password)) {
        // generate the JWT
        const accessToken = generateToken(user.toJSON(), process.env.TOKEN_SECRET, "10m");
        const refreshToken = generateToken(user.toJSON(), process.env.REFRESH_TOKEN_SECRET, '3w');
        res.json({
            accessToken, refreshToken
        })
    } else {
        res.status(403);
        res.json({
            'message': 'Invalid credentials'
        })
    }
})

router.post('/refresh', async (req, res) => {
    // we assume the refresh token is to be in the body
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401);
    } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function (err, user) {
            if (err) {
                res.status(401);
                res.json({
                    'message': "No refresh token found"
                })
            } else {

                // check if the refresh token has been blacklisted
                const blacklistedToken = BlacklistedToken.where({
                    'token': refreshToken
                }).fetch({
                    require: false
                })

                if (blacklistedToken) {
                    res.status(403);
                    res.json({
                        'message': "The refresh token has been blacklisted"
                    });

                } else {
                    const accessToken = generateToken(user, process.env.TOKEN_SECRET, "10m");
                    res.json({
                        accessToken
                    });
                }


            }
        })
    }
})

router.post('/logout', async (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401)
    } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err) {
                res.sendStatus(401)
            } else {
                const blacklistedToken = new BlacklistedToken();
                blacklistedToken.set('token', refreshToken);
                blacklistedToken.save();
                res.json({
                    'message': 'Logged Out'
                })
            }
        })
    }
})

router.get('/profile', checkIfAuthenticatedWithJWT, function (req, res) {
    
    res.json({
        'user': req.user
    })

})


module.exports = router;