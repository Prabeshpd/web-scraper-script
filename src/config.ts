import dotenv from 'dotenv';

type ENV = 'local' | 'test';
interface Configuration {
  env: ENV;
  port: string | number;
  logger: {
    prettyPrint: boolean;
  };
  database: {
    test: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
    };
    local: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
    };
  };
  rabbitMQ: {
    test: {
      host: string;
      port: number;
    };
    local: {
      host: string;
      port: number;
    };
    events: {
      searchTags: string;
    };
  };
  scrapperClassNames: {
    searchLinksParentClass: string;
    adLinksParentClass: string;
    linkElement: string;
    linkElementAttribute: string;
    adLinkAnchorElementClass: string;
    statResultId: string;
  };
}

dotenv.config();

const config: Configuration = {
  env: process.env.ENV == 'test' ? 'test' : 'local',
  port: process.env.EXPRESS_PORT || '3000',
  logger: {
    prettyPrint: process.env.ENV !== 'production'
  },
  database: {
    test: {
      host: process.env.DB_TEST_HOST || 'localhost',
      port: (process.env.DB_TEST_PORT && +process.env.DB_TEST_PORT) || 5432,
      user: process.env.DB_TEST_USER || 'postgres',
      password: process.env.DB_TEST_PASSWORD || 'Admin@1234',
      database: process.env.DB_TEST_DATABASE || 'scraper'
    },
    local: {
      host: process.env.DB_HOST || 'localhost',
      port: (process.env.DB_PORT && +process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'Admin@1234',
      database: process.env.DB_DATABASE || 'scraper'
    }
  },
  rabbitMQ: {
    test: {
      host: process.env.RABBIT_MQ_HOST || 'localhost',
      port: +(process.env.RABBIT_MQ_PORT || 5672)
    },
    local: {
      host: process.env.RABBIT_MQ_HOST || 'localhost',
      port: +(process.env.RABBIT_MQ_PORT || 5672)
    },
    events: {
      searchTags: process.env.RABBIT_MQ_EVENTS_SEARCH_TAGS || 'SEARCH_TAGS'
    }
  },
  scrapperClassNames: {
    searchLinksParentClass: process.env.SEARCH_LINKS_PARENT_CLASS || '.yuRUbf',
    adLinksParentClass: process.env.AD_LINKS_PARENT_CLASS || '.uEierd',
    linkElement: process.env.LINK_ELEMENT || 'a',
    linkElementAttribute: process.env.LINK_ELEMENT_ATTRIBUTE || 'href',
    adLinkAnchorElementClass: process.env.AD_LINK_ANCHOR_ELEMENT_CLASS || '.sVXRqc',
    statResultId: process.env.STAT_RESULT_ID || '#result-stats'
  }
};

export default config;
