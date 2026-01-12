import { api } from "../api/baseApi";
import { TagTypes } from "../tag-types";

const LS_API = "/exclusive-offer";
const exclusiveOfferSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get all offers (with optional query)
        getOffers: builder.query({
            query: ({ query }: { query?: Record<string, any> } = {}) => ({
                url: LS_API,
                params: query || {},
                method: "GET",
            }),
            providesTags: [TagTypes.offer],
        }),
        // Get details for a single offer
        getOfferDetails: builder.query({
            query: (id: string) => ({
                url: `${LS_API}/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: TagTypes.offer, id }],
        }),
        // Create a new offer
        createOffer: builder.mutation({
            query: (formData: FormData) => ({
                url: LS_API,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [TagTypes.offer],
        }),
        // Update details for a specific offer (now expects FormData)
        updateOffer: builder.mutation({
            query: ({ id, formData }: { id: string, formData: FormData }) => ({
                url: `${LS_API}/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                TagTypes.offer,
                { type: TagTypes.offer, id }
            ],
        }),
        // Delete an offer
        deleteOffer: builder.mutation({
            query: (id: string) => ({
                url: `${LS_API}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [TagTypes.offer],
        }),
    }),
});

export const {
    useGetOffersQuery,
    useGetOfferDetailsQuery,
    useCreateOfferMutation,
    useUpdateOfferMutation,
    useDeleteOfferMutation
} = exclusiveOfferSlice;