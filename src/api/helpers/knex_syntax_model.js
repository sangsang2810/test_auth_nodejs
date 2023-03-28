module.exports = ({
    knex = require('./connect_sqldb'),
    name = '',
    tableName = '',
    selectableProps = [],
    timeout = 1000
}) => {


    const create = props => {
        delete props.id
        return knex.insert(props)
            .returning(selectableProps)
            .into(tableName)
            .timeout(timeout)
    }

    const find = filters => {
        return knex.select(selectableProps)
            .from(tableName)
            .where(filters)
            .timeout(timeout)
    }

    const update = (id, props) => {
        delete props.id

        return knex.update(props)
            .from(tableName)
            .where({
                id
            })
            .returning(selectableProps)
            .timeout(timeout)
    }

    const destroy = filters => {
        return knex.del()
            .from(tableName)
            .where(filters)
            .timeout(timeout)
    }

    return {
        name,
        tableName,
        selectableProps,
        timeout,
        create,
        find,
        update,
        destroy
    }
}