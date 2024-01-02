import { DialogHeader as UIDialogHeader } from '@evaluate/react/components/dialog';
import { absoluteUrl } from '~utilities/url-helpers';

export function DialogHeader() {
  return (
    <UIDialogHeader>
      <a
        className="inline-flex items-center gap-2 mr-auto"
        target="_blank"
        rel="noreferrer noopener"
        href={absoluteUrl()}
      >
        <img
          src={absoluteUrl('/icon.png')}
          alt="Evaluate logo"
          width={36}
          height={36}
        />
        <span className="text-primary font-bold text-xl">Evaluate</span>
      </a>
    </UIDialogHeader>
  );
}
