import type {
	DefaultOptions,
	UseInfiniteQueryOptions,
	UseQueryOptions,
} from "@tanstack/react-query";

/**
 * Reusable options type for normal React Query queries.
 *
 * Why:
 * - Avoids repeating the full UseQueryOptions generic everywhere.
 * - Allows individual queries to override only the options they need.
 *
 * Output:
 * AppQueryOptions<User> becomes a partial configuration object
 * that can be passed to useQuery().
 */
export type AppQueryOptions<
	TQueryFnData = unknown,
	TError = Error,
	TData = TQueryFnData,
	TQueryKey extends readonly unknown[] = readonly unknown[],
> = Partial<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>>;

/**
 * Reusable options type for infinite/paginated queries.
 *
 * Why:
 * - Keeps infinite query configuration consistent across the app.
 * - Supports pagination through TPageParam.
 *
 * Output:
 * AppInfiniteQueryOptions<Post, Error, Post[], ["posts"], number>
 * represents the configuration for an infinite query whose
 * page parameter is a number.
 */
export type AppInfiniteQueryOptions<
	TQueryFnData = unknown,
	TError = Error,
	TData = TQueryFnData,
	TQueryKey extends readonly unknown[] = readonly unknown[],
	TPageParam = unknown,
> = Partial<UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>>;

/**
 * Default React Query configuration used throughout the application.
 *
 * Why:
 * - Centralizes React Query behavior.
 * - Prevents every query from defining the same settings.
 * - Individual queries can still override these defaults.
 *
 * Output:
 * An object compatible with TanStack Query's DefaultOptions.
 */
export const defaultQueryOptions = {
	queries: {
		/**
		 * Retry a failed query only once.
		 *
		 * Why:
		 * Temporary network/server failures can recover automatically,
		 * but retrying too many times can make the UI feel slow.
		 *
		 * Output:
		 * Failed query → retry once → if it fails again, return the error.
		 */
		retry: 1,

		/**
		 * Keep successfully fetched data fresh for 5 minutes.
		 *
		 * Why:
		 * Prevents unnecessary API requests when the same data
		 * is requested repeatedly within a short period.
		 *
		 * Output:
		 * Data fetched at 10:00 → considered fresh until 10:05.
		 */
		staleTime: 5 * 60 * 1000,

		/**
		 * Keep unused query data in the cache for 30 minutes.
		 *
		 * Why:
		 * If the user leaves a screen and comes back shortly afterward,
		 * React Query can reuse the cached data instead of starting
		 * completely from scratch.
		 *
		 * Output:
		 * Query becomes unused → remains in cache for 30 minutes →
		 * then garbage collected.
		 */
		gcTime: 30 * 60 * 1000,

		/**
		 * Check the query when the component mounts.
		 *
		 * Why:
		 * Ensures that a query can refresh when the user returns
		 * to a screen.
		 *
		 * Note:
		 * If the cached data is still fresh because of staleTime,
		 * React Query generally won't need to refetch it.
		 */
		refetchOnMount: true,

		/**
		 * Refetch stale queries when the browser window gets focus.
		 *
		 * Why:
		 * Useful for web applications where users may switch
		 * between tabs and expect the latest data when they return.
		 *
		 * Output:
		 * User leaves browser tab → data changes on server →
		 * user returns → stale query can refetch.
		 */
		refetchOnWindowFocus: true,

		/**
		 * Refetch stale queries when the network connection
		 * becomes available again.
		 *
		 * Why:
		 * Handles temporary internet disconnections automatically.
		 *
		 * Output:
		 * Offline → request fails/is paused →
		 * internet returns → query can refetch.
		 */
		refetchOnReconnect: true,

		/**
		 * Only execute network requests while the application
		 * has an online connection.
		 *
		 * Why:
		 * Prevents unnecessary network failures while offline.
		 *
		 * Output:
		 * Offline → network query is paused →
		 * Online → query can continue/refetch.
		 */
		networkMode: "online",
	},

	mutations: {
		/**
		 * Do not automatically retry mutations.
		 *
		 * Why:
		 * Mutations change server data.
		 *
		 * Automatically retrying something like:
		 * - Create payment
		 * - Create booking
		 * - Submit form
		 *
		 * could potentially perform the action more than once.
		 *
		 * Output:
		 * Failed mutation → no automatic retry.
		 */
		retry: 0,

		/**
		 * Only execute mutations while the application is online.
		 *
		 * Why:
		 * Mutations normally require immediate communication with
		 * the backend.
		 *
		 * Output:
		 * Offline → mutation does not execute against the network.
		 */
		networkMode: "online",
	},
} satisfies DefaultOptions;
