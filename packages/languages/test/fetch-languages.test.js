import {
  fetchLanguages,
  findLanguage,
  getLanguage,
  searchLanguages,
} from '../dist';

describe('fetchLanguages', () => {
  it('should fetch languages correctly', async () => {
    const languages = await fetchLanguages();

    expect(languages).toBeInstanceOf(Array);
    expect(languages.length).toBeGreaterThan(0);
  });
});

describe('getLanguage', () => {
  it('should get language by id correctly', async () => {
    const language = await getLanguage('python');

    expect(language).toBeDefined();
    expect(language.id).toBe('python');
  });
});

describe('findLanguage', () => {
  it('should find language by resolvable correctly', async () => {
    const language = await findLanguage('py3');

    expect(language).toBeDefined();
    expect(language.id).toBe('python');
  });
});

describe('searchLanguages', () => {
  it('should search languages by query correctly', async () => {
    const languages = await searchLanguages('python');

    expect(languages).toBeInstanceOf(Array);
    expect(languages.length).toBeGreaterThan(0);
    expect(languages[0].id).toBe('python');
  });
});
