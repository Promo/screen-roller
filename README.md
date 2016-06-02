# screen-roller
[![Build Status][travis-image]][travis-url]  
jQuery-плагин для полноэкранного просмотра слайдов с возможностью переключения в стандартый режим отображения сайта (для маленьких экранов).

## Подключение
```html
<script src="screen-roller.js"></script>
<link href="screen-roller.css" rel="stylesheet">
```

## Структура HTML
```html
<div style="width: 100%; height: 100%; position: absolute;">	
	<div class="roller">
		<div class="screen">Содержимое слайда</div>
		<div class="screen">Содержимое слайда</div>
		<div class="screen">Содержимое слайда</div>
	</div>
</div>
```

## Использование
```javascript
$('.roller').screenroller(
	{
		modules: {
			keyboard: {
				next: [83], prev: [87]
			},
			hash: true,
			'simple-page': {
				minWidth: 700,
				minHeight: 400
			}
		}
	}
);
```

## Параметры инициализации:
- `speed`: (по умолчанию `500`)  скорость анимации 
- `axis`: (по умолчанию `y`) направление анимации
- `modules`: список модулей, которые будут проинициализированы.
По умолчанию параметр `modules` имеет следующее вид:

```javascript
{
	'slide-animation': true,
    touch: {
    	mouseEmulate: true
    },
    wheel: true,
    keyboard: {
        next: [ 34, 40 ],
        prev: [ 33, 38 ],
        last: [ 35 ],
        first: [ 36 ]
    },
    hash: false,
    menu: false,
    'simple-page': false
}
```

## Модули

Вся функциональность плагина основана на его модулях. Каждый модуль отвечает за выполнение небольшой задачи (обработка событий колеса мыши, обработка тач-событий и т.д.).

### Инициализация модулей
Для инициализации модуля необходимо добавить его название (со значением `true` или `{}`, либо с набором опций) в список модулей при вызове метода `screenroller`.
Большинство модулей будут инициализироваться по умолчанию. Для отмены инициальзации необходимо указать значение `false` для имени модуля.

```javascript
$('.roller').screenroller(
	{
		modules: {
			keyboard: false, //отменяем инициализацию модуля (по умолчанию модуль инициализируется)
			hash: true, //инициализируем модуль (по умолчанию модель не инициализируется)
			'simple-page': { // инициализируем модуль c набором параметров 
				minWidth: 500,
				minHeight: 700
			}
		}
	}
);
```

### Методы и свойства модуля

У каждого модуля есть стандартный набор методов:
- `enable` - включить модуль
- `disable` - выключить модуль
- `destruct` - удалить модуль

А также стандартное свойство:
- `enabled` (`true` или `false`) - хранит переменную состояния включен или выключен

Некоторые модули могут именть дополнительные наборы методов и свойств

####Например
```javascript
var roller = $('.roller').screenroller().roller

console.log(roller.modules) // список всех проинециализированных модулей
console.log(roller.modules.keyboard) // содержимое модуля keyboard
console.log(roller.modules.keyboard.enabled) // true = модуль включен
console.log(roller.modules.keyboard.disable()) // выключаем модуль keyboard
console.log(roller.modules.keyboard.enabled) // false = модуль отключен
console.log(roller.modules.keyboard.enable()) // включаем  модуль keyboard
console.log(roller.modules.keyboard.destruct()) // удаляем  модуль keyboard undefined
console.log(roller.modules.keyboard) // undefined - модуль был удален

```


### slide-animation (по умолчанию включен)
Отвечает за анимированные переходы между слайдами


### simple-page (по умолчанию отключен)
Отвечает за переход в режим обычной страницы, когда размеры роллера становятся меньше заданных. У данного модуля есть свой
обработчик события `resize`, который включает и выключает модуль в зависимости от размеров роллера. 

#### Свойства:
- `watching`: хранит переменную состояния включен или выключен слушатель события resize

