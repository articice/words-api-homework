import {SearchResponse} from '@opensearch-project/opensearch/api/types'

export interface article {
  _id: string;
  content: string;
}

export interface article_search extends Omit<article, 'content'> {
}

export interface article_hit extends SearchResponse<article> {
}
