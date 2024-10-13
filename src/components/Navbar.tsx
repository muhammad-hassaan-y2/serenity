// components/Navbar.tsx
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  if (!session?.user) return null; // Show nothing if user is not logged in

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <div>
        {session.user.role === "TEACHER" && <Link href="/quiz">Quiz Management</Link>}
        {session.user.role === "STUDENT" && <Link href="/dashboard">Dashboard</Link>}
      </div>
      <button onClick={() => signOut()}>Sign Out</button>
    </nav>
  );
}
