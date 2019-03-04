var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var Estados = {
    values: ['LIBRE', 'OCUPADO', 'RESERVADO'],
    message: '{VALUE} no es un rol valido'
};
var habitacionSchema = new Schema({
    numero: { type: String, unique: true, required: [true, 'El numero de habitacion es necesario'] },
    piso: { type: Number, required: [true, 'El piso es necesario'] },
    img: { type: String, required: false },
    estado: { type: String, required: [true, 'El estado es necesario'], uppercase: true, default: 'LIBRE', enum: Estados },
    precios: { type: Number },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: [true, 'la categoria es necesaria'] }
}, { collection: 'habitaciones' });
habitacionSchema.plugin(uniqueValidator, { message: 'El numero debe ser unico' });
module.exports = mongoose.model('Habitacion', habitacionSchema);