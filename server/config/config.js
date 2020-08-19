// ==============================
// Puerto:
// ==============================
process.env.PORT = process.env.PORT || 3000;

// ==============================
// Base de datos:
// ==============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==============================
// Base de datos:
// ==============================
let urlDB;

// if (process.env.NODE_ENV == 'dev') {
//     urlDB = 'mongodb://localhost:27017/cafe'
// } else {
urlDB = 'mongodb+srv://rhuamani:60095Yuri@cluster0.goijk.gcp.mongodb.net/cafe?retryWrites=true&w=majority';
// }

process.env.URLDB = urlDB;