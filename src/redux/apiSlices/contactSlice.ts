import { api } from "../api/baseApi";
import { TagTypes } from "../tag-types";

const LS_API = "/contact-us";
const contactUsSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get all contactUs messages (with optional query)
        getContactUs: builder.query({
            query: ({ query }: { query?: Record<string, any> } = {}) => ({
                url: LS_API,
                params: query || {},
                method: "GET",
            }),
            providesTags: [TagTypes.contactUs],
        }),
        // Get details for a single contactUs message
        getContactUsDetails: builder.query({
            query: (id: string) => ({
                url: `${LS_API}/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: TagTypes.contactUs, id }],
        }),
        // Create a new contactUs message (now using FormData)
        // Accepts FormData that may include an image (multipart/form-data)
        createContactUs: builder.mutation({
            query: (formData: FormData) => ({
                url: LS_API,
                method: "POST",
                body: formData,
                // Let fetch set the Content-Type automatically for FormData (including files like images)
            }),
            invalidatesTags: [TagTypes.contactUs],
        }),
        // Update details for a specific contactUs message (now using FormData)
        updateContactUs: builder.mutation({
            query: ({ id, data }: { id: string, data: FormData }) => ({
                url: `${LS_API}/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                TagTypes.contactUs,
                { type: TagTypes.contactUs, id }
            ],
        }),
        // Delete a contactUs message
        deleteContactUs: builder.mutation({
            query: (id: string) => ({
                url: `${LS_API}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [TagTypes.contactUs],
        }),
    }),
});

export const {
    useGetContactUsQuery,
    useGetContactUsDetailsQuery,
    useCreateContactUsMutation,
    useUpdateContactUsMutation,
    useDeleteContactUsMutation
} = contactUsSlice;