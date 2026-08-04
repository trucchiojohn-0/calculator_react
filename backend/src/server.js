const express = require('express');
const cors = require('cors');
const calculatorController = require('../src/controllers/calculatorController.js'); 
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.post('/calculate', calculatorController.calculate);
app.get('/historic', calculatorController.getHistory);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});