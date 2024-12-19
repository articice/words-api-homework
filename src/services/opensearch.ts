import {article_hit, article_search} from '../interfaces/article'
import {Client} from '@opensearch-project/opensearch'
import {MtermvectorsResponseCorrect, MtermvectorsTermVectorsResultCorrect} from '../interfaces/opensearch'

const index = "my-index";

const host = 'localhost';
const protocol = 'http';
const port = 9200;
const auth = 'admin:admin'; // For testing only. Don't store credentials in code.

const client = new Client({
  node: protocol + '://' + auth + '@' + host + ':' + port,
  // ssl: {
  //   ca: fs.readFileSync(ca_certs_path),
  //   // You can turn off certificate verification (rejectUnauthorized: false) if you're using self-signed certificates with a hostname mismatch.
  //   // cert: fs.readFileSync(client_cert_path),
  //   // key: fs.readFileSync(client_key_path)
  // },
});

export class OpensearchService {
  static async searchDocumentsContaining(words: string[]): Promise<string[]> {
    // search for documents matching terms
    const body = {
      _source: false,
      query: {
        terms_set: {
          content: {
            terms: words,
            minimum_should_match_script: {
              source: "1"
            }
          }
        }
      }
    };

    const documents = await client.search<article_hit>({
      index,
      body
    });

    const ids = documents.body.hits.hits.map(article => article._id);

    return ids;
  }

  static async getTermvectorsForDocumentIds(ids: string[]): Promise<MtermvectorsTermVectorsResultCorrect[]> {
    if (ids.length) {
      const query = await client.mtermvectors<MtermvectorsResponseCorrect, article_search>({
        index,
        ids
      })

      return query.body.docs;
    } else return [];
  }

  static async getTermVectorsPerDocumentIdMap(ids: string[]) {
    const docs = await this.getTermvectorsForDocumentIds(ids);

    return docs.reduce((acc, value) => {
      return {...acc, [value._id]: value.term_vectors.content.terms}
    }, {})
  }

}
