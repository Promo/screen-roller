# screen-roller

jQuery-плагин для полноэкранного просмотра слайдов с возможностью переключения в стандартый режим отображения сайта (для маленьких экранов).

## Подключение
```html
<script src="screen-roller.js"></script>
<link href="screen-roller.css" rel="stylesheet">
```

## Структура HTML
```html
<div class="roller">
	<div class="screen">Содержимое слайда</div>
	<div class="screen">Содержимое слайда</div>
	<div class="screen">Содержимое слайда</div>
</div>
```

## Использование
```javascript
  var roller = $('.roller').roller({
      showScrollBar: true,
      startScreen: '2',
      beforeMove: function(index) {
        console.log('beforeMove callback');
      }
  });

  roller.moveTo('down');
```

## API

### Параметры инициализации
- `baseClass`: (default `roller`) имя класса для блока-обертки слайдов
- `screenClass`: (default `screen`) имя класса слайдов внутри обертки
- `screenPageClass`: (default `screen-page`) имя класса для режима полноэкранного отображения слайдов
- `solidPageClass`: (default `solid-page`) имя класса для стандартного режима отображения сайта
- `minHeight`: (default `500`) минимальная высота окна браузера, при которой включен полноэкранный режим отображения слайдов
- `minWidth`: (default `500`) минимальная ширина окна браузера, при которой включен полноэкранный режим отображения слайдов
- `animationSpeed`: (default `500`) скорость анимации слайдов
- `startScreen`: (default `0`)  индекс слайда при инициализации
- `showScrollBar`: (default `false`) определяет наличие скроллбара для страницы
- `beforeMove`: (callback) срабатывает до начала анимации переключения слайдов в режиме полноэкранного отображения слайдов
- `afterMove`: (callback) срабатывает по окончании анимации переключения слайдов в режиме полноэкранного отображения слайдов
- `changeScreen`: (callback) срабатывает при смене текущего слайда в стандартном режиме отображения сайта
- `onScreenMod`: (callback) срабатывает при переключении в режим полноэкранного отображения слайдов
- `onSolidMod`: (callback) срабатывает при переключении в стандартный режим отображения сайта

### Методы
- `moveTo(direction, [speed])`: скроллим к следующему слайду

```javascript
//Скроллим на один слайд вниз 
roller.moveTo('down');
```

```javascript
//Скроллим на один слайд вверх со скоростью в 1 секунду 
roller.moveTo('up', 1000);
```

```javascript
//Мгновенно скроллим к 5-у слайду
roller.moveTo(4, 0);
```









