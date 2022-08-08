#! /usr/bin/env node
const async = require('async');
const mongoose = require('mongoose');
const dotenv = require('dotenv')

console.log('populating database with sample data');

// load env variables
const envVars = dotenv.config();
if (envVars.error) throw('error loading .env file: ', envVars.error);

// load schemas
const Item = require('./models/item');
const Category = require('./models/category');
const ClothCollection = require('./models/clothCollection');
const ItemInstance = require('./models/itemInstance');

// mount database
const mongoDB = process.env.MONGODBCONNECTION;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const collections = [];
const categories = [];
const items = [];
const itemInstances = [];

function collectionCreate(name, description, callback) {
  collectionDetail = { name: name, description: description };

  const collection = new ClothCollection(collectionDetail);

  collection.save(err => {
    if (err) {
      callback(err, null);
      return;
    }
    console.log('New Collection: ' + collection);
    collections.push(collection);
    callback(null, collection);
  });
}

function categoryCreate(name, callback) {

  const category = new Category({ name: name });

  category.save(err => {
    if (err) {
      callback(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category);
    callback(null, category);
  });
}

function itemCreate(name, description, price, category, collection, sizes, callback) {
  itemDetail = {
    name: name,
    description: description,
    price: price,
    category: category,
    cloth_collection: collection,
    sizes: sizes
  }

  const item = new Item(itemDetail);
  item.save(err => {
    if (err) {
      callback(err, null);
      return;
    }
    console.log('New Item: ' + item);
    items.push(item);
    callback(null, item);
  });
}

function itemInstanceCreate(item, number_in_stock, store, callback) {
  itemInstanceDetail = { 
    item: item,
    number_in_stock: number_in_stock,
    store: store
  }   
 
  const itemInstance = new ItemInstance(itemInstanceDetail);
  itemInstance.save(err => {
    if (err) {
      callback(err, null);
      return;
    }
    console.log('New ItemInstance: ' + itemInstance);
    itemInstances.push(itemInstance);
    callback(null, itemInstance);
  });
}

function populateCategory(cb) {
    async.parallel([
        function(callback) {
          categoryCreate('Head', callback);
        },
        function(callback) {
          categoryCreate('Hands', callback);
        },
        function(callback) {
          categoryCreate('Torse', callback);
        },
        function(callback) {
          categoryCreate('Legs', callback);
        },
        function(callback) {
          categoryCreate('foot', callback);
        }
        ],
        cb);
}

function populateCollection(cb) {
  async.parallel([
      function(callback) {
        collectionCreate('Winter', 'This collection is made of all the clothes that are warmy and fashioned for winter season.', callback);
      },
      function(callback) {
        collectionCreate('Spring', 'This collection is made of all the clothes that reflect the spirit of spring season.', callback);
      },
      function(callback) {
        collectionCreate('Summer', 'This collection is made of all the clothes that are fresh and fashioned for summer season.', callback);
      },
      function(callback) {
        collectionCreate('Fall', 'This collection is made of all the clothes that reflect the beautiful colors of fall season.', callback);
      },
      function(callback) {
        collectionCreate('All Seasons', 'This collection is made of all the clothes that you may wear in every season.', callback);
      },
      ],
      cb);
}

function populateItem(cb) {
    async.parallel([
        function(callback) {
          itemCreate(
            'Cowboy Hat',
            'If you\'re a cowboy you must have this cool hat.',
            '99.99',
            categories[0],
            collections[4],
            ['S', 'M', 'L'],
            callback);
        },
        function(callback) {
          itemCreate(
            'T-shirt',
            'It\'s fresh, casual and elegant.',
            '59.99',
            categories[2],
            collections[1],
            ['XS', 'S', 'M', 'L', 'XL'],
            callback);
        },
        function(callback) {
          itemCreate(
            'Yoga Pants',
            'If you\'re into yoga this pants are for you.',
            '79.99',
            categories[3],
            collections[2],
            ['XS', 'S', 'M', 'L'],
            callback);
        },
        function(callback) {
          itemCreate(
            'Sport Shoes',
            'If you\'re into sports this shoes are for you.',
            '79.99',
            categories[4],
            collections[4],
            ['S', 'M', 'L', 'XL'],
            callback);
        },
        function(callback) {
          itemCreate(
            'Glasses',
            'If your sight fails you wear these glasses and you will see the world in HD.',
            '199.99',
            categories[0],
            collections[4],
            ['S', 'M', 'L', 'XL'],
            callback);
        },
        function(callback) {
          itemCreate(
            'Winter Gloves',
            'Is the winter cold af in your place? Buy these gloves and care no more!.',
            '89.99',
            categories[1],
            collections[0],
            ['M', 'L'],
            callback);
        },
        function(callback) {
          itemCreate(
            'Cap',
            'A fashionless cap to protect your face from the sun.',
            '49.99',
            categories[0],
            collections[2],
            ['S', 'M', 'L', 'XL'],
            callback);
        },
        function(callback) {
          itemCreate(
            'Coat',
            'An ellegant coat to wear in formal meetings.',
            '299.99',
            categories[2],
            collections[0],
            ['S', 'M', 'L', 'XL'],
            callback);
        },
        function(callback) {
          itemCreate(
            'Blue Jean',
            'It\'s a jean but in blue.',
            '99.99',
            categories[3],
            collections[4],
            ['XS', 'S', 'M', 'L', 'XL'],
            callback);
        },
        function(callback) {
          itemCreate(
            'Short Pants',
            'Short pants to help yousirvive the extreme heat of the summer.',
            '59.99',
            categories[3],
            collections[2],
            ['XS', 'S', 'M', 'L', 'XL'],
            callback);
        }
        ],
        // optional callback
        cb);
}


function populateItemInstance(cb) {
    async.parallel([
        function(callback) {
          itemInstanceCreate(items[0], 2, undefined, callback);
        },
        function(callback) {
          itemInstanceCreate(items[1], 3, undefined, callback);
        },
        function(callback) {
          itemInstanceCreate(items[1], 0, 'Racoon City', callback);
        },
        function(callback) {
          itemInstanceCreate(items[2], 5, undefined, callback);
        },
        function(callback) {
          itemInstanceCreate(items[3], 3, 'Racoon City', callback);
        },
        function(callback) {
          itemInstanceCreate(items[4], 3, undefined, callback);
        },
        function(callback) {
          itemInstanceCreate(items[4], 6, 'Racoon City', callback);
        },
        function(callback) {
          itemInstanceCreate(items[5], 1, 'Racoon City', callback);
        },
        function(callback) {
          itemInstanceCreate(items[6], 3, undefined, callback);
        },
        function(callback) {
          itemInstanceCreate(items[7], 8, undefined, callback);
        },
        function(callback) {
          itemInstanceCreate(items[8], 2, 'Racoon City', callback);
        },
        function(callback) {
          itemInstanceCreate(items[8], 4, undefined, callback);
        },
        function(callback) {
          itemInstanceCreate(items[9], 10, undefined, callback);
        },
        function(callback) {
          itemInstanceCreate(items[9], 4, 'Racoon City', callback);
        }
        ],
        // Optional callback
        cb);
}



async.series([
  populateCategory,
  populateCollection,
  populateItem,
  populateItemInstance
],
// Optional callback
function(err, results) {
  if (err) {
      console.log('FINAL ERR: ' + err);
  }
  else {
    console.log('Populated: ' + results);
  }
    // All done, disconnect from database
    mongoose.connection.close();
});
