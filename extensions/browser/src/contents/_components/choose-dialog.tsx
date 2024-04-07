import { compress } from '@evaluate/engine/dist/compress';
import { Button } from '@evaluate/react/components/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from '@evaluate/react/components/dialog';
import { ExternalLinkIcon } from 'lucide-react';
import { useMemo } from 'react';
import { env } from '~env';
import { wrapCapture } from '~utilities/wrap-capture';
import { DialogHeader } from './dialog-header';

export function ChooseDialog(p: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogRef: React.RefObject<HTMLDivElement>;
  code?: string;
}) {
  const chooseRuntimeUrl = useMemo(() => {
    if (!p.code) return;
    const state = compress({
      files: { 'file.code': p.code },
      entry: 'file.code',
    });
    return `${env.PLASMO_PUBLIC_WEBSITE_URL}/playgrounds#${state}`;
  }, [p.code]);

  return (
    <Dialog open={p.open} onOpenChange={p.onOpenChange}>
      <DialogContent container={p.dialogRef.current!}>
        <DialogHeader />

        <div className="space-y-2">
          <h1 className='font-bold text-lg'>Runtime could not be detected</h1>
          <p className="text-sm">
            Was unable to detect the runtime of the code you provided, would you
            like to pick manually?
          </p>
        </div>

        <DialogFooter>
          <Button onClick={() => p.onOpenChange(false)} variant="secondary">
            No
          </Button>

          {chooseRuntimeUrl && (
            <Button asChild onClick={wrapCapture(() => true)}>
              <a
                target="_blank"
                rel="noreferrer noopener"
                href={chooseRuntimeUrl}
              >
                <span>Yes&nbsp;</span>
                <ExternalLinkIcon size={16} />
              </a>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
