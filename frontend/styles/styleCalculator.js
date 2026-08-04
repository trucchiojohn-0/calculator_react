import { StyleSheet } from 'react-native';

const styleCalculator = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    justifyContent: 'space-between',
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