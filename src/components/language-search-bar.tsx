import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, SearchIcon } from 'lucide-react';
import { executeServerAction } from 'next-sa/client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { searchLanguages } from '@/app/actions';
import { useLanguages } from '@/contexts/languages';
import { useLocale } from '@/contexts/locale';
import { useTranslate } from '@/contexts/translate';
import { addLocale } from '@/utilities/url-helpers';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem } from './ui/form';
import { Input } from './ui/input';

const searchSchema = z.object({ query: z.string().max(52) });

export function LanguageSearchBar() {
  const locale = useLocale();
  const router = useRouter();
  const languages = useLanguages();
  const t = useTranslate();

  const searchForm = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: '' },
  });

  const onSubmit = searchForm.handleSubmit(async ({ query }) => {
    if (languages.isSearching) return;
    languages.setIsSearching(true);

    if (query.length === 0) {
      languages.setFiltered(languages.initial);
    } else {
      const newLanguages = await executeServerAction(searchLanguages, query);
      languages.setFiltered(newLanguages);
    }

    router.push(addLocale('/', locale));
    languages.setIsSearching(false);
  });

  return (
    <Form {...searchForm}>
      <form onSubmit={onSubmit} className="flex gap-2 w-full">
        <FormField
          control={searchForm.control}
          name="query"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  placeholder={t.languages.search_languages()}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={languages.isSearching}>
          {languages.isSearching ? (
            <Loader2Icon className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <SearchIcon className="mr-1 h-4 w-4" />
          )}
          {t.languages.search()}
        </Button>
      </form>
    </Form>
  );
}
