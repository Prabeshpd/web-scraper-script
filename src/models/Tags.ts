import BaseModel from './BaseModel';
import { CamelCaseKeys } from '../types/utils';

export interface TagModel {
  id: number;
  user_id: string;
  name: string;
  result_id?: string;
  created_at: string;
  updated_at: string;
}

export type TagDetail = CamelCaseKeys<TagModel>;
export type TagPayload = Omit<TagModel, 'id' | 'created_at' | 'updated_at'>;

class Tag extends BaseModel {
  public static table = 'tags';
}

export default Tag;
