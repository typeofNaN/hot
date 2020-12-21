import type { ZhihuHotSearchSearchWord, WeiboHotSrarchWord, ZhihuHotTopicQuestion } from "../types/types.ts";

/** 合并两次热门话题并根据 id 去重 */
export function weiboMergeWords(
  words: WeiboHotSrarchWord[],
  another: WeiboHotSrarchWord[],
): WeiboHotSrarchWord[] {
  const obj: Record<string, string> = {};
  for (const w of words.concat(another)) {
    obj[w.url] = w.title;
  }
  return Object.entries(obj).map(([url, title]) => ({
    url,
    title,
  }));
}

export function zhihuMergeWords(
  words: ZhihuHotSearchSearchWord[],
  another: ZhihuHotSearchSearchWord[],
): ZhihuHotSearchSearchWord[] {
  const obj: Record<string, string> = {};
  for (const w of words.concat(another)) {
    obj[w.display_query] = w.query;
  }
  return Object.entries(obj).map(([display_query, query]) => ({
    query,
    display_query,
  }));
}

/** 合并两次热门话题并根据 id 去重 */
export function mergeQuestions(
  words: ZhihuHotTopicQuestion[],
  another: ZhihuHotTopicQuestion[],
): ZhihuHotTopicQuestion[] {
  const obj: Record<string, string> = {};
  for (const w of words.concat(another)) {
    obj[w.url] = w.title;
  }
  return Object.entries(obj).map(([url, title]) => ({
    url,
    title,
  }));
}