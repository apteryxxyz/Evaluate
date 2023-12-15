import { fetchLanguages } from '@evaluate/execute';
import Content from './content';

export default async function LanguagesPage() {
  const languages = await fetchLanguages();
  return <Content languages={languages} />;
}
