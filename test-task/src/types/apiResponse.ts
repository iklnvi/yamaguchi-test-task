export type Jokes = {
  categories: string[];
  created_at: string;
  icon_url: string;
  url: string;
  value: string;
};

export type ApiResponse = {
  total: number;
  result: Jokes[];
};