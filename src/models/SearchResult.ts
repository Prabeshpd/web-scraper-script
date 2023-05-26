import BaseModel from './BaseModel';
import { CamelCaseKeys } from '../types/utils';

export interface SearchResult {
  id: number;
  ad_words_count: number;
  links_count: number;
  html_page: string;
  total_results: string;
  created_at: string;
  updated_at: string;
}

export type SearchResultDetail = CamelCaseKeys<SearchResult>;
export type SearchResultPayload = Omit<SearchResult, 'id' | 'created_at' | 'updated_at'>;

class Tag extends BaseModel {
  public static table = 'search_results';

  public static async insertData(data: SearchResultPayload | SearchResultPayload[]) {
    return this.insert<SearchResultDetail>(data);
  }
}

export default Tag;
