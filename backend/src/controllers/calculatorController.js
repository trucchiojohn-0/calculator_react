const { evaluate } = require('mathjs');
const HistoricModel = require('../models/historicModel');

const CalculatorController = {
  async calculate(req, res) {
    try {
      const { expression } = req.body;

      if (!expression) {
        return res.status(400).json({ error: 'O campo "expression" é obrigatório.' });
      }

      const sanitizedExpression = String(expression).replace(/X/g, '*');

      let result;
      try {
        result = evaluate(sanitizedExpression);
      } catch (mathErr) {
        return res.status(400).json({ error: 'Expressão matemática inválida.' });
      }

      const history = await HistoricModel.create({
        expression: sanitizedExpression,
        result,
        status: 'SUCCESS',
      });

      return res.status(201).json(history);
    } catch (err) {
      console.error('[CalculatorController.calculate Error]:', err);
      return res.status(500).json({ error: 'Erro interno ao processar o cálculo.' });
    }
  },

  async getHistory(req, res) {
    try {
      const history = await HistoricModel.findAll();
      return res.status(200).json(history);
    } catch (err) {
      console.error('[CalculatorController.getHistory Error]:', err);
      return res.status(500).json({ error: 'Erro ao buscar o histórico.' });
    }
  },
};

module.exports = CalculatorController;