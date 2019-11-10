// ===============================
//  Puerto
// ===============================
process.env.PORT = process.env.PORT || 3001;

// ===============================
//  Ambiente
// ===============================

process.env.NODE_ENV = process.env.NODE_ENV || "cloud";

// ===============================
//  Base de datos
// ===============================

let urlDb;

if (process.env.NODE_ENV === "dev") {
    urlDb = "mongodb://localhost:27017/cafe";
    console.log("Conectado a dev local");
} else {
    urlDb = "mongodb+srv://kerberos:<>@clusterjdepaz-9wwdu.gcp.mongodb.net/cafe?retryWrites=true&w=majority";
}
process.env.URL_DATABASE = urlDb;