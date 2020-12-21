export type WeiboHotSrarchWord = {
  title: string;
  url: string;
};

export type ZhihuHotSearchSearchWord = {
  query: string;
  display_query: string;
};

export type ZhihuHotSearchSearchTopSearch = {
  top_search: {
    words: ZhihuHotSearchSearchWord[];
  };
};

export type ZhihuHotTopicItem = {
  target: {
    title: string;
    id: number;
  };
};

export type ZhihuHotTopicQuestion = {
  title: string;
  url: string;
};

export type ZhihuHotTopicHotList = {
  data: ZhihuHotTopicItem[];
};