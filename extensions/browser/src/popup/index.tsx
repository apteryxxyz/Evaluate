import { Label } from '@evaluate/react/components/label';
import { Switch } from '@evaluate/react/components/switch';
import { useEffect, useState } from 'react';
import { TooltipWrapper } from '~components/tooltip-wrapper';
import { EnabledProvider, useEnabled } from '~contexts/enabled';
import { TranslateProvider } from '~contexts/translate';
import { getDomain, getMetaTagContent } from '~utilities/active-tab';
import '../styles/tailwind.css';
import { HeaderBar } from './_components/header-bar';

export default function PopupWrapper() {
  return (
    <div className="w-96 flex flex-col p-4 pt-0">
      <TranslateProvider>
        <HeaderBar />

        <EnabledProvider>
          <main className="flex flex-col">
            <Popup />
          </main>
        </EnabledProvider>
      </TranslateProvider>
    </div>
  );
}

function Popup() {
  const { isEnabled, isEnabledFor, setEnabled, setEnabledFor } = useEnabled();
  const [domain, setDomain] = useState<string>();
  const [hasDisabledTag, setHasDisabledTag] = useState<boolean>();
  useEffect(() => {
    getDomain().then(setDomain);
    getMetaTagContent().then(console.log);
    getMetaTagContent().then((c) => setHasDisabledTag(c === 'disabled'));
  }, []);

  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="flex">
        <div>
          <Label htmlFor="enabled">Is Globally Enabled</Label>
          <p className="text-xs text-muted-foreground">
            Toggle this switch to enable/disable the extension globally.
          </p>
        </div>

        <Switch
          name="enabled"
          checked={isEnabled}
          onCheckedChange={setEnabled}
          className="ml-auto my-auto"
        />
      </div>

      <div className="flex">
        <div>
          <Label htmlFor="current-enabled">Is Current Site Enabled</Label>
          <p className="text-xs text-muted-foreground">
            Toggle this switch to enable/disable the extension on the current
            website: <code className="inline">{domain}</code>.
          </p>
        </div>

        <TooltipWrapper
          content={
            hasDisabledTag &&
            'This website instructs the Evaluate extension to not run on this page.'
          }
        >
          <div className="ml-auto my-auto">
            <Switch
              name="current-enabled"
              checked={isEnabledFor(domain!) && !hasDisabledTag}
              disabled={!isEnabled || hasDisabledTag}
              onCheckedChange={(c) => setEnabledFor(domain!, c)}
            />
          </div>
        </TooltipWrapper>
      </div>
    </div>
  );
}
