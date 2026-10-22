import test from 'node:test';
import assert from 'node:assert/strict';
import {loadStarSnapshot, parseStoredSnapshot, OWNER, MAX_CACHE_AGE} from '../stars.mjs';
const repo = (name, stars, fork = false) => ({name,stargazers_count:stars,fork,private:false,owner:{login:OWNER}});
const response = (data, link = null, status = 200) => ({ok:status===200,status,headers:{get:() => link},json:async() => data});

test('counts public original repos, includes zero and excludes forks',async()=>{
  const result = await loadStarSnapshot({fetchFn:async()=>response([repo('one',38),repo('zero',0),repo('fork',900,true)])});
  assert.equal(result.total,38); assert.equal(result.repos.length,2); assert.equal(result.repos[1].stars,0);
});
test('follows all pages and deduplicates overlapping repository rows',async()=>{
  let calls=0;
  const next='https://api.github.com/users/TardisBooo/repos?page=2';
  const result=await loadStarSnapshot({fetchFn:async()=>++calls===1?response([repo('one',38)],`<${next}>; rel="next"`):response([repo('one',38),repo('two',14)])});
  assert.equal(calls,2);assert.equal(result.total,52);
});
test('rejects an incomplete result when a later page is rate limited',async()=>{
  let calls=0;
  await assert.rejects(loadStarSnapshot({fetchFn:async()=>++calls===1?response([repo('one',38)],'<https://api.github.com/users/TardisBooo/repos?page=2>; rel="next"'):response({},null,403)}),/403/);
});
test('refuses unexpected pagination hosts',async()=>{
  await assert.rejects(loadStarSnapshot({fetchFn:async()=>response([repo('one',1)],'<https://example.com/repos>; rel="next"')}),/pagination/);
});
test('does not silently coerce missing or invalid star counts into zero',async()=>{
  for(const stars of [null,-1,NaN,'38'])await assert.rejects(loadStarSnapshot({fetchFn:async()=>response([repo('bad',stars)])}),/star count/);
});
test('rejects a different owner rather than inflate the total',async()=>{
  const other={...repo('other',99),owner:{login:'someone-else'}};
  await assert.rejects(loadStarSnapshot({fetchFn:async()=>response([other])}),/owner/);
});
test('cache validation preserves zero but rejects expired, corrupted and inconsistent data',()=>{
  const now=Date.now();const data={version:1,owner:OWNER,updatedAt:now,repos:[{name:'zero',stars:0}],total:0};
  assert.equal(parseStoredSnapshot(JSON.stringify(data),now).total,0);
  assert.equal(parseStoredSnapshot(JSON.stringify({...data,total:99}),now),null);
  assert.equal(parseStoredSnapshot(JSON.stringify({...data,updatedAt:now-MAX_CACHE_AGE-1}),now),null);
  assert.equal(parseStoredSnapshot('not json',now),null);
});
