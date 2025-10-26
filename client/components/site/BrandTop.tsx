import { Link } from "react-router-dom";

export default function BrandTop() {
  return (
    <div className="w-full border-b bg-background/90">
      <div className="container h-16 grid place-items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-md bg-primary/10 grid place-items-center">
            <span className="text-primary text-xl font-black">✚</span>
          </div>
          <span className="text-lg font-extrabold tracking-tight text-gray-900">Medizo</span>
        </Link>
      </div>
    </div>
  );
}
