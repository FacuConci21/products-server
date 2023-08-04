const productsController = require('../controllers/products.controller')
const cartsController = require('../controllers/carts.controller')


const router = (app) => {
    app.use('/api/products', productsController);
    app.use('/api/carts', cartsController);
}

module.exports = router;