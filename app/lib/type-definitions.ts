export type InfoRow = {
  id?: number;
  title: string;
  description?: string;
  imageURL?: string;
};

export type InfoList = InfoRow[];

export enum RowDisplayType {
  WITH_IMAGE = "WITH_IMAGE",
  SIMPLE = "SIMPLE",
}

export type MarvelResponseDataType = {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: MarvelResponseDataResultType[];
};

export type MarvelResponseDataResultType = {
  id: number;
  name?: string;
  title?: string;
  description?: string | null;
  thumbnail?: MarvelResponseDataResultThumbnailType | null | undefined;
  textObjects?: {
    type: string;
    language: string;
    text: string;
  }[] | null | undefined;
};

export type MarvelResponseDataResultThumbnailType = {
  path?: string;
  extension?: string;
};

export type OnClickCallbackType = (id: number | undefined) => void;

export type SortOrder = "ascending" | "descending";
