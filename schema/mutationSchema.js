

const { Restaurant, Dish, Order, OrderedDish, User } = require('./types')

const { GraphQLString: string, GraphQLInt: int, GraphQLNonNull: notNull, GraphQLObjectType: QLObject } = require('graphql')
const { keys, values } = Object
const { db, postItem, deleteItem, updateItem, getItem } = require('../db')
const { dissoc } = require('rambda')
const { createArgs } = require('./utils')
const sha256 = require('sha256')
const { validate, createToken, hashPassword } = require('../auth')
const jwt = require('jsonwebtoken')

const roots = [
    {
        name: 'Restaurant', table: 'restaurant', 
        data: Restaurant,
        post: {name: notNull(string), address: notNull(string), description: notNull(string)},
        delete: {id: notNull(int)}
    },
    {
        name: 'Dish', table: 'dish',
        data: Dish, 
        post: {name: notNull(string), restaurant: notNull(int),  price: notNull(int), description: notNull(string)},
        update: {name: string, restaurant: int, price: int, description: string},
        delete: {id: notNull(int)}
    },
    {
        name: 'Order', table: 'ordering', 
        data: Order, 
        post: {restaurant: notNull(int), place: notNull(int), customer: notNull(int)},
        delete: {id: notNull(int)}
    },
    {
        name: 'User', table: 'user', 
        data: User,
        post: { nickname: notNull(string) },
        delete: {id: notNull(int)}
    },
]

const postItemResolve = (table) => async (parent, args, context, resolveInfo) => await postItem(table, args)
    
const deleteItemResolve = (table) => async (parent, args, context, resolveInfo) => await deleteItem(table, args)

const updateItemResolve = (table) => async (parent, args, context, resolveInfo) => await updateItem(table, args)

const methods = {
    post: postItemResolve,
    delete: deleteItemResolve,
    update: updateItemResolve
}

const createRoot = ({table, data, args}, resolve) => ({
    type: data,
    args: createArgs(args || {}),
    resolve: resolve(table)
})

const applyMethods = (root) => (
    keys(methods).reduce((roots, method) => ({...roots, ...(root[method] ? {[method + root.name]: createRoot(root, methods[method])} : {})}) ,{})
)

const createDataRoots = (roots) => roots.reduce((a, c) =>  ({...a, ...applyMethods(c)}),{})

const signUp = () => ({
    type: string,
    args: {
        username: {type: notNull(string)},
        password: {type: notNull(string)}
    },
    resolve: async (parent, args, context, resolveInfo) => {
        const { password, username } = args

        const user = await postItem('User', {username, password: hashPassword(password)})

        return createToken(user.id)
    }
})

const signIn = () => ({
    type: string,
    args: {
        username: {type: notNull(string)},
        password: {type: notNull(string)}
    },
    resolve: async (parent, args, context, resolveInfo) => {
        const { password, username } = args
        
        const userId = validate(username, password)

        if (!userId) throw new AuthenticationError('Incorrect credentials')
        
        return createToken(userId)
    }
})

const mutationRoots = (roots) => {
    const authRoots = {signIn: signIn(), signUp: signUp()}
    const dataRoots = createDataRoots(roots)
    return {...dataRoots, signIn: signIn(), signUp: signUp()}
}

module.exports = new QLObject({
    name: 'Mutation', 
    fields: () => mutationRoots(roots)
})