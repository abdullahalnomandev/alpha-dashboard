import { api } from "../api/baseApi";
import { TagTypes } from "../tag-types";

const LS_API = "/event";
const eventSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get all events (with optional query)
        getEvents: builder.query({
            query: ({ query }: { query?: Record<string, any> }) => ({
                url: LS_API,
                params: query || {},
                method: "GET",
            }),
            providesTags: [TagTypes.event],
        }),
        // Get details for a single event
        getEventDetails: builder.query({
            query: (id: string) => ({
                url: `${LS_API}/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: TagTypes.event, id }],
        }),
        // Create a new event
        createEvent: builder.mutation({
            query: (formData: FormData) => ({
                url: LS_API,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [TagTypes.event],
        }),
        // Update details for a specific event
        updateEvent: builder.mutation({
            query: ({ id, data }: { id: string, data: Record<string, any> }) => ({
                url: `${LS_API}/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                TagTypes.event,
                { type: TagTypes.event, id }
            ],
        }),
        // Delete an event
        deleteEvent: builder.mutation({
            query: (id: string) => ({
                url: `${LS_API}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [TagTypes.event],
        }),
    }),
});

export const {
    useGetEventsQuery,
    useGetEventDetailsQuery,
    useCreateEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation
} = eventSlice;