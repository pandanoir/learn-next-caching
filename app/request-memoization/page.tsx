import { headers } from 'next/headers';
import * as v from 'valibot';

const UuidSchema = v.object({ uuid: v.string() });

// サーバーリクエストの間だけ有効なキャッシュ
const fetchUuid = async () =>
  fetch(`http://${(await headers()).get('host')}/api/uuid`, {
    cache: 'no-cache',
  })
    .then((res) => res.json())
    .then((res) => v.parse(UuidSchema, res).uuid);

export default async function RequestMemoization() {
  const [uuid1, uuid2, uuid3] = await Promise.all([
    fetchUuid(),
    fetchUuid(),
    fetchUuid(),
  ]);

  return (
    <div>
      <h1>Request memoization</h1>
      <ul>
        <li>uuid1: {uuid1}</li>
        <li>uuid2: {uuid2}</li>
        <li>uuid3: {uuid3}</li>
      </ul>
      <p>
        urlとオプションが同一のfetchは、サーバーリクエストの間同じキャッシュが利用される。そのためuuid1、uuid2、uuid3はすべて同一の値が入ってくる。また、ページをリロードすると新しい値になる。
      </p>
    </div>
  );
}
