# Настройка шрифта SuezOne-Regular

## ✅ Что сделано:

### 1. **Создан глобальный стиль:**
- Файл `src/styles/globalStyles.ts` с функцией `withGlobalFont()`
- Автоматически добавляет `fontFamily: 'SuezOne-Regular'` ко всем стилям

### 2. **Обновлены все экраны:**
- ✅ HomeScreen
- ✅ BattleScreen  
- ✅ ProfileScreen
- ✅ WorkoutScreen
- ✅ WorkoutStartScreen
- ✅ WorkoutCountdownScreen
- ✅ WorkoutTimerScreen
- ✅ WorkoutPausedScreen
- ✅ BattleSessionScreen
- ✅ OnboardingScreen
- ✅ OnboardingStoryScreen

### 3. **Обновлены все компоненты:**
- ✅ NeptuneCard
- ✅ Timer
- ✅ AppNavigator (навигация)

### 4. **Как это работает:**
```typescript
// Вместо обычного StyleSheet.create
const styles = StyleSheet.create({...});

// Теперь используется
const styles = withGlobalFont(StyleSheet.create({...}));
```

## 📝 Что нужно сделать:

### 1. **Добавить шрифт в проект:**
1. Поместите файл `SuezOne-Regular.ttf` в папку:
   ```
   android/app/src/main/assets/fonts/
   ios/LordofArenaOceans/Resources/
   ```

2. **Для iOS** - добавьте в `Info.plist`:
   ```xml
   <key>UIAppFonts</key>
   <array>
       <string>SuezOne-Regular.ttf</string>
   </array>
   ```

3. **Для Android** - создайте `react-native.config.js`:
   ```javascript
   module.exports = {
     project: {
       ios: {},
       android: {},
     },
     assets: ['./src/assets/fonts/'],
   };
   ```

4. **Запустите команду:**
   ```bash
   npx react-native-asset
   ```

### 2. **Перезапустите приложение:**
```bash
npx react-native run-ios
# или
npx react-native run-android
```

## 🎯 Результат:
Теперь **весь текст во всем приложении** будет использовать шрифт `SuezOne-Regular`!

Если шрифт не загрузится, приложение будет использовать системный шрифт по умолчанию.


