const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const dropIndexes = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/medivision');
    console.log('Connected.');

    const collections = await mongoose.connection.db.listCollections().toArray();
    const categoriesExists = collections.some(col => col.name === 'categories');
    
    if (categoriesExists) {
      console.log('Dropping unique indexes on categories collection...');
      try {
        await mongoose.connection.db.collection('categories').dropIndex('name_1');
        console.log('- Dropped name_1 index');
      } catch (e) {
        console.log('- name_1 index not found or already dropped');
      }
      try {
        await mongoose.connection.db.collection('categories').dropIndex('slug_1');
        console.log('- Dropped slug_1 index');
      } catch (e) {
        console.log('- slug_1 index not found or already dropped');
      }
    } else {
      console.log('Categories collection does not exist yet.');
    }
    
    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error dropping indexes:', error.message);
    process.exit(1);
  }
};

dropIndexes();
