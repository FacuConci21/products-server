const productsController = require('../products/products.controller')
const cartsController = require('../carts/carts.controller')


const router = (app) => {
    app.use('/api/products', productsController);
    app.use('/api/carts', cartsController);
}

module.exports = router;