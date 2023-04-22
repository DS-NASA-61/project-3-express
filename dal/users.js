const async = require('hbs/lib/async');
const {User} = require ('../models');
const { getHashedPassword } = require('../utilities');

const getUserbyEmail = async (email)=>{
    const user = await User.where({
        email:email
    }).fetch({
        require:true,
    });
    return user;
}

const createNewUser = async (userData) => {
    
    // setting the two dates fields must be before
    // creating a new User object. 
    // otherwise the userData won't contain the dates
    userData.created_date = new Date();
    userData.modified_date  = new Date();
    userData.password = getHashedPassword(userData.password);

    // create a new User object. 
    const user = new User(userData);

    await user.save();
    return user;
}

// const getUserById = async (userId) =>{
//     const user = await User.where({
//         id: userId
//     }).fetch({
//         require: true,
//         // withRelated: ['role']
//     });
//     return user;
// }

const getUserById = async function (userId) {
	const user = await User.where({
		id: userId
	}).fetch({
		require: true,
		// withRelated: ['role']
	});
	return user;
}

module.exports = {getUserbyEmail, createNewUser, getUserById}