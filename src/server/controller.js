const User = require('../models/user')

const implementation = {

  async	Health(_call, callback) {
		try {
			callback(null, { check: true })
		} catch (error) {
			console.log('Error on Health: ', error)
			callback(error)
		}
	},

  async	Create(call, callback) {
		try {
			await User.create(call.request.user)
			callback(null, { success: true })
		} catch (error) {
			console.log('Error on Create: ', error)
			callback(error)
		}
	},

	async List(_call, callback) {
		try {
			const list = await User.listAll()
			callback(null, { user: list })
		} catch (error) {
			console.log('Error on List: ', error)
			callback(error)
		}
	},

	async Get(call, callback) {
		try {
			const user = await User.getByID(call.request.userId, true)
			callback(null, user)
		} catch (error) {
			console.log('Error on Get: ', error)
			callback(error)
		}
	},

	async Remove(call, callback) {
		try {
			const result = await User.archive(call.request.userId)
			console.log(result)
			callback(null, result)
		} catch (error) {
			console.log('Error on Remove: ', error)
			callback(error)
		}
	},
}

module.exports = implementation
