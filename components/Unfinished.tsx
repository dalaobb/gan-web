import { notFound } from 'next/navigation';
import { showUnfinished } from '@/lib/launch';

export default function Unfinished({ children }: { children: React.ReactNode }) {
  if (!showUnfinished) notFound();
  return children;
}
