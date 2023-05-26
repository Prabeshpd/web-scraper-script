import axios from 'axios';
import { load, CheerioAPI } from 'cheerio';

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36'
];

export async function loadSearchResults(key: string) {
  const randomNumber = Math.floor(Math.random() * userAgents.length);
  const userAgent = userAgents[randomNumber];
  let headers = { 'User-Agent': userAgent };
  const { data } = await axios.get(`https://www.google.com/search?q=${key}&hl=en`, { headers });
  const parsedHtml = load(data);
  const statResult = getStatResult(parsedHtml);
  const linksCount = getLinksLength(parsedHtml);
  const adsLength = getTotalNumberOfAds(parsedHtml);

  return {linksCount, adsLength, statResult, htmlPage: data}
}

function getTotalNumberOfAds(cheerioElement: CheerioAPI) {
  const adElements = cheerioElement('.uEierd');
  return adElements.length;
}

function getLinksLength(cheerioElement: CheerioAPI) {
  const links: string[] = [];
  const linksHtml = cheerioElement('.yuRUbf');
  const adsLinksHtml = cheerioElement('.uEierd');
  for (let linkHtml of linksHtml) {
    const link = cheerioElement(linkHtml).find('a').attr('href');
    if (link) links.push(link);
  }
  for (let adsLinkHtml of adsLinksHtml) {
    const adsLink = cheerioElement(adsLinkHtml).find('a.sVXRqc').attr('href');
    if (adsLink) links.push(adsLink);
  }
  return links.length;
}

function getStatResult(cheerioElement: CheerioAPI) {
  return cheerioElement('#result-stats').text();
}
