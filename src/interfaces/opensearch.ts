import {
  Field,
  Id,
  IndexName,
  long,
  MtermvectorsResponse,
  MtermvectorsTermVectorsResult,
  TermvectorsResponse,
  TermvectorsTermVector,
  VersionNumber
} from '@opensearch-project/opensearch/api/types'

export interface MtermvectorsResponseCorrect2 {
  docs: TermvectorsResponse[];
}

export interface MtermvectorsTermVectorsResultCorrect extends MtermvectorsTermVectorsResult {
  found: boolean;
  _id: Id;
  index: IndexName;
  term_vectors: Record<Field, TermvectorsTermVector>;
  took: long;
  _version: VersionNumber;
}

export interface MtermvectorsResponseCorrect extends MtermvectorsResponse {
  docs: MtermvectorsTermVectorsResultCorrect[];
}
