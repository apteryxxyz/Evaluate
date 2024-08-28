export function BreakpointIndicator() {
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-1 left-1 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-white text-xs">
      <span className="block 2xs:hidden xs:hidden sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden">
        3xs
      </span>
      <span className="2xs:block hidden xs:hidden sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden">
        2xs
      </span>
      <span className="xs:block 2xs:hidden hidden sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden">
        xs
      </span>
      <span className="2xs:hidden hidden xs:hidden sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">
        sm
      </span>
      <span className="2xs:hidden hidden xs:hidden sm:hidden md:block lg:hidden xl:hidden 2xl:hidden">
        md
      </span>
      <span className="2xs:hidden hidden xs:hidden sm:hidden md:hidden lg:block xl:hidden 2xl:hidden">
        lg
      </span>
      <span className="2xs:hidden hidden xs:hidden sm:hidden md:hidden lg:hidden xl:block 2xl:hidden">
        xl
      </span>
      <span className="2xs:hidden hidden xs:hidden sm:hidden md:hidden lg:hidden xl:hidden 2xl:block">
        2xl
      </span>
    </div>
  );
}
