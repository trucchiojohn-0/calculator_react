import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, StatusBar, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import styleCalculator from './styles/styleCalculator.js'

const API_BASE_URL = 'http://192.168.1.50:3000';

export default function App() {
  const [display, setDisplay] = useState('');
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/historico`);
      if (response.ok) {
        const data = await response.json();
        setHistorico(data);
      }
    } catch (error) {
      console.log('Erro ao carregar histórico:', error);
    }
  };

  const handleCalcular = async () => {
    if (!display) return;

    try {
      const response = await fetch(`${API_BASE_URL}/calcular`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ expressao: display })
      });

      const data = await response.json();

      if (response.ok && data.status === 'sucesso') {
        setDisplay(String(data.resultado));
        carregarHistorico();
      } else {
        Alert.alert('Erro', data.mensagem || 'Erro ao realizar cálculo.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
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
    return d.toLocaleString('en-US');
  };

  const renderHistoricoItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyText}>
        {item.expression}={item.result}
      </Text>
      <Text style={styles.historyDate}>{formatarData(item.calculated_at)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>History</Text>
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
