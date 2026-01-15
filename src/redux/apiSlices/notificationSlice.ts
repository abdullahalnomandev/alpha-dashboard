import { api } from "../api/baseApi";
import { TagTypes } from "../tag-types";

const LS_API = "/notification";
const notificationSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get notifications with optional query
        getNotifications: builder.query({
            query: (query?: Record<string, any>) => ({
                url: LS_API,
                method: "GET",
                params: query || {},
            }),
        }),
        // Update details for a specific notification (unchanged)
        updateNotification: builder.mutation({
            query: ({ id, data }: { id: string, data: Record<string, any> }) => ({
                url: `${LS_API}/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                TagTypes.notification,
                { type: TagTypes.notification, id }
            ],
        }),
        // Get notification count (no query params)
        getNotificationCount: builder.query({
            query: () => ({
                url: `${LS_API}/count`,
                method: "GET",
            }),
            providesTags: [TagTypes.notification],
        }),
        // Clear all notifications
        clearNotifications: builder.mutation({
            query: () => ({
                url: `${LS_API}/clear`,
                method: "POST",
            })
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useUpdateNotificationMutation,
    useGetNotificationCountQuery,
    useClearNotificationsMutation,
} = notificationSlice;