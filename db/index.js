const { db: connection } = require('../config.js')
const knex = require('knex')
const {dissoc, compose, keys, reverse } = require('rambda')
const {entries} = Object
const tables = require('./schema')

const db = knex( {client: 'pg', connection} )

//TODO: Add support for multiple schemas (currently only public is available)
const withSchema = (name) => db.schema.withSchema(name)

const createTables = async (tables) => {
  for (let [table, createCallback] of entries(tables)) { 
    
    const exists = await db.schema.hasTable(table)

    if (!exists) {
       await db.schema.createTable(table, createCallback)
    }
  }
}

const reversedKeys = (object) => compose(reverse, keys)(object)

const deleteTables = async (tables) => {
    for (let table of reversedKeys(tables)) { 
      await db.schema.dropTableIfExists(table)
    }
}
const some = (hello)=> 2
const postItem = async (table, args) => await db(table).returning('*').insert(args)

const deleteItem = async (table, args) => await db(table).where(args).del()

const updateItem = async (table, args) => await db(table).where('id', args.id).update(dissoc('id', args))

const getItem = async (table, args = {}, returning = null ) => await db(table).where(args).select(returning || '*')

const dropSchema = async (name) => await db.raw(`DROP SCHEMA if exists ${name} CASCADE;`)
const createSchema = async (name) => await db.raw(`CREATE SCHEMA ${name};`)

const initDatabase = (tables) => {
  return async () => {
    await deleteTables(tables)
    await createTables(tables)
  }
}




module.exports = { db, initDatabase: initDatabase(tables), createTables, postItem, deleteItem, updateItem, getItem }