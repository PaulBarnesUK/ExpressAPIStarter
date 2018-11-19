const mongo = require('mongodb');

// The resource name, this dictates the url
exports.name = 'product';

/**
 * Show a product using a given ID
 */
exports.show = async function(req, res) {
  const productsCollection = req.db.collection('products');
  const manufacturersCollection = req.db.collection('manufacturers');
  const _id = new mongo.ObjectID(req.params.product_id);

  const product = await productsCollection.findOne({
    _id
  }, {
    _id: 0
  });

  if (product.manufacturer) {
    const manufacturerId  = new mongo.ObjectID(product.manufacturer);
    const manufacturer = await manufacturersCollection.findOne({
      _id: manufacturerId
    }, {
      _id: 0
    });

    product.manufacturer = manufacturer;
  }

  res.send(product);
};

/**
 * List products
 */
exports.list = async function(req, res) {
  const productsCollection = req.db.collection('products');
  const manufacturersCollection = req.db.collection('manufacturers');

  const products = await productsCollection.find({}).toArray();

  const preparedProducts = products.map(async product => {
    const _id = new mongo.ObjectID(product.manufacturer);
    const manufacturer = await manufacturersCollection.findOne({
      _id
    }, {
      _id: 0
    });
    
    product.manufacturer = manufacturer;

    return product;
  });

  const response = await Promise.all(preparedProducts);

  res.send(response);
};

/**
 * Create a product
 */
exports.create = async function(req, res) {
  // validation

  const product = await req.db.collection('products').insert(req.query);

  res.send(product);
};