#### Методы:
- `offWatching`: отключает слушателя события `resize`
- `onWatching`: включает слушателя события `resize`

#### Опции инициализации:
- `minWidth`:(по умолчанию `700`) минимальная ширина при которой включается режим "simple-page"
- `minHeight`:(по умолчанию `700`) минимальная высота при которой включается режим "simple-page"


### keyboard (по умолчанию включен)
Отвечает за переключение слайдов при помощи клавиатуры

#### Опции инициализации:
- `next`: (по умолчанию `[ 34, 40 ]`) список кнопок для перехода к следующему слайду
- `prev`: (по умолчанию `[ 33, 38 ]`) список кнопок для перехода к предыдущему слайду
- `last`: (по умолчанию `[ 35 ]`) список кнопок для перехода к последнему слайду
- `first`: (по умолчанию `[ 36 ]`) список кнопок для перехода к первому слайду

### touch (по умолчанию включен)
Отвечает за обработку touch-событий
#### Опции инициализации:
- `mouseEmulate`: (по умолчанию `true`) эмуляция touch-событий при помощи мыши

### wheel (по умолчанию включен)
Отвечает за переключение слайдов при помощи колеса мыши


### hash (по умолчанию отключен)
Отвечает за работу hash-навигации. Для правильной работы необходимо к слайдам добавлять атрибут `data-hash`

#### Пример:
```html
<div style="width: 100%; height: 100%; position: absolute;">	
	<div class="roller">
		<div class="screen" data-hash="first">Содержимое слайда</div>
		<div class="screen" data-hash="second">Содержимое слайда</div>
		<div class="screen" data-hash="third">Содержимое слайда</div>
	</div>
</div>
```

#### Свойства:
- `screensHash`: список соответствия хеш-значений с позицией слайда


### menu (по умолчанию отключен)
Отвечает за переключение слайдов при помощи меню

#### Опции инициализации:
- `items`: jQuery-объект со списком элементов меню $('.menu li')

#### Пример:
```html
<div style="width: 100%; height: 100%; position: absolute;">	
	<div class="roller">
		<div class="screen">Содержимое слайда</div>
		<div class="screen">Содержимое слайда</div>
		<div class="screen">Содержимое слайда</div>
	</div>
</div>
<ul class="menu">
	<li>1</li>
	<li>2</li>
	<li>3</li>
</ul>

<script>
$('.roller').screenroller({
	modules: {
		menu: {
			items: $('.menu li')
		}
	}
});	
</script>
```


## События
В зависимости от включенных модулей проиницилизированный jQuery-объект может генерировать следующие события:
- `move-screen`: смена текущего слайда
- `module-has-turned-on`: включение модуля
- `touch-start`: внутренне событие touch-start
- `touch-move`: touch-move
- `touch-end`: touch-end
- `touch-cansel`: touch-cansel
- `restore-offset`: restore-offset (анимация к текущему слайду)
- `finished-animation`: окончание анимации 
- `request-move`: инициализация модулем смены текущего слайда

### Пример
```javascript
var $roller = $('.roller').screenroller();

$roller.on('move-screen', function(e, data) {
    console.log(data);
});

$roller.on('finished-animation', function(e, data) {
    console.log(data);
});
```

### Методы
- `moveTo(direction, [speed])`: скроллим к следующему слайду

### Пример
```javascript
var $roller = $('.roller').screenroller();

$roller.moveTo('next'); // скроллим к следующему слайду (скорость анимации 0)
$roller.moveTo('prev', 500); // скроллим к предыдущему слайду (скорость анимации 500)
$roller.moveTo(4, 100); // скроллим к слайду с индексом "4" (скорость анимации 100)

```

[travis-url]: http://travis-ci.org/Promo/screen-roller
[travis-image]: http://img.shields.io/travis/f0rmat1k/bemy.svg?branch=master&style=flat
[travis-image]: http://img.shields.io/travis/Promo/screen-roller.svg?branch=master&style=flat
