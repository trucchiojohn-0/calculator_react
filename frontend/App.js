import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, StatusBar, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';

const API_BASE_URL = 'http://192.168.1.50:3000';

export default function App() {
  const [display, setDisplay] = useState('');
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    carregarHistorico();
  }, []);

  // Busca o histórico de cálculos no backend
  const carregarHistorico = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/historic`);
      if (response.ok) {
        const data = await response.json();
        setHistorico(data);
      }
    } catch (error) {
      console.log('Erro ao carregar histórico:', error);
    }
  };

  // Envia a expressão e o resultado para a API
  const handleCalcular = async () => {
    if (!display) return;

    try {
      // Trata a multiplicação 'X' para '*' no momento de avaliar a expressão
      const expressaoTratada = display.replace(/X/g, '*');
      
      // Realiza o cálculo localmente para enviar ao backend refatorado
      // eslint-disable-next-line no-eval
      const resultadoCalculado = Function(`'use strict'; return (${expressaoTratada})`)();

      if (isNaN(resultadoCalculado) || !isFinite(resultadoCalculado)) {
        Alert.alert('Erro', 'Expressão matemática inválida.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          expressao: display,
          resultado: resultadoCalculado
        })
      });

      const data = await response.json();

      if (response.ok) {
        setDisplay(String(data.result));
        carregarHistorico();
      } else {
        Alert.alert('Erro', data.error || 'Erro ao realizar cálculo.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor ou a expressão é inválida.');
    }
  };

  const copyToClipboard = async () => {
    if (display) {
      await Clipboard.setStringAsync(display);
      Alert.alert('Copiado!', 'Valor copiado para a área de transferência.');
    }
  };

  const handlePress = (valor) => {
    setDisplay((prev) => prev + valor);
  };

  const clearDisplay = () => {
    setDisplay('');
  };

  const formatarData = (isoDate) => {
    if (!isoDate) return '';
    const d = new Date(isoDate);
    return d.toLocaleDateString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderHistoricoItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyText}>
        {item.expression} = {item.result}
      </Text>
      <Text style={styles.historyDate}>{formatarData(item.created_at)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Histórico</Text>
        <FlatList
          data={historico}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderHistoricoItem}
          contentContainerStyle={styles.historyList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{display || '0'}</Text>
      </View>

      <View style={styles.keypadContainer}>
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
            <Text style={styles.copyButtonText}>Copy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearButton} onPress={clearDisplay}>
            <Text style={styles.clearButtonText}>C</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.btnNum} onPress={() => handlePress('7')}><Text style={styles.btnText}>7</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnNum} onPress={() => handlePress('8')}><Text style={styles.btnText}>8</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnNum} onPress={() => handlePress('9')}><Text style={styles.btnText}>9</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnOp} onPress={() => handlePress('+')}><Text style={styles.btnOpText}>+</Text></TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.btnNum} onPress={() => handlePress('4')}><Text style={styles.btnText}>4</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnNum} onPress={() => handlePress('5')}><Text style={styles.btnText}>5</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnNum} onPress={() => handlePress('6')}><Text style={styles.btnText}>6</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnOp} onPress={() => handlePress('-')}><Text style={styles.btnOpText}>-</Text></TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.btnNum} onPress={() => handlePress('1')}><Text style={styles.btnText}>1</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnNum} onPress={() => handlePress('2')}><Text style={styles.btnText}>2</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnNum} onPress={() => handlePress('3')}><Text style={styles.btnText}>3</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnOp} onPress={() => handlePress('X')}><Text style={styles.btnOpText}>X</Text></TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.btnZero} onPress={() => handlePress('0')}><Text style={styles.btnText}>0</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnOp} onPress={() => handlePress('/')}><Text style={styles.btnOpText}>/</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnEqual} onPress={handleCalcular}><Text style={styles.btnEqualText}>=</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 40,
  },
  historyContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  historyList: {
    paddingBottom: 10,
  },
  historyItem: {
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  historyText: {
    fontSize: 16,
    color: '#2b2b80',
    fontWeight: '600',
  },
  historyDate: {
    fontSize: 12,
    color: '#777',
  },
  displayContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    marginHorizontal: 15,
    borderRadius: 8,
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  displayText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
  },
  keypadContainer: {
    padding: 15,
  },
  topRow: {
    flexDirection: 'row',
    justify: 'space-between',
    marginBottom: 10,
  },
  copyButton: {
    backgroundColor: '#8E8E93',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  copyButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    width: 45,
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  btnNum: {
    backgroundColor: '#007AFF',
    width: '22%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  btnOp: {
    backgroundColor: '#E5E5EA',
    width: '22%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnOpText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  btnZero: {
    backgroundColor: '#007AFF',
    width: '47%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnEqual: {
    backgroundColor: '#34C759',
    width: '22%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnEqualText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  }
});