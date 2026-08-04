const db = require('../src/db/index.js');

class HistoricModel {

  static async create({ expression, result, calculated_at, status }) {
    const [record] = await db('historic')
      .insert({
        expression,
        result,
        calculated_at: calculated_at || db.fn.now(),
        status: status || 'sucesso'
      })
      .returning('*');

    return record;
  }

  static async findAll() {
    return await db('historic')
      .select('*')
      .orderBy('calculated_at', 'desc');
  }
}

module.exports = HistoricModel;