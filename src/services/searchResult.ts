import Tag from '../models/Tags';
import SearchResult, { SearchResultPayload } from '../models/SearchResult';
import { loadSearchResults } from './scraper';

export async function insertSearchResultForUserTags(userId: number) {
  const tags = await Tag.fetch(userId);
  for (const tag of tags) {
    const queryResult = await loadSearchResults(tag.name);
    const searchResultPayload: SearchResultPayload = {
      ad_words_count: queryResult.adsLength,
      total_results: queryResult.statResult,
      links_count: queryResult.linksCount,
      html_page: queryResult.htmlPage
    };

    let [searchResult] = await SearchResult.insertData(searchResultPayload);
    await Tag.updateById(tag.id, { results_id: searchResult.id });
  }
}
