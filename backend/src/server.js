const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./db'); 

const CalculatorController = require('./controllers/calculatorController');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/calculate', CalculatorController.calculate);  
app.get('/historic', CalculatorController.getHistory); 

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});