import express from 'express'
import {OpensearchService} from '../services/opensearch'
import {TermvectorsTerm} from '@opensearch-project/opensearch/api/types'

export const router = express.Router();

router.post('/offsets', async (
  req,
  res
) => {
  const words = req.body as string[];

  const ids = await OpensearchService
    .searchDocumentsContaining(words);

  const termvectorsPerDocument = await OpensearchService
    .getTermVectorsPerDocumentIdMap(ids)

  const result = [];
  for (let candidate_word of words) {
    const candidate_hits = [];
    for (const [id, term_vectors] of Object.entries(termvectorsPerDocument)) {
      // @ts-ignore:
      const vector = term_vectors[candidate_word] as TermvectorsTerm;
      if (vector) {
        candidate_hits.push({
          article_id: id,
          offsets: vector.tokens.map(token => token.start_offset)
        })
      }
    }

    result.push({
      [candidate_word]: candidate_hits
    })
  }

  res.send(result);
});

router.get('/most-used-in-document/:word', async(
  req,
  res
) => {
  const word: string = req.params['word'];

  const ids =
    await OpensearchService
    .searchDocumentsContaining([word]);

  if (ids.length) {
    const termvectorsPerDocument =
      await OpensearchService
        .getTermvectorsForDocumentIds(ids)

    let maxId: string | boolean = false;
    let maxFreq = 0;
    for (let doc of termvectorsPerDocument) {
      const terms = doc.term_vectors.content.terms[word];
      if (terms) {
        const newFreq = terms.term_freq;
        if (!maxId || (newFreq > maxFreq)) {
          maxId = doc._id;
          maxFreq = newFreq;
        }
      }
    }

    res.send({
      id: maxId,
    })
  } else res.sendStatus(404);
})

