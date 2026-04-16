import { AuthScreen } from '@/components/auth-screen';

type SignupPageProps = {
  searchParams?: Promise<{ plan?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = searchParams ? await searchParams : {};
  const selectedPlan =
    params.plan === 'ad_free' || params.plan === 'free' ? params.plan : null;

  return <AuthScreen mode='signup' selectedPlan={selectedPlan} />;
}
