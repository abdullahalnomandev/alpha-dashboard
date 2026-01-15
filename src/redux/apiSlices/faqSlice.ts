import { api } from "../api/baseApi";
import { TagTypes } from "../tag-types";

const LS_API = "/faq";
const faqSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get all faqs (with optional query)
        getFaqs: builder.query({
            query: ({ query }: { query?: Record<string, any> } = {}) => ({
                url: LS_API,
                params: query || {},
                method: "GET",
            }),
            providesTags: [TagTypes.faq],
        }),
        // Get details for a single faq
        getFaqDetails: builder.query({
            query: (id: string) => ({
                url: `${LS_API}/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: TagTypes.faq, id }],
        }),
        // Create a new faq
        createFaq: builder.mutation({
            query: (formData: FormData) => ({
                url: LS_API,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [TagTypes.faq],
        }),
        // Update details for a specific faq
        updateFaq: builder.mutation({
            query: ({ id, data }: { id: string, data: Record<string, any> }) => ({
                url: `${LS_API}/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                TagTypes.faq,
                { type: TagTypes.faq, id }
            ],
        }),
        // Delete a faq
        deleteFaq: builder.mutation({
            query: (id: string) => ({
                url: `${LS_API}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [TagTypes.faq],
        }),
    }),
});

export const {
    useGetFaqsQuery,
    useGetFaqDetailsQuery,
    useCreateFaqMutation,
    useUpdateFaqMutation,
    useDeleteFaqMutation
} = faqSlice;