const knex = require('../db'); 

const CalculatorController = {
  calculate: async (req, res) => {
    try {
      const { expressao, resultado } = req.body;

      if (expressao === undefined || resultado === undefined) {
        return res.status(400).json({ error: 'Os campos "expressao" e "resultado" são obrigatórios.' });
      }

      if (typeof expressao !== 'string' || typeof resultado !== 'number') {
        return res.status(400).json({ error: 'Tipos de dados inválidos fornecidos.' });
      }

      if (expressao.length > 255) {
        return res.status(400).json({ error: 'A expressão excede o limite de caracteres permitido.' });
      }

      const [novoHistorico] = await knex('historic')
        .insert({
          expression: expressao.trim(),
          result: resultado
        })
        .returning('*');

      return res.status(201).json(novoHistorico);
    } catch (error) {
      console.error('Erro na rota /calculate:', error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  },

  getHistory: async (req, res) => {
    try {

      const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
      const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
      const offset = (page - 1) * limit;

      const history = await knex('historic')
        .select('id', 'expression', 'result', 'created_at') // Seleção explícita de colunas em vez de '*'
        .orderBy('id', 'desc')
        .limit(limit)
        .offset(offset);

      return res.status(200).json(history);
    } catch (error) {
      console.error('Erro na rota /historic:', error);
      return res.status(500).json({ error: 'Erro ao buscar histórico' });
    }
  }
};

module.exports = CalculatorController;