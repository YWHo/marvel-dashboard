export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  has_next: boolean;
};

export type OnClickCallbackType = (id: string | number | undefined) => void;
