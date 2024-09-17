# Тестовое для Yamaguchi

## Требования

<ol><h3>Функционал</h3>
    <li>Запрос идет по роуту search</li>
    <li>Запрос отправляется от 4 символов</li>
    <li>Запросы повторно не отправляются на одинаковые query</li>
    <li>спользовать react-query обязательно, redux по желанию (например для total count)</li>
    <li>Использование NextJS (pages router) желательно</li>
</ol>

## Этапы выполнения

1. Инициализаци проекта

```
npx create-next-app@latest
```

2. Установка необходимых зависимостей

```
npm i
```

### Базовая верстка страницы

Добавлен ui компонент инпута поиска

```
npx shadcn@latest add input
```

Добавлен ui компонент карточки

```
npx shadcn@latest add card
```

### Протипизорован ответ API

Типизация объекта шутки внутри ответа API

```
type Joke = {
  categories: string[];
  created_at: string;
  icon_url: string;
  url: string;
  value: string;
};
```

Типизация всего ответа API

```
type ApiResponse = {
  total: number;
  result: Joke[];
};
```

### Хранение данных

Созданы состояния для хранения ответа API и контролируемого инпута

Ответ API

```
const [jokes, setJokes] = useState<Joke[]>([]);
```

Контролируемый инпут

```
const [query, setQuery] = useState<string>('');
```

Состояние во время обработки запроса

```
  const [loading, setLoading] = useState<boolean>(false);
```

### Запрос данных с API

Проверка на то, что в строке для поиска больше 4 символом

```
  useEffect(() => {
    if (query.length >= 4) {
      setLoading(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
```

Запрос к API с debounce поиском (в зависимости от того пустая страка или нет обновляется состояние на шутки)

```
timeoutRef.current = setTimeout(() => {
        fetch(`https://api.chucknorris.io/jokes/search?query=${query}`)
          .then((response) => response.json())
          .then((data: ApiResponse) => {
            setJokes(data.result);
          })
          .catch((err) => {
            console.error('Ошибка при получении шуток:', err);
          })
          .finally(() => {
            setLoading(false);
          });
      }, 500);
    } else {
      setJokes([]);
    }
  }, [query]);
```

Изменение состояние инпута

```
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };
```

Размап карточек полученных в ответе от API

```
{jokes.length > 0 ? (
        <div className={styles.cardContainer}>
          {jokes.map((joke) => (
            <Card key={joke.url} className={styles.card}>
              <CardHeader>
                <CardTitle className={styles.cardTitle}>Yamaguchi</CardTitle>
                <CardDescription className={styles.cardDescription}>
                  Шутка от Чака Нориса
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Шутка: {joke.value}</p>
              </CardContent>
              <CardFooter className={styles.cardFooterContent}>
                <CardContent>Категория: {joke.categories[0] || 'Нет категории'}</CardContent>
                <CardContent>Дата: {new Date(joke.created_at).toLocaleDateString()}</CardContent>
              </CardFooter>
            </Card>
          ))}
```
