import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';

import { loadSearchResults } from '../../src/services/scraper';

describe('Scraper Service:', () => {
  describe('load Search results: loadSearchResults()', async () => {
    const mockAxios: sinon.SinonMock = sinon.mock(axios);

    it('should return empty results if not any matching element was found for scraping', async () => {
      const responseData = { data: '<div></div>' };

      await mockAxios.expects('get').once().returns(responseData);
      const { adsLength, linksCount, statResult } = await loadSearchResults('key');
      expect(adsLength).to.be.equal(0);
      expect(linksCount).to.be.equal(0);
      expect(statResult).to.be.equal('');
    });
    it('should return correct statResult attribute if  matching element was found', async () => {
      const responseData = { data: '<div><div id="result-stats">total Results 340000: (0.00024 seconds)</div></div>' };

      await mockAxios.expects('get').once().returns(responseData);
      const { statResult } = await loadSearchResults('key');
      expect(statResult).to.be.equal('total Results 340000: (0.00024 seconds)');
    });
    it('should return correct ads element attribute if  matching element was found', async () => {
      const responseData = {
        data: '<div><div class="uEierd"></div><div class="uEierd"></div><div class="uEierd"></div></div>'
      };

      await mockAxios.expects('get').once().returns(responseData);
      const { adsLength } = await loadSearchResults('key');
      expect(adsLength).to.be.equal(3);
    });
    it('should return correct links count if ads are not present', async () => {
      const responseData = {
        data: `<div>
                 <div class="yuRUbf"><a href="http"//google.com"></a></div>
                 <div class="yuRUbf"><a href="http"//google.com"></a></div>
                 <div class="yuRUbf"><a href="http"//google.com"></a></div>
              </div>`
      };

      await mockAxios.expects('get').once().returns(responseData);
      const { linksCount } = await loadSearchResults('key');
      expect(linksCount).to.be.equal(3);
    });
    it('should return correct links count if only ads are present', async () => {
      const responseData = {
        data: `<div>
                   <div class="uEierd"><a class="sVXRqc" href="http"//google.com"></a></div>
                   <div class="uEierd"><a class ="sVXRqc" href="http"//google.com"></a></div>
                   <div class="uEierd"><a class ="sVXRqc" href="http"//google.com"></a></div>
                </div>`
      };

      await mockAxios.expects('get').once().returns(responseData);
      const { linksCount } = await loadSearchResults('key');
      expect(linksCount).to.be.equal(3);
    });
    it('should return correct links count if both ads and normal links are present', async () => {
      const responseData = {
        data: `<div>
                   <div class="yuRUbf"><a href="http"//google.com"></a></div>
                   <div class="yuRUbf"><a href="http"//google.com"></a></div>
                   <div class="yuRUbf"><a href="http"//google.com"></a></div>
                   <div class="uEierd"><a class="sVXRqc" href="http"//google.com"></a></div>
                   <div class="uEierd"><a class ="sVXRqc" href="http"//google.com"></a></div>
                   <div class="uEierd"><a class ="sVXRqc" href="http"//google.com"></a></div>
                </div>`
      };

      await mockAxios.expects('get').once().returns(responseData);
      const { linksCount } = await loadSearchResults('key');
      expect(linksCount).to.be.equal(6);
    });
    it('should return correct links count if both ads and normal links are present', async () => {
      const responseData = {
        data: `<div>
                     <div class="yuRUbf"><a href="http"//google.com"></a></div>
                     <div class="yuRUbf"><a href="http"//google.com"></a></div>
                     <div class="yuRUbf"><a href="http"//google.com"></a></div>
                     <div class="uEierd"><a class="sVXRqc" href="http"//google.com"></a></div>
                     <div class="uEierd"><a class ="sVXRqc" href="http"//google.com"></a></div>
                     <div class="uEierd"><a class ="sVXRqc" href="http"//google.com"></a></div>
                     <div id="result-stats">total Results 340000: (0.00024 seconds)</div>
                  </div>`
      };

      await mockAxios.expects('get').once().returns(responseData);
      const { linksCount, adsLength, statResult } = await loadSearchResults('key');
      expect(linksCount).to.be.equal(6);
      expect(adsLength).to.be.equal(3);
      expect(statResult).to.be.equal('total Results 340000: (0.00024 seconds)');
    });
  });
});
