import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mon Profil - Science Made Simple',
  description: 'Gérer mes informations personnelles et académiques',
};

export default function ProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
