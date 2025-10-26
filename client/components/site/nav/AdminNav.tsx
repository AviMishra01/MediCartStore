import { Link } from "react-router-dom";
import { HelpCircle, Home } from "lucide-react";

export default function DefaultNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm h-14">
      <div className="container flex items-center justify-between h-full px-4">

        {/* Home Button */}
        <Link
          to="/admin"
          className="text-gray-600 hover:text-primary transition-colors flex items-center justify-center"
          title="Go to Home"
        >
          <Home size={22} />
        </Link>

        {/* Centered Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 justify-center absolute left-1/2 transform -translate-x-1/2"
        >
          <div className="h-8 w-8 rounded-md bg-primary/10 grid place-items-center">
            <span className="text-primary text-lg font-black">✚</span>
          </div>
          <span className="text-base font-extrabold tracking-tight text-gray-900">
            Medizo
          </span>
        </Link>
      </div>
    </header>
  );
}
