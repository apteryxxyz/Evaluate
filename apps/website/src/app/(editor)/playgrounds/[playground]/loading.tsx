import { Skeleton } from '@evaluate/components/skeleton';

export default function EditorLoadingPage() {
  return (
    <>
      <style>{`
        body{overflow-y:hidden!important;}
        body[data-scroll-locked]{margin-right:0px!important;}
      `}</style>
      <div className="m-1.5 mt-0 flex h-[calc(-3.5rem_+_100vh_-_12px)] lg:h-[calc(-3.5rem_+_100vh_-_6px)]">
        <Skeleton className="m-1.5 hidden w-[15vw] rounded-xl border-2 bg-card lg:block" />
        <Skeleton className="m-1.5 w-[55vw] rounded-xl border-2 bg-card" />
        <Skeleton className="m-1.5 hidden w-[30vw] rounded-xl border-2 bg-card lg:block" />
      </div>
    </>
  );
}
