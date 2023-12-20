import { Label } from '@evaluate/ui/label';
import { Switch } from '@evaluate/ui/switch';
import { useEffect, useState } from 'react';
import { EnabledProvider, useEnabled } from '~contexts/enabled';
import { TranslateProvider } from '~contexts/translate';
import '../styles/tailwind.css';
import { HeaderBar } from './_components/header-bar/header-bar';

export default function PopupWrapper() {
  return (
    <div className="w-96 flex flex-col p-4 pt-0">
      <TranslateProvider>
        <HeaderBar />

        <EnabledProvider>
          <main className="flex flex-col">
            <PopupContent />
          </main>
        </EnabledProvider>
      </TranslateProvider>
    </div>
  );
}

function PopupContent() {
  const { isEnabled, disabledFor, setEnabled, setEnabledFor } = useEnabled();
  const [domain, setDomain] = useState<string>();
  useEffect(() => void getCurrentDomain().then(setDomain), []);

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

        <Switch
          name="current-enabled"
          checked={isEnabled && !disabledFor.includes(domain!)}
          disabled={!isEnabled}
          onCheckedChange={(c) => setEnabledFor(domain!, c)}
          className="ml-auto my-auto"
        />
      </div>
    </div>
  );
}

function getCurrentDomain() {
  return new Promise<string>((resolve) =>
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = new URL(tabs[0]!.url!);
      resolve(url.hostname);
    }),
  );
}
