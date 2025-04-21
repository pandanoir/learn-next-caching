import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import * as v from 'valibot';

const UuidSchema = v.object({ uuid: v.string() });

// 5秒間だけキャッシュする
const fetchUuidWithTimeBasedRevalidation = async () =>
  fetch(`http://${(await headers()).get('host')}/api/uuid#time-based`, {
    next: { revalidate: 5 },
  })
    .then((res) => res.json())
    .then((res) => v.parse(UuidSchema, res).uuid);

// 永続的にキャッシュする
const fetchUuidWithDataCache = async () =>
  fetch(`http://${(await headers()).get('host')}/api/uuid#eternal-cached`, {
    cache: 'force-cache',
  })
    .then((res) => res.json())
    .then((res) => v.parse(UuidSchema, res).uuid);

// 手動でrevalidate指示がくるまでキャッシュする (on-demand)
const fetchUuidWithTag = async () =>
  fetch(`http://${(await headers()).get('host')}/api/uuid#manually`, {
    cache: 'force-cache',
    next: { tags: ['tag'] },
  })
    .then((res) => res.json())
    .then((res) => v.parse(UuidSchema, res).uuid);

export default async function DataMemoization() {
  const [uuidWithTimeLimitedCache, cachedUuid, uuidWithTaggedCache] =
    await Promise.all([
      fetchUuidWithTimeBasedRevalidation(),
      fetchUuidWithDataCache(),
      fetchUuidWithTag(),
    ]);

  return (
    <div>
      <h1>Data memoization</h1>
      <ul>
        <li>
          uuid with time limited cache(valid for 5 seconds):{' '}
          {uuidWithTimeLimitedCache}
        </li>
        <li>
          revalidatable cached uuid: {uuidWithTaggedCache}
          <button
            type="button"
            onClick={async () => {
              'use server';
              revalidateTag('tag');
            }}
          >
            revalidate
          </button>
        </li>
        <li>cached uuid: {cachedUuid}</li>
      </ul>
      <p>
        <code>{`{ next: { revalidate: 5 } }`}</code>
        が設定されたリクエストは5秒間だけキャッシュが使われる。5秒経過してからページをリロードすると新しい値になる。
      </p>
      <p>
        <code>{`{ next: { tags: ['tag'] } }`}</code>
        が設定されたリクエストはrevalidateTag('tag')を行うとrevalidateされる。ただし、このオプションをつけただけではキャッシュされないので、
        <code>cache: 'force-cache'</code>もつける必要がある。
      </p>
      <p>
        <code>{`{ cache: 'force-cache' }`}</code>
        が設定されたリクエストはずっとキャッシュされ、ページをリロードしても同じ値のまま。
      </p>
    </div>
  );
}
