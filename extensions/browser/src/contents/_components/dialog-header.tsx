import { DialogHeader as UIDialogHeader } from '@evaluate/react/components/dialog';
import { env } from '~env';

export function DialogHeader() {
  return (
    <UIDialogHeader>
      <a
        className="mr-auto inline-flex items-center gap-2"
        target="_blank"
        rel="noreferrer noopener"
        href={env.PLASMO_PUBLIC_WEBSITE_URL}
      >
        <img
          src={`${env.PLASMO_PUBLIC_WEBSITE_URL}/images/icon.png`}
          alt="Evaluate logo"
          width={36}
          height={36}
        />
        <span className="font-bold text-primary text-xl">Evaluate</span>
      </a>
    </UIDialogHeader>
  );
}
