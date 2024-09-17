'use client';

import styles from './searchPage.module.css';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect, useState, useRef } from 'react';

type Joke = {
  categories: string[];
  created_at: string;
  icon_url: string;
  url: string;
  value: string;
};

type ApiResponse = {
  total: number;
  result: Joke[];
};

export default function SearchPage(): JSX.Element {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (query.length > 4) {
      setLoading(true);

      // Очистка предыдущего таймера
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Установка нового таймера
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
      }, 500); // Задержка 500 мс
    } else {
      setJokes([]);
    }
  }, [query]);

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
      {loading && <p>Loading...</p>}
      {jokes.length > 0 ? (
        <div className={styles.cardContainer}>
          {jokes.map((joke) => (
            <Card key={joke.url} className={styles.card}>
              <CardHeader>
                <CardTitle className={styles.cardTitle}>Я картОЧКА</CardTitle>
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
        </div>
      ) : (
        !loading && <h1>No jokes</h1>
      )}
    </>
  );
}
