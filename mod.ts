#!/usr/bin/env -S deno run --unstable --allow-net --allow-read --allow-write --importmap=import_map.json
import { format } from "std/datetime/mod.ts";
import { join } from "std/path/mod.ts";
import { exists } from "std/fs/mod.ts";

import type { WeiboHotSrarchWord, ZhihuHotTopicQuestion, ZhihuHotTopicHotList } from "./types/types.ts";
import { weiboMergeWords,  mergeQuestions } from "./utils/utils.ts";

const weiboHotSearchURL = "https://s.weibo.com/top/summary";
// const zhihuHotSearchURL = "https://www.zhihu.com/api/v4/search/top_search";
const zhihuHotTopicURL = "https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=100";

const regexp = /<a href="(\/weibo\?q=[^"]+)".*?>(.+)<\/a>/g;
const yyyyMMdd = format(new Date(), "yyyy-MM-dd");

// 微博热搜
const weiboHotSearchResponse = await fetch(weiboHotSearchURL);

if (!weiboHotSearchResponse.ok) {
  console.error(weiboHotSearchResponse.statusText);
  Deno.exit(-1);
}

const weiboResult: string = await weiboHotSearchResponse.text();

const matches = weiboResult.matchAll(regexp);

const weiboWords: WeiboHotSrarchWord[] = Array.from(matches).map((i) => ({
  url: `https://s.weibo.com/${i[1]}`,
  title: i[2],
}));

const weiboHotSearchFullPath = join("weibo-hot-search", `${yyyyMMdd}.json`);

let weiboHotSearchWordsAlreadyDownload: WeiboHotSrarchWord[] = [];
if (await exists(weiboHotSearchFullPath)) {
  const content = await Deno.readTextFile(weiboHotSearchFullPath);
  weiboHotSearchWordsAlreadyDownload = JSON.parse(content);
}

// 写入微博数据
const weiboHotSearchQueswordsAll = weiboMergeWords(weiboWords, weiboHotSearchWordsAlreadyDownload);
await Deno.writeTextFile(weiboHotSearchFullPath, JSON.stringify(weiboHotSearchQueswordsAll));

// 知乎热搜
// const zhihuHotSearchResponse = await fetch(zhihuHotSearchURL);

// if (!zhihuHotSearchResponse.ok) {
//   console.error(zhihuHotSearchResponse.statusText);
//   Deno.exit(-1);
// }

// const zhihuHotSearchResult: ZhihuHotSearchSearchTopSearch = await zhihuHotSearchResponse.json();
// const words = zhihuHotSearchResult.top_search.words;

// const zhihuHotSearchFullPath = join("zhihu-hot-search", `${yyyyMMdd}.json`);

// let zhihuHotSearchWordsAlreadyDownload: ZhihuHotSearchSearchWord[] = [];
// if (await exists(zhihuHotSearchFullPath)) {
//   const content = await Deno.readTextFile(zhihuHotSearchFullPath);
//   zhihuHotSearchWordsAlreadyDownload = JSON.parse(content);
// }

// const zhihuHotSearchWordsAll = zhihuMergeWords(words, zhihuHotSearchWordsAlreadyDownload);
// await Deno.writeTextFile(zhihuHotSearchFullPath, JSON.stringify(zhihuHotSearchWordsAll));

// 知乎热门话题
const zhihuHotTopicResponse = await fetch(zhihuHotTopicURL);

if (!zhihuHotTopicResponse.ok) {
  console.error(zhihuHotTopicResponse.statusText);
  Deno.exit(-1);
}

const zhihuHotTopicResult: ZhihuHotTopicHotList = await zhihuHotTopicResponse.json();

const zhihuHotTopicQuestions: ZhihuHotTopicQuestion[] = zhihuHotTopicResult.data.map((x) => ({
  title: x.target.title,
  url: `https://www.zhihu.com/question/${x.target.id}`,
}));

const zhihuHotTopicFullPath = join("zhihu-hot-topic", `${yyyyMMdd}.json`);

let zhihuHotTopicQuestionsAlreadyDownload: ZhihuHotTopicQuestion[] = [];
if (await exists(zhihuHotTopicFullPath)) {
  const content = await Deno.readTextFile(zhihuHotTopicFullPath);
  zhihuHotTopicQuestionsAlreadyDownload = JSON.parse(content);
}

// 保存原始数据
const zhihuHotTopicQuestionsAll = mergeQuestions(zhihuHotTopicQuestions, zhihuHotTopicQuestionsAlreadyDownload);
await Deno.writeTextFile(zhihuHotTopicFullPath, JSON.stringify(zhihuHotTopicQuestionsAll));