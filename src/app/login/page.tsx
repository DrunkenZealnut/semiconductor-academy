import { LoginForm } from '@/components/auth/LoginForm';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: '로그인',
  path: '/login/',
});

export default function LoginPage() {
  return <LoginForm />;
}
