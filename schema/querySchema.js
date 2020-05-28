
const { Restaurant, Dish, Order, OrderedDish, User } = require('./types')
const { db, getItem } = require('../db')
const {GraphQLNonNull: notNull, GraphQLList: List, GraphQLObjectType: QLObject, GraphQLInt: int} = require('graphql')
const joinMonster = require('join-monster')
const {keys, entries} = Object
const {createArgs} = require('./utils')

const whereArgs = args => entries(args).reduce((rest, [arg, value]) => [...rest, `${table}.${arg} = ${value}`], []).join(' AND ')

const userResolve = async (parent, args, context, resolveInfo) => {
    const {user} = context
    console.log('here is the user', user)

    return user
}

const loneRoot = (customResolve = null) => ({data, args}) => ({
  type: data,
  args: createArgs(args || {}),
  // args: { id: { type: notNull(int) }, ...createArgs(args || {}) } ,
  where: (table, args, context) => whereArgs(args),
  resolve: customResolve || ((parent, args, context, resolveInfo) => joinMonster.default(resolveInfo, {}, sql => db.raw(sql)))
})

const groupRoot = (customResolve = null) => ({data, args}) => ({
  type: List(data),
  args: createArgs(args || {}),
  where: (table, args, context) => whereArgs(args),
  resolve: customResolve || ((parent, args, context, resolveInfo) => {
    return joinMonster.default(resolveInfo, {}, async sql => {
      return await db.raw(sql)
    })
  })
})

const roots = [
    {data: Restaurant, queries: {restaurant: loneRoot(), restaurants: groupRoot()}},
    {data: Dish, queries: {dish: loneRoot(), dishes: groupRoot()}},
    {data: Order, queries: {order: loneRoot(), orders: groupRoot()}, args: {customer: int}},
    {data: OrderedDish, queries: {orderedDish: loneRoot(), orderedDishes: groupRoot()}, args: {user: int}},
    {data: User, queries: {user: loneRoot(userResolve)}}
]

const createRoot = (root) => entries(root.queries).reduce((queries, [query, creator]) => ({...queries, [query]: creator(root)}),{})

const createRoots = (data) => data.reduce((roots, root) => ({...roots, ...createRoot(root)}), {})
    
module.exports = new QLObject({
  name: 'Query',
  fields: () => createRoots(roots)
})