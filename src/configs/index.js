require('dotenv').config()

const env = JSON.parse(JSON.stringify(process.env))

// All Configs that needed to be centralized
const config = {

  // dotenv App Environment Variables
  env,

  // Max Page Size Limit in listing
  maxPageSizeLimit: 20,

  // Regex
  regex: {
    objectId: /^[0-9a-fA-F]{24}$/,
  },

  // Sort Types
  sortTypes: {
    date: 'createdAt',
    name: 'name',
  },

}

module.exports = config
