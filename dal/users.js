const {User} = require ('../models')

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

    // create a new User object. 
    const user = new User(userData);

    await user.save();
    return user;
}

module.exports = {getUserbyEmail, createNewUser}