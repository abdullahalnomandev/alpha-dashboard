import { api } from "../api/baseApi";
import { TagTypes } from "../tag-types";

const LS_API = "/partner-request";
const partnerShipApplicationSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get all partnerShip applications (with optional query)
        getpartnerShipApplications: builder.query({
            query: ({ query }: { query?: Record<string, any> }) => ({
                url: LS_API,
                params: query || {},
                method: "GET",
            }),
            providesTags: [TagTypes.partnershipApplication],
        }),
        // Get details for a single partnerShip application
        getpartnerShipApplicationDetails: builder.query({
            query: (id: string) => ({
                url: `${LS_API}/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: TagTypes.partnershipApplication, id }],
        }),
        // Create a new partnerShip application
        createpartnerShipApplication: builder.mutation({
            query: (formData: FormData) => ({
                url: LS_API,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [TagTypes.partnershipApplication],
        }),
        // Update details for a specific partnerShip application
        updatepartnerShipApplication: builder.mutation({
            query: ({ id, data }: { id: string, data: Record<string, any> }) => ({
                url: `${LS_API}/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                TagTypes.partnershipApplication,
                { type: TagTypes.partnershipApplication, id }
            ],
        }),
        // Delete a partnerShip application
        deletepartnerShipApplication: builder.mutation({
            query: (id: string) => ({
                url: `${LS_API}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [TagTypes.partnershipApplication],
        }),
    }),
});

export const {
    useGetpartnerShipApplicationsQuery,
    useGetpartnerShipApplicationDetailsQuery,
    useCreatepartnerShipApplicationMutation,
    useUpdatepartnerShipApplicationMutation,
    useDeletepartnerShipApplicationMutation
} = partnerShipApplicationSlice;