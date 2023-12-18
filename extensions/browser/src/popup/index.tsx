import { TranslateProvider, useTranslate } from '~contexts/translate';
import '../styles/tailwind.css';
import { HeaderBar } from './_components/header-bar/header-bar';

export default function Popup() {
  return (
    <div className="w-96 h-96 flex flex-col p-4 pt-0">
      <TranslateProvider>
        <HeaderBar />

        <main className="flex flex-col">
          <Content />
        </main>
      </TranslateProvider>
    </div>
  );
}

function Content() {
  const t = useTranslate();
  return <>{t?.locale}</>;
}
