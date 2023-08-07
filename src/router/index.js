const productsController = require('../controllers/products.controller')
const cartsController = require('../controllers/carts.controller')


const router = (app) => {
    app.use('/api/products', productsController);
    app.use('/api/carts', cartsController);
    app.use('*', (req, res) => {
        res.status(404).render('error', { status: "error", message: 'Page not found' })
    })
}

module.exports = router;