import { AssessmentClient } from './AssessmentClient';

export function generateStaticParams() {
  return [
    { subject: 'physics' },
    { subject: 'math' },
    { subject: 'chemistry' },
    { subject: 'economy' },
    { subject: 'stats' },
    { subject: 'accounting' },
  ];
}

export default async function AssessmentPage({ params }: { params: Promise<{ subject: string }> }) {
  const resolvedParams = await params;
  return <AssessmentClient subject={resolvedParams.subject} />;
}

