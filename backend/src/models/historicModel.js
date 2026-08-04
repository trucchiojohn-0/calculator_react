const db = require('../db');

class HistoricModel {
  static async create({ expression, result, status }) {
    const stringExpression = String(expression || '').trim();

    const [record] = await db('historic')
      .insert({
        expression: stringExpression,
        result,
        status: status || 'SUCCESS',
        calculated_at: db.fn.now(), 
      })
      .returning('*');

    return record;
  }

  static async findAll({ limit = 20, page = 1 } = {}) {
    const offset = (page - 1) * limit;

    return await db('historic')
      .select(
        'id',
        'expression',
        'result',
        'calculated_at',
        'status'
      )
      .orderBy('calculated_at', 'desc')
      .limit(limit)
      .offset(offset);
  }

  static async findById(id) {
    return await db('historic')
      .where({ id })
      .first();
  }

  static async deleteAll() {
    return await db('historic')
      .del();
  }
}

module.exports = HistoricModel;