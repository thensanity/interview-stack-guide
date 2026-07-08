import Link from "next/link";

export default function AdminPage() {
  return (
    <>
      <h2>Admin (protected by middleware)</h2>
      <p>You reached this page because <code>auth_token</code> cookie is set.</p>
      <Link href="/">← Home</Link>
    </>
  );
}
