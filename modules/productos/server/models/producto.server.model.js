'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
/**
 * Producto Schema
 */
var ProductoSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Producto name',
    trim: true
  },
  descripcion: {
    type: String,
    default: '',
    required: 'Please fill Producto decripcion',
    trim: true
  },
  precio: {
    type: String,
    default: '',
    required: 'Please fill Producto precio',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Producto', ProductoSchema);
require('mongoose-middleware').initialize(mongoose);
