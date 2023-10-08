import { useApiRouteMutation } from '@builders/next/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { GET } from '@/api/languages/route';
import { useLanguages } from '@/contexts/languages';
import { useLocale } from '@/contexts/locale';
import { useTranslate } from '@/contexts/translate';
import { cn } from '@/utilities/class-name';
import { addLocale } from '@/utilities/url-helpers';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem } from './ui/form';
import { Input } from './ui/input';

const searchSchema = z.object({ query: z.string().max(52) });

interface LanguageSearchBarProps {
  className?: string;
  onSearchDone?: () => void;
}

export function LanguageSearchBar(p: LanguageSearchBarProps) {
  const locale = useLocale();
  const router = useRouter();
  const languages = useLanguages();
  const t = useTranslate();

  const searchLanguages = useApiRouteMutation<typeof GET>(
    'GET',
    '/api/languages',
  );

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
      const newLanguages = await searchLanguages //
        .mutateAsync({ search: { query } });
      languages.setFiltered(newLanguages);
    }

    router.push(addLocale('/', locale));
    languages.setIsSearching(false);
    void p.onSearchDone?.();
  });

  return (
    <Form {...searchForm}>
      <form
        onSubmit={onSubmit}
        className={cn('flex gap-2 w-full', p.className)}
      >
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
