const mongoose = require('mongoose')
const Boom = require('@hapi/boom')
const config = require('../configs')

const mask = {
  userId: 1,
  name: 1,
  age: 1,
  _id: -1
}

// Add your own attributes in schema
const Schema = mongoose.Schema
const schema = new Schema({
  userId: { type: Schema.Types.String, require: true, unique: true, trim: true },
  name: { type: Schema.Types.String, require: true, trim: true },
  age:  { type: Schema.Types.Number, default: 18 },
  createdAt: { type: Schema.Types.Number },
  updatedAt: { type: Schema.Types.Number },
  deletedAt: { type: Schema.Types.Number, default: 0 },
}, { strict: true })

// Choose your own model name
const User = mongoose.model('User', schema)

async function create(data) {
  data.createdAt = Date.now()
  return await User.create(data)
}

async function listAll() {
  return await User.find({ deletedAt: 0 }).select(mask)
}

async function list(queryData) {
  const { page, size, sort, ...query } = queryData
  const setSize = (size > config.maxPageSizeLimit) ? config.maxPageSizeLimit : size
  const sortBy = (sort && sort !== config.sortTypes.date) ? { [config.sortTypes[sort]]: 1 } : { createdAt: -1 }

  if(query.name) query.name = { '$regex': query.name, '$options': 'i' }
  query.deletedAt = 0

  const total = await User.countDocuments(query)
  const list = await User.find(query).select(mask).limit(setSize).skip((page - 1) * setSize).sort(sortBy)

  return { total, list }
}

async function getByID(userId, isMasked = false) {
  const user = await User.findOne({ userId }).select(isMasked ? mask : '')
  if(!user || user.deletedAt !== 0) throw Boom.notFound('User not found.')
  return user
}

async function updateById(userId, data) {
  const user = await getByID(userId)
  const updatedUser = { ...user, ...data }
  return await User.findByIdAndUpdate(userId, updatedUser, { projection: mask })
}

async function archive(userId) {
  const user = await getByID(userId)
  return await User.findByIdAndUpdate(user.id, { deletedAt: Date.now() }, { projection: mask })
}

async function remove(userId) {
  return await User.deleteOne({ userId }, { projection: mask })
}

async function restore(userId) {
  const user = await getByID(userId)
  return await User.findByIdAndUpdate(user.id, { deletedAt: 0 }, { projection: mask })
}

module.exports = {
  create,
  list,
  listAll,
  getByID,
  updateById,
  archive,
  remove,
  restore
}
