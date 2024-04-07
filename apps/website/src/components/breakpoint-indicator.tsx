export function BreakpointIndicator() {
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-1 left-1 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-white text-xs">
      <span className="block 2xl:hidden 2xs:hidden lg:hidden md:hidden sm:hidden xl:hidden xs:hidden">
        3xs
      </span>
      <span className="hidden 2xs:block 2xl:hidden lg:hidden md:hidden sm:hidden xl:hidden xs:hidden">
        2xs
      </span>
      <span className="hidden xs:block 2xl:hidden 2xs:hidden lg:hidden md:hidden sm:hidden xl:hidden">
        xs
      </span>
      <span className="hidden sm:block 2xl:hidden 2xs:hidden lg:hidden md:hidden xl:hidden xs:hidden">
        sm
      </span>
      <span className="hidden md:block 2xl:hidden 2xs:hidden lg:hidden sm:hidden xl:hidden xs:hidden">
        md
      </span>
      <span className="hidden lg:block 2xl:hidden 2xs:hidden md:hidden sm:hidden xl:hidden xs:hidden">
        lg
      </span>
      <span className="hidden xl:block 2xl:hidden 2xs:hidden lg:hidden md:hidden sm:hidden xs:hidden">
        xl
      </span>
      <span className="hidden 2xl:block 2xs:hidden lg:hidden md:hidden sm:hidden xl:hidden xs:hidden">
        2xl
      </span>
    </div>
  );
}
