import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@evaluate/components/resizable';
import { Children } from 'react';

export function DesktopWrapper({ children }: React.PropsWithChildren) {
  const [explorer, editor, terminal] = Children.toArray(children);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        defaultSize={15}
        minSize={10}
        collapsible={false}
        className="m-1.5 rounded-lg border-2 bg-card"
      >
        {explorer}
      </ResizablePanel>

      <ResizableHandle className="bg-transparent" />

      <ResizablePanel
        defaultSize={55}
        minSize={35}
        collapsible={false}
        className="m-1.5 rounded-lg border-2 bg-card"
      >
        {editor}
      </ResizablePanel>

      <ResizableHandle className="bg-transparent" />

      <ResizablePanel
        defaultSize={30}
        minSize={10}
        collapsible={false}
        className="m-1.5 rounded-lg border-2 bg-card"
      >
        {terminal}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
