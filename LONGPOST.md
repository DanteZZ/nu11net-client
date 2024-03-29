# H4CK-IT = Nu11Net - история создания

Этот лонгпост повествует об истории создания данного проекта, Я постараюсь объяснить всё, к чему мы пришли и с чего всё начиналось. Так что стоит запостись чайком и печеньками, (я с вашего позволения зальюсь пивом) и мы начнём.
## Часть 0. Предпосылки

Шёл 2015 год, я учился на втором курсе, тогда я ещё яро гамал в майнкрафт и для меня он был максимально необычным сэндбокс-проектом. Тогда то один мой одногруппник показал мне игру HackNet ([тык](https://store.steampowered.com/app/365450/Hacknet/)). Это прикольный teminal-based симулятор хацкера с возможностью манипулировать файлами на ПК, работать с портами и прочим. Игра крутая, но имеет свои ограничения и странности. Для меня было удивительно, что игра про сети не умеет в онлайн, и нельзя подключиться к другу и удалить у него пару системных файлов. Да и нет возможности писать скрипты для автоматизации процессов (в то время не было, сейчас не знаю, может добавили).

На тот момент я уже знал что такое БД, как они строятся и эксплуатируются, кодил под PHP5.6, вполне знал HTML+CSS, и небольшую базу по JavaScript ES5 (в основном юзал JQuery, он был устаревшем уже на тот момент, но использовался везде).

Собственно тогда-то я и решил заняться разработкой собственного terminal-based симулятора, основанной не на сценарных заготовленных ситуациях, а реальный онлайн sandbox, с элементами программирования. Тут то и начинается путь данного проекта под техническим названием **H4CK-IT**.

## Часть 1. От идеи до прототипа

Я начал играться с возможностями JavaScript. На тот момент я не разрабатывал большой логики, в JS даже не было толковой инкапсуляции, т.к. кодил я по стандартам es5, (хотя es6 уже был). Я не был в курсе за классы, let/const, что усложняло разработку. Но была идея.

Идея заключалась в максимальной свободе действий. По факту игра должна была стать операционной системой в браузере, с файлами которые и выстраивали логику её работы. Я не могу назвать эти файлы системными, т.к. они затрагивали не только работу системы, но и могли отправлять запросы на игровой сервер, что немного ломало 4 стену. Но на тот момент я не парился. Я хотел сделать хоть что-то.

Для начала я поднял PHP сервер на локалке, и начал творить. Первостепенной задачей для меня было написать терминал с командами. Я поднял базу, настроил несколько команд для работы с файлами. И да, файлы игроков находились на сервере, отчего некоторые запросы обрабатывались не так быстро как хотелось бы. Но это предавало своего шарма для игры.

После того как я смог сделать функцию на которую просто отправляются команды с параметрами, и это всё обрабатывалось на сервере и отдавалось в ответ, я понял что из этого может что-то вырасти.

Я в течение месяца пилил данный проект, даже нашёл бесплатный домен h4ck-it.tk, на котором игра весела ещё пол года после того как я опубликовал сбор средств на бумстартер.

Игра приобрела интерфейс состоящий из 4 блоков. Блок с открытым приложением, карта с точками, связями с компами к которым ты подключался (точки выдавались рандомно при регистрации) и ip адресами.

 Кстати, на тот момент я не шарил за формирование ipv4 адресов, и себе я выдал адрес: 777.777.777.777. И меня всегда смущало, что никто не использовал этот адрес в интернете :D. Гуглить было лень.

Система обзавелась исполняемыми файлами написанными на чистом JS, Я написал несколько графических программ: Файловый менеджер, Редактор кода, FTP Client/Server и Меню выбора программ.

 Порты у игроков были статические. Был набор определённых портов, которые предоставляли функции. Ничего поменять было невозможно ибо это была чисто имитация. За всё время разработки этой игры было создано несколько портов: 21, 25, 80 (FTP, SMTP, HTTP), причём SMTP так и не был реализован.

## Часть 2. Первый релиз

![SonyaOS](https://i.imgur.com/MwgNucB.png)

Релизом это назвать сложно, но игра стала доступной для тех кого я знал. Собралась небольшая компашка которым я объяснял что и как работает. Можно было создавать свои программы, можно было подключаться по FTP к другому человеку если у него он включен. Вытащить пароль нельзя было, потому что его не существовало и я начал работать над этим.

Тогда я решил заморочиться с методом взлома. Ничего не придумав лучше, я создал программу, которая при запросе, получала шифр из символов, которые были похожи на буквы латинского алфавита, но у них были всякие закарючки. И в этом месиве необходимо было найти настоящие латинские символы и собрать пароль для входа. Но, для того чтобы получить этот код, нужно было точно знать адрес игрока и логин. Пароль генерился на стороне сервера и обновлялся раз в 5 минут, по этому нужно было работать быстро.

![Пример поиска символов](https://i.imgur.com/KjNg5oB.png)

Как итог, получилась крайне нереалистичная, но интересная игровая механика, которая ломалась при нажатии **CTRL+F**. Но даже так необходимо было понять какой символ настоящий и понять есть ли он в пароле.

Мои знакомые игрались с возможностями системы. Проги не писали, но понапихать фоновых картинок, поменять местами блоки с картой и терминалом, порисовать ASCII шедевры было милым делом.

Через неделю багфиксов и прочего дерьма стало скучно, и я решил пойти дальше. Я хотел реализовать многозадачность, оконность в системе, а так же возможность поднимать веб сервера внутри игры.

## Часть 3. SonyaOS

**SonyaOS** - название операционки внутри игры, и я решил взяться за доработку многозадачности. Мне пришлось перелопатить кучу кода, и переписать существующие программы, чтобы они правильно рисовали интерфейс внутри блоков. Напомню что блок интерфейса был один, в котором были блоки запущенных программ, они занимали всё пространство, и только при переключении должны были отображаться.

Я сделал полоску с иконками запущенного софта, и теперь системой стало пользоваться намного удобнее. Но было одно условие. Программы работали в общей области видимости. И все переменные нужно было называть уникально, иначе можно было одной программой поломать другую. Побороть у меня это не получалось. Это сейчас я понимаю что к чему, а на тот момент я просто забил.

Дальше я решил сделать веб-браузер и HTTP сервер. HTTP сервер просто открывал уже существующий 80 порт, и вписывал в базу путь к файлам на игровом сервере. Так же пришлось написать программу, которая регистрировала домены внутри игры. О каких то DNS речи не шло, чистая имитация работы реального браузера, но это работало.

Первым моим сайтом стал официальный сайт SonyaOS, Там я решил описать как она работает и вести туториалы.
![SonyaOS вебсайт](https://i.imgur.com/cfEztzi.png)

Так же, встал вопрос удаления системных файлов, ведь при удалении система не запускалась. Я решил поднять внутриигровой репозиторий, который работал из "BIOS", можно было подтянуть свежую версию. Никаких портов, только имитация. Туда же я подтянул программы и темы.

 Темы были созданы ещё в самом начале разработки, но теперь их можно было спокойно скачать и установить себе.

## Часть 4. BoomStarter и Смерть H4CK-IT

На тот момент я просто игрался с системой. К сожалению скрина не нашёл, но я успел сделать графическую оболочку аля Win95, и загрузил в репу под названием **OknaOS**. Программы теперь были в разных окнах, старая менюшка улетела вниз и в принципе оставалось только сделать ярлыки на рабочий стол.

Я написал небольшой чат, и даже игру где надо было лопать кругляши в виде лица Рофляна. С каждой строчкой кода я понимал что нужно подтягивать ещё игроков-разрабов, т.к. в одного эту телегу было трудно тянуть.

Я решил зайти на BoomStarter со своим проектом. Оформил как подобает, по приколу вписал что нам нужно 25к на то, чтобы держать серваки и даже сделал [трейлер](https://www.youtube.com/watch?v=THrr4V3Wd90) к игре:
[

![H4CK-IT Boomstarter Trailer](https://i.imgur.com/YcC4Zx7.png)](https://www.youtube.com/watch?v=THrr4V3Wd90 "H4CK-IT Boomstarter Trailer")

Собственно, на том проект и начал загибаться. У меня не было времени тянуть его, куча багов и непрофессиональный подход загубили идею, а выполнение пользовательского кода на сервере уничтожало понятие безопасности. 

Через какое то время, я наткнулся в интернете на шрифт VGA, тот самый шрифт с которым по дефолту работает большинство BIOS:

![VGA font](https://upload.wikimedia.org/wikipedia/commons/6/6d/Codepage-737.png)

Я написал небольшое меню аля BIOS с этим шрифтом, мне это так понравилось, что я решил переписать игру. Но это произойдёт только через 5 лет....

## Часть 5. Спустя 5 лет

Начало 2021 года. За эти 5 лет я успел отучиться, открыть свою веб-студию и поднять несколько проектов включая собственную CRM. В это же время я изучил паттерны ООП, Узнал что такое классы и все фичи es6 отскакивали от зубов. Так ещё и подъехал NodeJS и NWJS. И мне напомнили о проекте который заживо был похоронен. Я нашёл исходники и пустил ностальгическую слезу.

В этот момент я решил поиграться, и попробовать планку выше. Что если система будет иметь интерфейсы с командами и ОС будет реально работать с карточками, писать под неё драйвера и в принципе симуляция будет работать на низком уровне.

И я начал экспериментировать. Откопал тот самый шрифт, развернул NWJS и начал думать, как и что реализовать. Я понимал, что хранение чужих файлов и выполнение кода на стороне сервера, слишком затратно и небезопасно. Да и код необходимо было выполнять так, чтобы он ничего лишнего не затрагивал, чтобы у меня был только синтаксис JS, не имеющий доступ к файлам компа, и самое главное модулям NodeJS, так как библиотека FS, могла вытащить слишком много инфы.

По началу я даже думал написать сой ЯП, на основе Bison. Начал изучать что такое АСГ, лексеры, парсеры и как они работают. Но осознав всю тщетность бытия я решил просто урезать JS до необходимых мне команд оставив только синтаксис и функции написанные мной.

Так я погрузился в работу с JS Eval и VM/VM2. Это оказалось идеальным решением.
Тогда-то и началась работа.
## Часть 6. Предвестники Nu11Net

Разработка велась под старым названием H4CK-IT. Я написал меню в стиле BIOS, и понял что это выглядит слишком круто (на фото последняя версия данного меню)

![NIOS](https://i.imgur.com/oRMe3Of.png)

Далее я начал писать интерфейсы. Для начала я сделал общие классы под интерфейсы со своей логикой для подключения и регистрации и подумал...
А ПОЧЕМУ БЫ НЕ ЗАРЕГАТЬ ОТДЕЛЬНЫЕ УСТРОЙСТВА???

И тут понеслась. Получалось, что я могу регать устройства (ПК, Роутер), на них регать интерфейсы (STORAGE (HDD/SSD), ETHERNET, DISPLAY...) и описывать логику работы с ними. Тогда у игрока будет возможность иметь несколько компов, и они будут выполнять свою работу вообще не касаясь друг друга.

Но была одна проблема. Т.к. всё пишется на JS, и выполняется хоть и ограниченно, но обычный `while true` повесит игру. Надо было как то отделить выполнение кода устройств.

Решение напросилось само. Выполнять пользовательский код в отдельных процессах. Отдельный процесс на каждое устройство которому это требуется. Но проблема в том, что отправлять функции и классы через процессы невозможно, только данные. И я начал писать систему команд для интерфейсов. Интерфейсы регали свои команды, устройство запускает отдельный процесс, и выполняет необходимый код для запуска. В нашем случае это аналог EFI файла на бутуемом STORAGE.

 STORAGE кстати, работает не прямым сохранением файлов. Он хеширует его название, добавляет в маппинг и только по маппингу можно получить его. Если маппинга нет, то и файлов в системе тоже. Это решает проблемы файлов полученных незаконным путём. Да даже если и получат, они лежат на стороне клиента, это его ответственность.
 
## Часть 7. Ядро

Хоть и прошлая часть коротка, на неё я потратил больше всего сил в то время. Необходимо было разработать свою логику работы с интерфейсами, командами и чтобы всё выполнялось без проблем.

Есть у нас есть устройство с интерфейсами, которое может выполнять код, то пора и задуматься о какой-никакой, а всё-таки операционке.

Я начал думать. Интерфейс DISPLAY работал медленно, т.к. изображение отправлялось между процессами медленно и больше 24 кадров выдавить было трудно, да и в случае отрисовки нескольких приложений в будущем, были бы огромные просадки FPS. Тогда-то я и наткнулся на WebView. Оказалось что NodeJS, имел аналог iframe, который работает в отдельном процессе, что убивало двух зайцев. Я переписал систему команд с отправкой на WebView, и теперь отправка изображений была не нужна, а значит всё шло в 60фпс (это максимум отрисовки браузера, если что). Однако это не решало проблему отрисовки большого количества графики.

Тогда я задумался, а что если схитрить и вместо Canvas и WebGL не использовать обычные html блоки. Они быстро рисуются, у них есть возможность отслеживания нажатия и их можно превратить во что угодно. Решено. Буду делать именно так.

Я написал небольшую библиотеку для работы с DISPLAY, отрисовал пару квадратов, и всё окей. Со стороны кода выглядело это так, будто я работаю не с HTML DOM элементами, а с элементами, которые я рисую исключительно функциями.

Примерно в это время я сделал базовую графику игры. Она отрисовывала все устройства и подключения. Забыл кстати упомянуть, что помимо устройств были ещё и кабели, которые подключаются к портам. На данный момент есть только Ethernet (витая пара) и COM. По этому интерфейсы могут отправлять сигналы по ним к другим интерфейсам. Им плевать кто на конце провода. По этому это даёт большие возможности для построения виртуальных сетей.

![Nu11Net Home](https://i.imgur.com/Ks5cQQQ.png)

Дальше я начал писать ядро. Оно должно было понимать какой код выполнить и как ограничивать выполнение отдельных программ. Я написал небольшой SHELL и CLI. Написал систему процессов. CLI - был исполняемым файлом, он подключался к SHELL, SHELL давал ему возможность выполнять свои действия и давал доступ к отрисовке графики. Так появился настоящий терминал.

Дальше по накатанной. Я написал основные программы для работы с файлами (ls, cd, touch, mkdir, rm ...). И встал вопрос о разрешении на отрисовку графики для других программ.

Тогда я снова перелопатил библиотеку работы с графикой, привязал её к DISPLAY интерфейсу, и отдавал эти команды прямо в ядро. Ядро давало доступ ко всему экрану SHELL, а SHELL уже полноправно давал эти доступы CLI терминалу. Терминал в свою очередь, в данном ему SHELL графическому пространству отрисовывал свои блоки. И к этим блокам он может дать доступ другим программам. В чём логика? 

Логика в том, что после CLI у меня должна быть графическая оболочка. Она сможет отрисовывать окна (блоки) и отдавать это графическое пространство программам. И программы не смогут залезть без разрешения туда, куда не нужно, и изнасиловать другие программы. Профит.

![enter image description here](https://i.imgur.com/u2Xphul.png)

И тут мы подходим к последним частям. Скоро конец, надеюсь чай вы ещё не допили.

## Часть 8. Процессы и сети

Я взялся за проект серьёзно. Структуру программ заменил Process Manager, который умеет в STD_IN/STD_OUT/STD_ERR. Программирование под виртуальную операционную систему ничем не отличалось от программирования под обычную систему. Те же `process.exit()`, возможность отправлять сигналы через STD, появился top, kill.

На тот момент я уже имел реальную операционку которая работает по общедоступным правилам unix систем, только вместо карточек и устройств у нас интерфейсы. Прямого управления ими нет, только через команды. Если пользователь запустил `while true`, система зависает, но игра нет. Перезагрузи внутреигровое устройство и всё наладится.

Я начал развивать операционку. Основным этапом стала разработка демона (system_daemon). Он запускал необходимые исполняемые файлы (сервисы), терминал перешёл в разряд сервисов. После этого я написал сервис Network и необходимые библиотеки для работы с интерфейсом Ethernet. И дальше по накатанной, IP адреса, программа типа ifconfig, логика DHCP и LO. Кстати LO (LoopBack) тоже реализован в виде сервиса, он эмулирует реальный порт, так что костылить не пришлось. Он имеет все основные возможности реального ethernet порта.

 Кстати для проверки DHCP, мне пришлось заспавнить ещё один комп и написать на нём DHCP сервер который на необходимый запрос отправлял необходимую инфу об адресе. По факту создал локальную сеть. А для проверки работоспособности написал небольшой UDP чат, который отправлял на нужный IP и порт текст, а так же прослушивал приходящие сообщения.

![enter image description here](https://i.imgur.com/Gnd7c7y.png)
![enter image description here](https://i.imgur.com/NQF1lQg.png)
После этого встал вопрос о создании игрового сервера. У нас ведь сетевая игра.

## Часть 9. Игровой сервер
Игровой сервер должен был быть максимально простым. Его задача, эмулировать общий свитч провайдера. Так же игровой сервер должен был эмулировать свои сервера, по типу DHCP, DNS. А самое главное, он должен был давать возможность авторизоваться на сервере и отдать список устройств, интерфейсов к ним и initial файлы STORAGE'ов.

После нескольких дней сервер был поднят, можно было регистрироваться, авторизоваться, принимать пакеты. Но откуда принимать пакеты?

![Регистрация](https://i.imgur.com/naNQ8N7.png)

В игре я создал отдельное устройство. "Интернет-розетка". Просто Ethernet розетка в стене, к которой подключаются другие устройства. Это устройство принимало входящие к нему пакеты и просто слало на игровой сервер, и принимало пакеты от сервера.

Теперь сервер может перенаправлять пакеты. Сервер смотрел куда пакеты адресованы и определял, по какому адресу и порту летят пакеты. Внутренние сервера (DHCP, DNS) являются отдельными скриптами, которые регистрируют своего слушателя на адресе и порту, и могут прослушивать как абсолютно все пакеты летящие на порт (без указания адреса, как DHCP), так и по адресу и порту (Обычные серваки).

![ip](https://i.imgur.com/nZuRM7v.png)

Подтянул калькулятор MAC, адреса, для ограничения видимости адресов в саму игру и сервер, всё начало набирать обороты.

После этого в моей команде появилось ещё 2 человека, и теперь нас стало трое. Но об этом позже...

Мы стали думать о переносных носителях (CD, USB), и о том что файлы которые прилетают на сервер при авторизации, это неверный подход. Тогда мы решили добавить в маппинг STORAGE девайсов, изначальный тип маппинга. Пока это OS и CLEAN. В одноименных папках на сервере лежать изначальные файлы, которые, при отсутствии маппинга у игроков должны были подтягиваться.

Реализовано это было на стороне интерфейса, дабы не ломать четвёртую стену шильдиками по типу: "Загрузка файлов...". У STORAGE интерфейса появилась команда INITIALIZE. Которая проверяла на "целостность" файлов, и в случае чего подгружала их с сервера. По факту же она проверяет создан ли маппинг, и если нет, подгружает его со всеми файлами с сервера. И выглядит круто, и проблем никаких нет, и плюс к тому же люди которые будут держать собственные игровые сервера, смогут настраивать файлы которые будут изначально на устройствах пользователей.

![enter image description here](https://i.imgur.com/HtkbWZd.png)

Собственно дальше появились USB порты и носители. Носители работают по аналогии с устройствами, у них есть интерфейсы, в нашем случае STORAGE. Носитель можно подключить к порту и комп обязан инициализировать его и тогда будет доступ к файлам. Но что-то я углубился...

## Часть 10. Настоящий Nu11Net

Встал вопрос в команде разработки и толковом версионировании. Надо - значит надо. И так в команду подтянулись люди, которые следят за этим проектом с самой первой версии. 3 человека: Разраб (я), Тестер и DevOps.

Пришлось перелопатить структуру проекта, сделать компиляцию под несколько ОС, включая автоматическую сборку .DEB пакетов. На данный момент разработка и релизы только в радость.

Подняли Jenkins, проект переехал с GitHub на GitLab. Да, сейчас вы читаете это не GitHub.
