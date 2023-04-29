const crypto = require('crypto');
const cloudinary = require('cloudinary');

const getHashedPassword = (password)=>{
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

function cloudinaryImageUrl(publicId, options = {}) {
    // Add the default_image option to the transformation
    const defaultImage = 'default-product'; // Use the public ID of your default image
    options.default_image = options.default_image || defaultImage;
  
    return cloudinary.url(publicId, options);
  }


module.exports = {getHashedPassword, cloudinaryImageUrl}