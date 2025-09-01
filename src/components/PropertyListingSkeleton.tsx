// components/PropertyListingSkeleton.tsx
export default function PropertyListingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
        >
          {/* Image Skeleton */}
          <div className="aspect-[4/3] bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />

          {/* Content Skeleton */}
          <div className="p-6 space-y-4">
            {/* Price Skeleton */}
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded w-1/2" />

            {/* Title and Location Skeleton */}
            <div className="space-y-2">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded w-3/4" />
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded w-1/2" />
            </div>

            {/* Features Skeleton */}
            <div className="flex justify-between">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded w-8" />
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded w-8" />
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded w-12" />
            </div>

            {/* Buttons Skeleton */}
            <div className="flex space-x-2 pt-2">
              <div className="flex-1 h-10 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />
              <div className="flex-1 h-10 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
