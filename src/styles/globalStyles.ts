import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  // Глобальные стили с SuezOne-Regular шрифтом
  text: {
    fontFamily: 'SuezOne-Regular',
  },
  title: {
    fontFamily: 'SuezOne-Regular',
    fontWeight: 'bold',
  },
  subtitle: {
    fontFamily: 'SuezOne-Regular',
    fontWeight: '600',
  },
  button: {
    fontFamily: 'SuezOne-Regular',
    fontWeight: '600',
  },
  label: {
    fontFamily: 'SuezOne-Regular',
    fontWeight: '500',
  },
});

// Функция для объединения стилей с глобальным шрифтом
export const withGlobalFont = (styles: any) => {
  const result: any = {};
  
  Object.keys(styles).forEach(key => {
    result[key] = {
      ...styles[key],
      fontFamily: 'SuezOne-Regular',
    };
  });
  
  return result;
};

// Базовые цвета для консистентности
export const colors = {
  oceanDeep: '#001122',
  oceanBlue: '#004466',
  skyBlue: '#87CEEB',
  gold: '#FFD700',
  white: '#FFFFFF',
  red: '#FF4444',
  green: '#00AA44',
};


