import { api } from "../api/baseApi";
import { TagTypes } from "../tag-types";

const LS_API = "/sponsor";
const sponsorsSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get all sponsors (with optional query)
        getSponsors: builder.query({
            query: ({ query }: { query?: Record<string, any> } = {}) => ({
                url: LS_API,
                params: query || {},
                method: "GET",
            }),
            providesTags: [TagTypes.sponsor],
        }),
        // Get details for a single sponsor
        getSponsorDetails: builder.query({
            query: (id: string) => ({
                url: `${LS_API}/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: TagTypes.sponsor, id }],
        }),
        // Create a new sponsor
        createSponsor: builder.mutation({
            query: (formData: FormData) => ({
                url: LS_API,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [TagTypes.sponsor],
        }),
        // Update details for a specific sponsor (now expects FormData)
        updateSponsor: builder.mutation({
            query: ({ id, formData }: { id: string, formData: FormData }) => ({
                url: `${LS_API}/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                TagTypes.sponsor,
                { type: TagTypes.sponsor, id }
            ],
        }),
        // Delete a sponsor
        deleteSponsor: builder.mutation({
            query: (id: string) => ({
                url: `${LS_API}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [TagTypes.sponsor],
        }),
    }),
});

export const {
    useGetSponsorsQuery,
    useGetSponsorDetailsQuery,
    useCreateSponsorMutation,
    useUpdateSponsorMutation,
    useDeleteSponsorMutation
} = sponsorsSlice;