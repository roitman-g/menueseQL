
const tables = {
    user: (t) => {
        t.increments().primary()
        t.string('username').notNullable().unique()
        t.string('password').notNullable()
        t.timestamps()
    },

    role: (t) => {
        t.increments().primary()
        t.string('name')
    },

    userRoles: (t) => {
        t.increments().primary()
        t.integer('user').notNullable()
        t.integer('role').notNullable()
        t.foreign('role').references('id').inTable('role')
        t.foreign('user').references('id').inTable('user')
    },

    restaurant: (t) => {
        t.increments().primary()
        t.string('name').notNullable().unique()
        t.string('description')
        t.string('address')
        t.timestamps()
    },

    category: (t) => {
        t.increments().primary()
        t.string('name')
    },

    restaurant_categories: (t) => {
        t.increments().primary()
        t.integer('restaurant').notNullable()
        t.integer('category').notNullable()
        t.foreign('category').references('id').inTable('category')
        t.foreign('restaurant').references('id').inTable('restaurant')
    },

    ordering: (t) => {
        t.increments().primary()
        t.integer('restaurant').notNullable()
        t.integer('place')
        t.string('status').defaultTo('active')
        t.integer('user')
        t.foreign('restaurant').references('id').inTable('restaurant')
        t.foreign('user').references('id').inTable('user')
        t.timestamps()
    },

    dish: (t) => {
        t.increments().primary()
        t.integer('restaurant').notNullable()
        t.string('name').notNullable()
        t.integer('price').notNullable()
        t.text('description')
        t.foreign('restaurant').references('id').inTable('restaurant')
    },

    ordered_dish: (t) => {
        t.increments().primary()
        t.integer('dish').notNullable()
        t.integer('ordering').notNullable()
        t.foreign('ordering').references('id').inTable('ordering')
        t.foreign('dish').references('id').inTable('dish')
        t.timestamps()
    }
}

module.exports = tables;