import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, SearchIcon } from 'lucide-react';
import { executeServerAction } from 'next-sa/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { identifyCode } from '@/app/actions';
import { useLocale } from '@/contexts/locale';
import { useTranslate } from '@/contexts/translate';
import { addLocale } from '@/utilities/url-helpers';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Form, FormControl, FormField, FormItem } from './ui/form';
import { Textarea } from './ui/textarea';

const identifyCodeSchema = z.object({
  code: z.string().min(1).max(1000),
});

interface IdentifyCodeButtonProps {
  onIdentifyDone?: () => void;
}

export function IdentifyCodeButton(p: IdentifyCodeButtonProps) {
  const locale = useLocale();
  const t = useTranslate();
  const router = useRouter();

  const identifyCodeForm = useForm({
    resolver: zodResolver(identifyCodeSchema),
    defaultValues: { code: '' },
  });

  const [isIdentifyOpen, setIdentifyOpen] = useState(false);
  const [result, setResult] = useState<string | undefined | null>();
  const [isResultOpen, setResultOpen] = useState(false);
  const [isIdentifying, setIdentifying] = useState(false);

  const onSubmit = identifyCodeForm.handleSubmit(async (data) => {
    if (isIdentifying) return;
    setIdentifying(true);

    const language = await executeServerAction(identifyCode, data.code);

    if (language && typeof language === 'object') {
      const pathname = addLocale(`/language/${language.id}`, locale);
      const url = new URL(pathname, window.location.origin);
      url.searchParams.set('code', data.code);

      router.push(url.pathname + url.search);
      setIdentifyOpen(false);
      p.onIdentifyDone?.();
      identifyCodeForm.reset();
    } else {
      setResult(language);
      setResultOpen(true);
    }

    setIdentifying(false);
  });

  useEffect(() => {
    if (isIdentifyOpen === false) {
      identifyCodeForm.reset();
    }
  }, [isIdentifyOpen]);

  return (
    <>
      <Dialog open={isIdentifyOpen} onOpenChange={setIdentifyOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">{t.identify()}</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogTitle>{t.identify()}</DialogTitle>
          <DialogDescription>{t.identify.description()}</DialogDescription>

          <Form {...identifyCodeForm}>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <FormField
                control={identifyCodeForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={t.identify.code.description()}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isIdentifying}>
                {isIdentifying ? (
                  <>
                    <Loader2Icon className="mr-1 h-4 w-4 animate-spin" />
                    {t.identify.ing()}
                  </>
                ) : (
                  <>
                    <SearchIcon className="mr-1 h-4 w-4" />
                    {t.identify()}
                  </>
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isResultOpen} onOpenChange={setResultOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.identify.prediction()}</AlertDialogTitle>
            <AlertDialogDescription>
              {result
                ? t.identify.prediction.identified_as({ language_name: result })
                : t.identify.prediction.could_not_identify()}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogAction>
              {t.identify.prediction.okay()}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/*
export function IdentifyCodeButton() {
  const locale = useLocale();
  const t = useTranslate();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const identifyCodeForm = useForm({
    resolver: zodResolver(identifyCodeSchema),
    defaultValues: { code: '' },
  });

  const [isIdentifying, setIdentifying] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const onSubmit = identifyCodeForm.handleSubmit(async (data) => {
    if (isIdentifying) return;
    setIdentifying(true);

    const language = await executeServerAction(identifyCode, data.code);

    if (language) {
      if (typeof language === 'string') {
        // TODO
      } else {
        const pathname = addLocale(`/language/${language.id}`, locale);
        const url = new URL(pathname, window.location.origin);
        url.searchParams.set('code', data.code);

        if (url.href === window.location.href) {
          setOpen(false);
          window.location.href = url.href;
          window.location.reload();
        } else {
          router.push(url.href);
          setOpen(false);
          identifyCodeForm.reset();
        }
      }
    } else {
      // TODO
    }

    setIdentifying(false);
  });

  
}
*/
