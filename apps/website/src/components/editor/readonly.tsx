import ReactCodeMirror from '@uiw/react-codemirror';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';
import themes from './themes';

export function ReadonlyEditor({ content }: { content: string }) {
  const { resolvedTheme } = useTheme();
  const theme = useMemo(
    () => (resolvedTheme === 'light' ? themes.light : themes.dark),
    [resolvedTheme],
  );
  return <ReactCodeMirror readOnly value={content} theme={theme} />;
}
