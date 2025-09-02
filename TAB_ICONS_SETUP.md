# Настройка иконок для Bottom Navigation

## Что изменено:
- ✅ Убраны названия экранов из bottom navigation (`tabBarShowLabel: false`)
- ✅ Заменены эмодзи на PNG изображения
- ✅ Добавлен fallback на эмодзи если изображения не найдены

## Как добавить свои иконки:

1. **Поместите PNG файлы в папку:**
   ```
   src/assets/tab-icons/
   ├── home.png      (24x24px)
   ├── battle.png    (24x24px)
   └── profile.png   (24x24px)
   ```

2. **Обновите пути в `src/navigation/AppNavigator.tsx`:**
   
   Найдите строки с `imageSource={null}` и замените на:
   ```typescript
   // Для Home
   imageSource={require('../assets/tab-icons/home.png')}
   
   // Для Battle  
   imageSource={require('../assets/tab-icons/battle.png')}
   
   // Для Profile
   imageSource={require('../assets/tab-icons/profile.png')}
   ```

3. **Рекомендации для иконок:**
   - Размер: 24x24 пикселя
   - Формат: PNG с прозрачным фоном
   - Стиль: Простые, контрастные иконки
   - Цвета: Золотые (#FFD700) или белые для лучшей видимости

## Текущее состояние:
- Пока что используются эмодзи как fallback
- Приложение работает без ошибок
- Готово к замене на PNG иконки

