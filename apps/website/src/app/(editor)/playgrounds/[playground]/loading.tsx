import { EditorWrapperSkeleton } from './wrapper/skeleton';

export default function EditorLoadingPage() {
  return (
    <>
      <style>{`
        body{overflow-y:hidden!important;}
        body[data-scroll-locked]{margin-right:0px!important;}
      `}</style>
      <EditorWrapperSkeleton className="m-1.5 mt-0" />
    </>
  );
}
