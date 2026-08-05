import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';

const API_BASE_URL = 'http://localhost:3000';

export default function App() {
  const [display, setDisplay] = useState('');
  const [historico, setHistorico] = useState([]);

  const [currentScreen, setCurrentScreen] = useState('calculator');

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/historic`);
      if (!response.ok) throw new Error('Erro ao buscar histórico.');
      const data = await response.json();
      setHistorico(data);
    } catch (error) {
      console.log('Erro ao carregar histórico:', error);
    }
  };

  const handleCalcular = async () => {
    if (!display.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: display }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Erro', data.error || 'Erro ao calcular.');
        return;
      }

      setDisplay(String(data.result));
      carregarHistorico();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    }
  };

  const copyToClipboard = async () => {
    if (!display) return;
    await Clipboard.setStringAsync(display);
    Alert.alert('Copiado!', 'Resultado copiado para a área de transferência.');
  };

  const formatarData = (data) => {
    if (!data) return '';
    return new Date(data).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  const adicionarDisplay = (valor) => setDisplay((anterior) => anterior + valor);
  const limparDisplay = () => setDisplay('');

  if (currentScreen === 'history') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.headerScreen}>
          <Text style={styles.screenTitle}>Your historic:</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentScreen('calculator')}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={historico}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <View style={styles.historyItemFull}>
              <Text style={styles.historyTextFull}>
                {item.expression} = {item.result}
              </Text>
              <Text style={styles.historyDateFull}>
                {formatarData(item.calculated_at)}
              </Text>
            </View>
          )}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            carregarHistorico();
            setCurrentScreen('history');
          }}
        >
          <Text style={styles.navButtonText}>View historic</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{display || '0'}</Text>
      </View>

      <View style={styles.keypadContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
            <Text style={styles.btnText}>Copy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearButton} onPress={limparDisplay}>
            <Text style={styles.btnText}>C</Text>
          </TouchableOpacity>
        </View>

        {['789+', '456-', '123X'].map((linha) => (
          <View style={styles.row} key={linha}>
            {linha.split('').map((char) => (
              <TouchableOpacity
                key={char}
                style={isNaN(char) ? styles.btnOp : styles.btnNum}
                onPress={() => adicionarDisplay(char)}
              >
                <Text style={isNaN(char) ? styles.btnOpText : styles.btnText}>
                  {char}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <View style={styles.row}>
          <TouchableOpacity style={styles.btnZero} onPress={() => adicionarDisplay('0')}>
            <Text style={styles.btnText}>0</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnOp} onPress={() => adicionarDisplay('/')}>
            <Text style={styles.btnOpText}>/</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnEqual} onPress={handleCalcular}>
            <Text style={styles.btnText}>=</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfdfd',
    paddingTop: 100,
    alignItems: 'center',
  },

  mainWrapper: {
    width: '100%',
    maxWidth: '100%',
    flex: 1,
    alignSelf: 'center',
    paddingHorizontal: 5,
  },

  topBar: {
    paddingHorizontal: 5,
    marginBottom: 10,
    alignItems: 'flex-start',
    width: '100%',
  },
  navButton: {
    backgroundColor: '#40b5e4',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8
  },
  navButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14
  },

  headerScreen: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    width: '100%',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333'
  },
  backButton: {
    backgroundColor: '#1d62b1',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: 'bold'
  },

  historyItemFull: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: '100%',
  },
  historyTextFull: {
    fontSize: 20,
    color: '#1c5ca5',
    fontWeight: '600'
  },
  historyDateFull: {
    fontSize: 12,
    color: '#777',
    marginTop: 4
  },

  displayContainer: {
    backgroundColor: '#FFF',
    padding: 24,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 20,
    width: '100%',
  },
  displayText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111'
  },

  keypadContainer: {
    padding: 10,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10
  },
  btnNum: {
    backgroundColor: '#007AFF',
    width: '22%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnOp: {
    backgroundColor: '#9ac7ec',
    width: '22%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnZero: {
    backgroundColor: '#007AFF',
    width: '47%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnEqual: {
    backgroundColor: '#1d62b1',
    width: '22%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  copyButton: {
    backgroundColor: '#313131',
    width: '47%',
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  clearButton: {
    backgroundColor: '#309bff',
    width: '47%',
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold'
  },
  btnOpText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold'
  }
});