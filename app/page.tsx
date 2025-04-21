import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link href="/data-memoization">Data memoization</Link>
          </li>
          <li>
            <Link href="/request-memoization">Request memoization</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
