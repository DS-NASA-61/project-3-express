const express = require('express');
const { createLoginForm, bootstrapField } = require('../forms');
const router = express.Router();

router.get('/login', function(req,res){
    const form = createLoginForm();
    res.render("users/login",{
        'form': form.toHTML(bootstrapField)
    });
})

// router.post("/login",(req,res) => {
//     const form = createLoginForm();

//     form.handle(req,{
//         'success':
//     })
// })


module.exports = router;