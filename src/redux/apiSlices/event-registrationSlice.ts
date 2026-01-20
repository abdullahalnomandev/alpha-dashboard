import { api } from "../api/baseApi";
import { TagTypes } from "../tag-types";

const EVENT_REG_API = "/event-registration";
const eventRegistrationSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get all event registrations (with optional query)
        getEventRegistrations: builder.query({
            query: ({ query }: { query?: Record<string, any> } = {}) => ({
                url: EVENT_REG_API,
                params: query || {},
                method: "GET",
            }),
            providesTags: [TagTypes.eventRegistration],
        }),
        // Get details for a single event registration
        getEventRegistrationDetails: builder.query({
            query: (id: string) => ({
                url: `${EVENT_REG_API}/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: TagTypes.eventRegistration, id }],
        }),
        // Create a new event registration
        createEventRegistration: builder.mutation({
            query: (formData: FormData | Record<string, any>) => ({
                url: EVENT_REG_API,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [TagTypes.eventRegistration],
        }),
        // Update details for a specific event registration
        updateEventRegistration: builder.mutation({
            query: ({ id, data }: { id: string, data: Record<string, any> }) => ({
                url: `${EVENT_REG_API}/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                TagTypes.eventRegistration,
                { type: TagTypes.eventRegistration, id }
            ],
        }),
        // Delete an event registration
        deleteEventRegistration: builder.mutation({
            query: (id: string) => ({
                url: `${EVENT_REG_API}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [TagTypes.eventRegistration],
        }),
    }),
});

export const {
    useGetEventRegistrationsQuery,
    useGetEventRegistrationDetailsQuery,
    useCreateEventRegistrationMutation,
    useUpdateEventRegistrationMutation,
    useDeleteEventRegistrationMutation
} = eventRegistrationSlice;