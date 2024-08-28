import { useTheme } from 'next-themes';
import { getIconForFile, getIconForFolder, makeIconUrl } from './languages';

export function MaterialIcon(p: {
  type: 'file' | 'folder';
  expanded?: boolean;
  name: string;
  naming?: boolean;
}) {
  const { resolvedTheme } = useTheme();
  const icon =
    p.type === 'folder'
      ? p.expanded
        ? `${getIconForFolder(p.name, resolvedTheme)}-open`
        : getIconForFolder(p.name, resolvedTheme)
      : getIconForFile(p.name, resolvedTheme);

  return (
    <div className="mr-1 flex size-4 items-center justify-center">
      <img src={makeIconUrl(icon)} alt={p.name} title={p.name} />
    </div>
  );
}
