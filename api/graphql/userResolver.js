const { GraphQLScalarType } = require('graphql');
const { PubSub } = require('apollo-server');
const User = require('../models/user')
const USER_CHANGED = 'USER_CHANGED';
const userResolvers = {
    DateTime: new GraphQLScalarType({
        name:'DateTime',
        description:'string de data e hora no formato ISO-8601',
        serialize:(value) => value.toISOString(),
        parseValue: (value) => new Date(value),
        parseLiteral:(ast) => new Date(ast.value),
    }),
    Query:{
        user(_,{id}){
            return User.findById(id);
        },
        users() {
            return User.find();
        }
    },
    Mutation:{
		createUser: async (_, { user }, {pubsub}) => {
			user.createdAt = new Date().toISOString()
			user.updatedAt = new Date().toISOString()
			const newUser = new User(user);
			await newUser.save();
			const users = await User.find();
			pubsub.publish(USER_CHANGED, {users:users});
			return newUser;
		},

		updateUser: async (_, { user }, {pubsub}) => {
			user.updatedAt = new Date().toISOString()
			await User.findByIdAndUpdate(user._id, user);
			const users = await User.find();
			pubsub.publish(USER_CHANGED, {users:users});
			return `Usuario ${user.name} atualizado!`
		},

		deleteUser: async (_, { _id }, {pubsub}) => {
			await User.findByIdAndDelete(_id)
			const users = await User.find();
			pubsub.publish(USER_CHANGED, {users:users});
			return `Usuario excluido!`
		},
    },
    Subscription: {
      	users:{
        	subscribe:(_,__, {pubsub}) => {
				return pubsub.asyncIterator(USER_CHANGED);
			}
      	}
    }
}

const pubsub = new PubSub();

module.exports = userResolvers;