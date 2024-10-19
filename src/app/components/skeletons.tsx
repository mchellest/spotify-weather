const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_3s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function CardSkeleton() {
  return (
    <div className="p-5">
      <div className={`${shimmer} flex p-2 relative h-9 overflow-hidden rounded-xl bg-gray-100 bg-opacity-5 shadow-sm`}>
        <div className="h-5 w-5 rounded-md bg-gray-200 bg-opacity-5" />
        <div className="ml-2 h-5 w-16 rounded-md bg-gray-200 text-sm font-medium bg-opacity-5" />
      </div>
    </div>
    
  );
}

export function CardsSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}

