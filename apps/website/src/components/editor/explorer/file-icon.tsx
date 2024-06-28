import { getIconFromExtension } from '@evaluate/engine/runtimes';
import { FileIcon as FFIcon, ScanIcon } from 'lucide-react';

export function FileIcon(p: {
  fileName: string;
  isRenaming?: boolean;
  isMeta?: boolean;
}) {
  const extension = p.fileName.split('.').pop();
  const icon = getIconFromExtension(`.${extension}`);

  return (
    <div className="mr-1 flex size-4 items-center justify-center">
      {p.isMeta ? (
        <ScanIcon size={16} strokeWidth={1.5} />
      ) : !icon || p.isRenaming ? (
        <FFIcon size={16} strokeWidth={1.5} />
      ) : (
        <img
          src={makeIconUrl(icon)}
          alt={p.fileName}
          className="size-4 max-w-none"
        />
      )}
    </div>
  );
}

function makeIconUrl(icon: string) {
  return `https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/940f2ea7a6fcdc0221ab9a8fc9454cc585de11f0/icons/${icon}.svg`;
}
