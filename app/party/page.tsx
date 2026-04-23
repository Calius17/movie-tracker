import PartyPageClient from './party-client';

export default function PartyPage({
  searchParams,
}: {
  searchParams?: { movieId?: string };
}) {
  return <PartyPageClient initialMovieId={searchParams?.movieId ?? ''} />;
}
