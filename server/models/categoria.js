const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: { type: String, unique: true, required: [true, 'La descripción es obligatoria'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

categoriaSchema.methods.toJSON = function() {
    let categoria = this;
    let categoriaObject = categoria.toObject();
    return categoriaObject;
}

module.exports = mongoose.model('Categoria', categoriaSchema);