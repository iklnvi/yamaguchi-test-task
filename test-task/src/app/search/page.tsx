'use client';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import styles from './searchPage.module.css';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Функция для получения шуток из API
const fetchJokes = async (query: string) => {
  const response = await fetch(
    `https://api.chucknorris.io/jokes/search?query=${query}`
  );
  if (!response.ok) {
    throw new Error('Ошибка при загрузке шуток');
  }
  return response.json();
};

export default function SearchPage(): JSX.Element {
  const [query, setQuery] = useState<string>('');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['jokes', query],
    queryFn: () => fetchJokes(query),
    enabled: query.length >= 4, // Запускать запрос только если длина строки >= 4
    refetchOnWindowFocus: false, // Отключаем повторное получение данных при фокусе окна
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <>
      <h1 className={styles.searchPageTitle}>This is search page</h1>
      <Input
        placeholder='Введите в меня что-нибудь'
        className={styles.customInput}
        value={query}
        onChange={handleInputChange}
      />
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {error?.message}</p>}

      {data?.result?.length > 0 ? (
        <div className={styles.cardContainer}>
          {data.result.map((joke) => (
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
                <CardContent>
                  Категория: {joke.categories[0] || 'Нет категории'}
                </CardContent>
                <CardContent>
                  Дата: {new Date(joke.created_at).toLocaleDateString()}
                </CardContent>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        !isLoading && <h1 className={styles.totalCount}>No jokes</h1>
      )}
    </>
  );
}
