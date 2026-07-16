import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-surface-950">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-8xl font-bold gradient-text font-display mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
          Page Not Found
        </h1>
        <p className="text-surface-500 dark:text-surface-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/search">
            <Button className="gap-2">
              <Search className="w-4 h-4" />
              Find Buddies
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
