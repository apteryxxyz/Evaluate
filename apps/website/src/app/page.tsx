import { fetchLanguages } from '@evaluate/execute';
import LanguagesContent from './content';

export default async function LanguagesPage() {
  const languages = await fetchLanguages();
  return <LanguagesContent languages={languages} />;
}
