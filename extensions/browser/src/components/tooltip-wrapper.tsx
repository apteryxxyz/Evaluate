import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@evaluate/react/components/tooltip';

export function TooltipWrapper(
  p: React.PropsWithChildren<{ content?: string | false }>,
) {
  if (!p.content) return <>{p.children}</>;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{p.children}</TooltipTrigger>
        <TooltipContent className="w-40">{p.content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
