'use client';

import { Button } from '@evaluate/components/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@evaluate/components/context-menu';
import { useHotkeys } from 'react-hotkeys-hook';

namespace ContextMenuWrapper {
  export type Item =
    | {
        label: string;
        action: React.MouseEventHandler<HTMLButtonElement>;
      }
    | {
        label: string;
        action: () => void;
        shortcut: string;
      };

  export interface Props {
    items?: (Item | null)[];
    children: React.ReactNode;
  }
}

// NOTE: No longer used, but kept for archival purposes

export function ContextMenuWrapper(props: ContextMenuWrapper.Props) {
  const { items = [], children } = props;

  for (const item of items) {
    if (item && 'shortcut' in item) {
      useHotkeys(item.shortcut, item.action, { enableOnContentEditable: true });
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

      <ContextMenuContent className="p-1">
        {items.map((item, i) =>
          item ? (
            <ContextMenuItem key={item.label} asChild>
              <Button
                variant="ghost"
                className="h-auto w-full cursor-pointer justify-start p-1 px-6 font-normal focus-visible:ring-0"
                onClick={item.action}
              >
                <span className="mr-2">{item.label}</span>
                {'shortcut' in item && (
                  <ContextMenuShortcut>{item.shortcut}</ContextMenuShortcut>
                )}
              </Button>
            </ContextMenuItem>
          ) : (
            <ContextMenuSeparator key={i} />
          ),
        )}

        {items.length === 0 && (
          <div className="p-2 text-gray-500 text-sm">No actions available</div>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
