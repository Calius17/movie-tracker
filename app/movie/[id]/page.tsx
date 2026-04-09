import { MovieDetailPage } from '@/components/movie-detail-page';

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movieId = Number(id);

  return <MovieDetailPage movieId={movieId} />;
}
