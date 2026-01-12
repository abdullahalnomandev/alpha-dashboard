import { api } from "../api/baseApi";
import { TagTypes } from "../tag-types";

const LS_API = "/category";
const offerCategorySlice = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get all offer categories (with optional query)
        getOfferCategories: builder.query({
            query: ({ query }: { query?: Record<string, any> } = {}) => ({
                url: LS_API,
                params: query || {},
                method: "GET",
            }),
            providesTags: [TagTypes.offerCategory],
        }),
        // Get details for a single offer category
        getOfferCategoryDetails: builder.query({
            query: (id: string) => ({
                url: `${LS_API}/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: TagTypes.offerCategory, id }],
        }),
        // Create a new offer category
        createOfferCategory: builder.mutation({
            query: (formData: FormData) => ({
                url: LS_API,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [TagTypes.offerCategory],
        }),
        // Update details for a specific offer category (now expects FormData)
        updateOfferCategory: builder.mutation({
            query: ({ id, formData }: { id: string, formData: FormData }) => ({
                url: `${LS_API}/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                TagTypes.offerCategory,
                { type: TagTypes.offerCategory, id }
            ],
        }),
        // Delete an offer category
        deleteOfferCategory: builder.mutation({
            query: (id: string) => ({
                url: `${LS_API}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [TagTypes.offerCategory],
        }),
    }),
});

export const {
    useGetOfferCategoriesQuery,
    useGetOfferCategoryDetailsQuery,
    useCreateOfferCategoryMutation,
    useUpdateOfferCategoryMutation,
    useDeleteOfferCategoryMutation
} = offerCategorySlice;