const graphql = require('graphql')
const { GraphQLInt: int, GraphQLString: string, GraphQLList: List, GraphQLID: id, GraphQLObjectType: QLObject } = graphql

const User = new QLObject({
    name: 'User', 
    sqlTable: 'user',
    uniqueKey: 'id',
    fields: () => ({
        id: {type: id},
        username: {type: string},
        // orders: {
        //     type: graphql.GraphQLList(Order), 
        //     sqlJoin: (customer, order) => `${customer}.id = ${order}.customer` 
        // }
    })
})

const Dish = new QLObject({
    name: 'Dish',
    sqlTable: 'dish',
    uniqueKey: 'id',
    fields: () => ({
        id: {type: id},
        name: {type: string},
        description: {type: string},
        price: {type: int},
        restaurant: {
            type: Restaurant,
            sqlBatch: {
                thisKey: 'restaurant', 
                parentKey: 'id'
            }
        },
    })
})

const Category = new QLObject({
    name: 'Category', 
    sqlTable: 'category',
    uniqueKey: 'id',
    fields: () => ({
        id: {type: id},
        name: {type: string},

    })
})


var Restaurant = new QLObject({
    name: 'Restaurant',
    sqlTable: 'restaurant',
    uniqueKey: 'id',
    fields: () => ({
        id: {type: id},
        name: {type: string},
        description: {type: string},
        address: {type: string},
        dishes: {
            description: 'Restaurant dishes',
            type:  List(Dish),
            sqlBatch: {
                thisKey: 'restaurant', 
                parentKey: 'id'
            },
            sqlJoin: (restaurant, dish) => `${restaurant}.id = ${dish}.restaurant`,
            // resolve: (dish) => ["here is first", "here is second"]
            
        },
        orders: {
            type: List(Order),
            sqlBatch: {
                thisKey: 'restaurant', 
                parentKey: 'id'
            }
        },
        categories: {
            type: List(Category),
            sqlTable: 'RestaurantCategories',
            sqlJoins: [
                (restaurant, junction, args) => `${restaurant}.id = ${junction}.restaurant`,
                (junction, category, args) => `${junction}.category = ${category}.id`
            ]
        }
    })
})




var Order = new QLObject({
    name: 'Order', 
    sqlTable: 'ordering',
    uniqueKey: 'id',
    fields: () => ({
        id: { type: id },
        place: { type: int },
        status: {type: string },
        user: {
            type: User,
            sqlBatch: {
                thisKey: 'user', 
                parentKey: 'id'
            }
        },
        restaurant: { 
            type: Restaurant,
            sqlBatch: {
                thisKey: 'restaurant', 
                parentKey: 'id'
            }
        },
    })
})

var OrderedDish = new QLObject({
    name: 'OrderedDish',
    sqlTable: 'ordered_dish',
    uniqueKey: 'id',
    fields: () => ({
        id: { type: id},
        dish: { 
            type: Dish,
            sqlBatch: {
                thisKey: 'dish', 
                parentKey: 'id'
            }
        },
        order: {
            type: Order,
            sqlBatch: {
                thisKey: 'ordering', 
                parentKey: 'id'
            }
        }
    })
})


module.exports = {
    User, 
    Order,
    OrderedDish,
    Restaurant,
    Dish
}