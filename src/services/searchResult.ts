import Tag from '../models/Tags';
import SearchResult, { SearchResultPayload } from '../models/SearchResult';

import { loadSearchResults } from './scraper';

import logger from '../utils/logger';

export async function insertSearchResultForUserTags(userId: number) {
  const tags = await Tag.fetch(userId);
  for (const tag of tags) {
    try {
      const queryResult = await loadSearchResults(tag.name);
      const searchResultPayload: SearchResultPayload = {
        ad_words_count: queryResult.adsLength,
        total_results: queryResult.statResult,
        links_count: queryResult.linksCount,
        html_page: queryResult.htmlPage
      };

      let [searchResult] = await SearchResult.insertData(searchResultPayload);
      await Tag.updateById(tag.id, { results_id: searchResult.id });
    } catch (err) {
      //ToDo: add a logger table from where a separate service can load all the search result for failed ones
      logger.error(err, `Error occurred for ${tag}`);
      continue;
    }
  }
}
