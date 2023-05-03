const express = require('express');
const cloudinary = require('cloudinary');
const { Product, Category, Brand, Country, Region, Product_Image } = require('../models');
const { createProductForm, bootstrapField, wrapForm, createSearchForm } = require('../forms');
const { getAllCategories,
    createNewProduct,
    getProductById,
    getAllFlavorProfile,
    updateProduct,
    getProductImage,
    getProductThumbnail,
    getAllBrandNames,
    getAllCountries,
    getAllRegions,
    getAllDistilleries,
    getAllPackages,
    createNewProductImage,
    searchProducts,
    updateProductImage,
    getProductImageByProductId
} = require('../dal/products');
const { checkIfAuthenticated } = require('../middlewares');
const router = express.Router();


router.get('/', async (req, res) => {

    try {
        const [allCategories, allFlavorProfiles, allBrandNames, allCountries, allRegions, allDistilleries] = await Promise.all([
            getAllCategories(),
            getAllFlavorProfile(),
            getAllBrandNames(),
            getAllCountries(),
            getAllRegions(),
            getAllDistilleries()
        ]);

        const allArrays = [allCategories, allFlavorProfiles, allBrandNames, allCountries, allRegions, allDistilleries];

        allArrays.forEach((array) => {
            if (array === allFlavorProfiles) {
                array.unshift([0, "All"]);
            } else {
                array.unshift([0, "------"]);
            }
        });

        const searchForm = createSearchForm(
            ...allArrays
        );

        // the query to fetch EVERYTHING
        // let searchQuery = Product.collection(); // => SELECT * FROM products WHERE 1

        searchForm.handle(req, {
            "success": async function (form) {

                let products = await searchProducts(form.data);
                res.render('products/index', {
                    'products': products,
                    'form': wrapForm(form),
                })
            },

            "empty": async function (form) {
                let products = await searchProducts(form.data);
                res.render('products/index', {
                    'products': products,
                    'form': wrapForm(form),
                })
            },

            "error": async function (form) {
                let products = await searchProducts(form.data);
                res.render('products/index', {
                    'products': products,
                    'form': wrapForm(form),
                })
            },
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong')
    }
})



// --- create ---
// placing checkIfAuthenticated as the second argument 
// of router.post() and router.get() methods, so it's executed before the 
// route handler, allowing the function to check if the user 
// is authenticated before allowing access to the route.
// render form
router.get('/create', checkIfAuthenticated, async (req, res) => {

    const allCategories = await getAllCategories();
    const allFlavorProfiles = await getAllFlavorProfile();
    const allBrandNames = await getAllBrandNames();
    const allCountries = await getAllCountries();
    const allRegions = await getAllRegions();
    const allDistilleries = await getAllDistilleries();
    const allPackages = await getAllPackages();
    const allProductImages = await getProductImage();
    const allProductThumbnails = await getProductThumbnail();

    const form = createProductForm(
        allCategories,
        allFlavorProfiles,
        allBrandNames,
        allCountries,
        allRegions,
        allDistilleries,
        allPackages,
        allProductImages,
        allProductThumbnails);

    res.render('products/create', {
        // 'form': form.toHTML(bootstrapField),
        'form': wrapForm(form),
        'cloudinaryName': process.env.CLOUDINARY_NAME,
        'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
        'cloudinaryPreset': process.env.CLOUDINARY_PRESET,

    })

})

// process submitted form
router.post('/create', checkIfAuthenticated, async (req, res) => {

    const allCategories = await getAllCategories();
    const allFlavorProfiles = await getAllFlavorProfile();
    const allBrandNames = await getAllBrandNames();
    const allCountries = await getAllCountries();
    const allRegions = await getAllRegions();
    const allDistilleries = await getAllDistilleries();
    const allPackages = await getAllPackages();
    const allProductImages = await getProductImage();
    const allProductThumbnails = await getProductThumbnail();


    const form = createProductForm(
        allCategories,
        allFlavorProfiles,
        allBrandNames,
        allCountries,
        allRegions,
        allDistilleries,
        allPackages,
        allProductImages,
        allProductThumbnails
    );


    form.handle(req, {
        "success": async (form) => {
            try {
                // if the form has no errors
                // to access the data in the form, we use form.data

                // if we create a new instance of a model
                // const x = new ModelX();
                // then the x refers to ONE ROW IN THE TABLE
                // use the form data to create a new instance of the Product model, and then save it.
                const product = await createNewProduct(form.data);
                console.log("form.data:", form.data)
                // after saving the product, associate the flavor profile with it
                // note: form.data.flavor_profiles is a comma-separated string of 
                // flavor profile IDs that were selected in the form when creating a new product.
                // The attach() method is used to add a new relationship between the 
                // Product model and one or more FlavorProfile models. and is for many to 
                // many relationship

                if (form.data.image_url && form.data.thumbnail_url) {

                    const imageUrls = form.data.image_url.split(',');
                    const thumbnailUrls = form.data.thumbnail_url.split(',');

                    for (let i = 0; i < imageUrls.length; i++) {
                        const imageUrl = imageUrls[i];
                        const thumbnailUrl = thumbnailUrls[i];
                        const productImage = await createNewProductImage(imageUrl, thumbnailUrl, product.id);
                        await productImage.save({ product_id: product.id }, { patch: true });

                        console.log("productImage==>", productImage)
                    }


                }


                if (form.data.flavor_profiles) {
                    product.flavor_profiles().attach(form.data.flavor_profiles.split(','))
                }

                req.flash('success', 'Product created successfully!');
                res.redirect('/products');
            } catch (error) {
                console.log(error);
                req.flash('error', 'Failed to create product.');
                res.redirect('/products');
            }
        },

        "empty": async (form) => {
            // if the form is empty (no data provided)
            req.flash('error', 'Form cannot be empty.');
            res.render('products/create', {
                'form': wrapForm(form),
                'cloudinaryName': process.env.CLOUDINARY_NAME,
                'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
                'cloudinaryPreset': process.env.CLOUDINARY_PRESET,
            });
        },

        "error": async (form) => {
            // if the form has errors in validation 
            req.flash('error', 'Form has errors.');
            res.render('products/create', {
                'form': wrapForm(form),
                'cloudinaryName': process.env.CLOUDINARY_NAME,
                'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
                'cloudinaryPreset': process.env.CLOUDINARY_PRESET,
            })
        }
    })
})

router.get('/:productId/update', checkIfAuthenticated, async (req, res) => {

    // fetch all the categories and flaovr profiles
    const allCategories = await getAllCategories();
    const allFlavorProfiles = await getAllFlavorProfile();
    const allBrandNames = await getAllBrandNames();
    const allCountries = await getAllCountries();
    const allRegions = await getAllRegions();
    const allDistilleries = await getAllDistilleries();
    const allPackages = await getAllPackages();
    const allProductImages = await getProductImage();
    const allProductThumbnails = await getProductThumbnail();

    // fetch one row using Bookshelf
    const product = await getProductById(req.params.productId);

    // fetch productForm object with the necessary fields
    const productForm = createProductForm(
        allCategories,
        allFlavorProfiles,
        allBrandNames,
        allCountries,
        allRegions,
        allDistilleries,
        allPackages,
        allProductImages,
        allProductThumbnails);

    // get the productForm : the simplified way -- using a loop
    const fieldToGet = ['name', 'age', 'cost', 'strength', 'volume', 'description', 'stock', 'category_id', 'brand_id', 'country_id', 'region_id', 'distillery_id', 'package_id'];
    fieldToGet.forEach(field => {
        productForm.fields[field].value = product.get(field);
    })

    // get all the selected flavor profiles of the product
    // 'pluck' function only exists for bookshelf -- extracts out one key and put into an array
    let selectedFlavorProfiles = await product.related('flavor_profiles').pluck('id');  // example: [1,2,3,4]
    // put the selectedFlavorProfiles into the product fields
    productForm.fields.flavor_profiles.value = selectedFlavorProfiles;

    // Add the image_urls field to the list of fields to get
    fieldToGet.push('image_url');



    // Get all the selected images of the product using the relationship
    let selectedProductImages = await product.related('product_image').toJSON();


    // Initialize an empty array to store image URLs
    let imageUrls = [];
    let thumbnailUrls = [];

    // Loop through selectedProductImages and push the image_url to imageUrls array
    selectedProductImages.forEach(image => {
        imageUrls.push(image.image_url);
        thumbnailUrls.push(image.thumbnail_url);
    });

    // Set the value of the image_urls field in the productForm
    productForm.fields.image_url.value = imageUrls;


    res.render('products/update', {
        'product': product.toJSON(),
        'form': wrapForm(productForm),
        'cloudinaryName': process.env.CLOUDINARY_NAME,
        'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
        'cloudinaryPreset': process.env.CLOUDINARY_PRESET,
    });
})

router.post('/:productId/update', checkIfAuthenticated, async function (req, res) {
    try {
        const productForm = createProductForm();

        const product = await getProductById(req.params.productId);

        productForm.handle(req, {
            "success": async (form) => {

                const { flavor_profiles, image_url, thumbnail_url, ...productData } = form.data; //destructuring and rest operator
                console.log('312:Form data update->', form.data);
                // handle image
                const imageUrls = image_url.split(',');
                const thumbnailUrls = thumbnail_url.split(',');

                // upload new image and update product_image table
                const newImageUrls = [];
                const newThumbnailUrls = [];

                for (const imageUrl of imageUrls) {
                    // Check if the image URL is already in the existingImages array
                    const existingImages = product.related('product_image').toJSON();
                    const isExistingImage = existingImages.some(existingImage => existingImage.image_url === imageUrl);

                    // If it's not an existing image, upload it to Cloudinary
                    if (!isExistingImage) {
                        try {
                            const response = await cloudinary.uploader.upload(imageUrl, {
                                folder: 'products',
                                overwrite: true,
                                resource_type: 'auto',
                                tags: ['product_image']
                            });
                            console.log("route:335:response->",response)
                            newImageUrls.push(response.secure_url);
                            newThumbnailUrls.push(response.thumbnail_url);
                        } catch (error) {
                            console.error(error.message);
                        }
                    } else {
                        // If it's an existing image, add its URL and thumbnail URL to the new arrays
                        newImageUrls.push(imageUrl);
                        const existingImage = existingImages.find(existingImage => existingImage.image_url === imageUrl);
                        newThumbnailUrls.push(existingImage.thumbnail_url);
                    }
                }
                console.log("347: newImageUrls-->", newImageUrls)

                // Update the product_images table with the new image and thumbnail URLs
                await updateProductImage(req.params.productId, newImageUrls, newThumbnailUrls);

                // Fetch the related product images after updating the product_images table
                const updatedProductImages = await getProductImage(req.params.productId);
                product.related('product_image').set(updatedProductImages);

                // Delete old images from Cloudinary and 
                const existingImages = product.related('product_image').toJSON();
                for (const image of existingImages) {
                    // public ID is a unique identifier assigned by Cloudinary to each uploaded asset
                    // to extracts the public ID of the image from the image URL by splitting 
                    // the URL at each /, taking the last part (using pop()), and then 
                    // splitting that part at each . and taking the first part. 
                    // The public ID is required to delete the image from Cloudinary.
                    const isNewImage = newImageUrls.includes(image[1]);

                    if (!isNewImage) {
                        // If it's not a new image, delete it from Cloudinary

                        // const publicId = image.image_url.split('/').pop().split('.')[0];
                        const publicId = image[1].split('/').pop().split('.')[0];
                        await cloudinary.uploader.destroy(publicId);
                    }
                }

                // Get the old_image_urls from the form
                const old_image_urls = req.body.old_image_urls;

                // If there are old_image_urls, delete them from the product_images table and Cloudinary
                if (old_image_urls) {
                    const oldImageUrlsArray = old_image_urls.split(',');

                    // Delete the old images from the product_images table
                    for (const oldImageUrl of oldImageUrlsArray) {
                        await Product_Image.where({ image_url: oldImageUrl }).destroy();
                    }

                    // Delete the old images from Cloudinary
                    for (const oldImageUrl of oldImageUrlsArray) {
                        const publicId = oldImageUrl.split('/').pop().split('.')[0];
                        await cloudinary.uploader.destroy(publicId);
                    }
                }

                // Update the product with the other fields
                await updateProduct(product, productData);


                // handle flavor profiles
                // begin the synchronization of flavor_profiles
                const incomingFlavorProfiles = flavor_profiles.split(',');
                const existingFlavorProfiles = await product.related('flavor_profiles').pluck('id');
                // find flavor_profiles to remove
                let toRemove = existingFlavorProfiles.filter(t => incomingFlavorProfiles.includes(t) === false);
                await product.flavor_profiles().detach(toRemove);
                // find flavor_profiles to add
                let toAdd = incomingFlavorProfiles.filter(t => existingFlavorProfiles.includes(t) === false);
                await product.flavor_profiles().attach(toAdd)



                res.redirect('/products');

            },
            "empty": async (form) => {
                res.render('products/update', {
                    'form': wrapForm(form),
                    'cloudinaryName': process.env.CLOUDINARY_NAME,
                    'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
                    'cloudinaryPreset': process.env.CLOUDINARY_PRESET,
                })

            },
            "error": async (form) => {
                res.render('products/update', {
                    'form': wrapForm(form),
                    'cloudinaryName': process.env.CLOUDINARY_NAME,
                    'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
                    'cloudinaryPreset': process.env.CLOUDINARY_PRESET,
                })
                console.log(form);
            }

        })

    } catch (error) {
        console.log(error)
    }
})

router.get('/:productId/delete', checkIfAuthenticated, async function (req, res) {
    const product = await Product.where({
        'id': req.params.productId
    }).fetch({
        'required': true
    });

    res.render('products/delete', {
        'product': product.toJSON()
    })
});

router.post('/:productId/delete', checkIfAuthenticated, async function (req, res) {
    const product = await Product.where({
        'id': req.params.productId
    }).fetch({
        'require': true
    });
    await product.destroy(); // remove the row
    res.redirect('/products');

})

module.exports = router;