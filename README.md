# ВАЖНО

При переносе бланка в проект бланк кладется в директорию /html/

Файл yarn.lock не переносится, а создается новый для проекта.

# Должно быть установлено

node.js - https://nodejs.org/ + npm

yarn - пакетный менеджер
см. доку https://yarnpkg.com/en/docs/install

*gulp v4*

```bash
$ npm install -g gulp
```

Проверьте версию gulp-cli

```bash
$ gulp -v
```

Если версия меньше 2.0.1, то надо обновиться

```bash
$ npm rm gulp-cli -g && npm i gulp-cli -g
```

# Как и где работаем
* рабочая директория: /html/src/
* результат development: /html/build/
* результат production: /public/assets/build/ или /local/templates/project_name/build/ или /bitrix/templates/project_name/build/ (пути для Bitrix)
* readme: /html/README.md

В проекте сборка фронтенда реализована с помощью gulp.
Пакетный менеджер yarn. Все зависимости устанавливаются через него.
Плагины для сборщика с флагом --dev в devDependencies, плагины для сайта без флага в dependencies

# Настройка окружения

## Git hooks

Находясь в директории /html/ копируем файлы и меняем права на папку .git/hooks/ выполняя команду в консоле с правами админа, либо с sudo.

```bash
cp -R install/src/hooks/ ../.git/ && chmod -R +x ../.git/hooks/
```

Для фронта пока интересен только 1 хук, это проверка на решенные конфликты.

Идет проверка наличия строк <<<<<<<, =======,>>>>>>> в файлах коммита. Если они найдены, то коммит признается сломанным и нужно править конфликты перед новой попыткой.

## Зависимости и запуск

В директории /html/
--ignore-engines временное решение из-за плагина по оптимизации катинок

```bash
yarn install --ignore-engines
gulp
```
Запустится сервер http://localhost:3000

## Сборка

Настроено 2 сборки, development и production.

**development** - дефолтная, запускается при выполнении команды gulp, при этом запускается сервер http://localhost:3000. Собирается в /html/build/.

**production** - запускается при выполнении команды gulp --env=prod. Собирается в /public/assets/build/ или /local/templates/project_name/build/ или /bitrix/templates/project_name/build/ (пути для Bitrix), этот путь можно и нужно поменять в /gulp/config.js.
Так же в production есть минификация стилей и js.

### Как работаем

**!!** Ни чего не меняем руками в папке build.

Если нужно внести какие-то изменения в верстку, то вся работа ведется в /html/src/ с development сборкой и проверкой на http://localhost:3000.
После этого запускаем production сборку и радуемся.
html естественно придется переносить руками т.к. в production он не собирается.

Если нужно добавить какой-то новый js без сборки, то это можно сделать, например в /bitrix/templates/template_name/js/ или в самом компоненте в script.js.

Также **можно запускать отдельно нужные таски сборки**, например:
```bash
gulp postcss
```
или
```bash
gulp postcss --env=prod
```

**Список всех тасков** (все таски, кроме html, watch и serve, доступны с параметром --env=prod):

Список всех тасков можно посмотреть так:

```bash
gulp --tasks
```

* gulp (запускает сервер со статикой http://localhost:3000, делает полную сборку и запускает watch)
* gulp build (делает полную сборку)
* gulp clean (удаляет содержимое папки build)
* gulp watch (мониторит все изменения и запускает нужные таски)
* gulp postcss
* gulp postcssInternal
* gulp postcssExternal
* gulp js
* gulp jsInternal
* gulp jsExternal
* gulp images
* gulp cleanSvgSprite
* gulp generateSvgSprite
* gulp copySvgSprite
* gulp fonts
* gulp html
* gulp serve

Вся работа (до и после интеграции) ведется в /html/src/

# Что есть

**lost** - сетка c обычными колонками, флексами и вафлями см. https://github.com/peterramsing/lost

!!Используем эту сетку, а не считаем все руками.

**px to rem** - автоматически заменяет пиксели на rem в размерах шрифтов

**precss** - включает поддержку возможностей SASS

**sassy-mixins** - позволяет использовать миксины как написанные на sass, так и postcss

**postcss-next** - позволяет использовать CSS4 http://cssnext.io/features/

**gulp-svg-sprites** - генерит svg спрайт из файлов /src/img/svg/sprite/*.svg см. https://github.com/shakyshane/gulp-svg-sprites

!Важно называть файлы правильно и осмысленно т.к. из имени файла бедет сгенерен id.

Использование:

```
<svg class="icon icon--load"><use xlink:href="#icon-load"></use></svg>
```

**postcss-inline-svg** - позволяет вставлять инлайн svg в css, к сожалению без возможности использовать transition см. https://github.com/TrySound/postcss-inline-svg

!!Внимание: использовать данный плагин только при сильной необходимости, в остальном использовать svg спрайт, иначе слиьно раздувает итоговый css файл.

использование в css:

```
background-image: svg-load('load.svg', fill=#f00);
```

**animate.css** - классы для разнообразных анимаций https://github.com/daneden/animate.css/

**gulp-file-include** - используется для "шаблонизации", позволяет импортировать один файл в другой с передачей каких-либо параметров см. https://www.npmjs.com/package/gulp-file-include

**browsersync** - вебсервер.
