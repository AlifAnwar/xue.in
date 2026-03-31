import { Card } from '@/components/ui/card';

interface ModeCardProps {
  title: string;
  description: string;
  example: string;
}

export function ModeCard({ title, description, example }: ModeCardProps) {
  return (
    <Card className="p-6 border border-zinc-200 rounded-xl bg-white shadow-sm flex flex-col space-y-3">
      <h3 className="font-semibold text-xl text-zinc-900">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
      <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100 flex items-start sm:items-center">
        <span className="text-zinc-500 text-sm font-medium">{example}</span>
      </div>
    </Card>
  );
}
