import { createFileRoute } from "@tanstack/react-router";
import { BrandBook } from "@/components/brand-book";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <BrandBook />;
}
