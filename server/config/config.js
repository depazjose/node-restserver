// ===============================
//  Puerto
// ===============================
process.env.PORT = process.env.PORT || 3001;

// ===============================
//  Ambiente
// ===============================

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// ===============================
//  jwt
// ===============================
process.env.JWT_CADUCIDAD = 60 * 60 * 24 * 15;
process.env.JWT_SEED = process.env.JWT_SEED || 'my-jwt-token'


// ===============================
//  Base de datos
// ===============================

let urlDb;

if (process.env.NODE_ENV === "dev") {
    urlDb = "mongodb://localhost:27017/cafe";
    console.log("Conectado a dev local");
} else {
    urlDb = process.env.MONGO_URI;
}
process.env.URL_DATABASE = urlDb;