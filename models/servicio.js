var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var servicioSchema = new Schema({

    nombre: { type: String, unique: true, uppercase: true, required: [true, 'El nombre es necesario'] },
    detalles: { type: String, uppercase: true },
    precios: { type: Number }

});
servicioSchema.plugin(uniqueValidator, { message: 'El nombre debe ser unico' });
module.exports = mongoose.model('Servicio', servicioSchema);