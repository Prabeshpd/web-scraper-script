import axios from 'axios';
import * as cheerio from 'cheerio';

import config from '../config';

const { scrapperClassNames } = config;

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18363',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8'
];

export async function loadSearchResults(key: string) {
  const randomNumber = Math.floor(Math.random() * userAgents.length);
  const userAgent = userAgents[randomNumber];
  let headers = { 'User-Agent': userAgent };
  const { data } = await axios.get(`https://www.google.com/search?q=${key}&hl=en`, { headers });
  const parsedHtml = cheerio.load(data);
  const statResult = getStatResult(parsedHtml);
  const linksCount = getLinksLength(parsedHtml);
  const adsLength = getTotalNumberOfAds(parsedHtml);
  return { linksCount, adsLength, statResult, htmlPage: data };
}

export function getTotalNumberOfAds(cheerioElement: cheerio.CheerioAPI) {
  const adElements = cheerioElement(scrapperClassNames.adLinksParentClass);
  return adElements.length;
}

export function getLinksLength(cheerioElement: cheerio.CheerioAPI) {
  const links: string[] = [];
  const linksHtml = cheerioElement(scrapperClassNames.searchLinksParentClass);
  const adsLinksHtml = cheerioElement(scrapperClassNames.adLinksParentClass);

  for (let linkHtml of linksHtml) {
    const link = cheerioElement(linkHtml)
      .find(scrapperClassNames.linkElement)
      .attr(scrapperClassNames.linkElementAttribute);
    if (link) links.push(link);
  }

  for (let adsLinkHtml of adsLinksHtml) {
    const adsLink = cheerioElement(adsLinkHtml)
      .find(`${scrapperClassNames.linkElement}${scrapperClassNames.adLinkAnchorElementClass}`)
      .attr(scrapperClassNames.linkElementAttribute);
    if (adsLink) links.push(adsLink);
  }

  return links.length;
}

export function getStatResult(cheerioElement: cheerio.CheerioAPI) {
  return cheerioElement('#result-stats').text();
}
