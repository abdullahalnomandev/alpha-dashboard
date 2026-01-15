import { api } from "../api/baseApi";
import { TagTypes } from "../tag-types";

const CONTACT_FORM_API = "/contact-form";

const contactFormSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        // Submit a new contact form
        submitContactForm: builder.mutation({
            query: (formData: Record<string, any> | FormData) => ({
                url: CONTACT_FORM_API,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [TagTypes.contactForm],
        }),
        // Optionally get submitted contact forms (for admin view)
        getContactForms: builder.query({
            query: ({ query }: { query?: Record<string, any> } = {}) => ({
                url: CONTACT_FORM_API,
                params: query || {},
                method: "GET",
            }),
            providesTags: [TagTypes.contactForm],
        }),
        // Optionally get details for a single submitted contact form
        getContactFormDetails: builder.query({
            query: (id: string) => ({
                url: `${CONTACT_FORM_API}/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: TagTypes.contactForm, id }],
        }),
        // Optionally delete a contact form (for admin)
        deleteContactForm: builder.mutation({
            query: (id: string) => ({
                url: `${CONTACT_FORM_API}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [TagTypes.contactForm],
        }),
    }),
});

export const {
    useSubmitContactFormMutation,
    useGetContactFormsQuery,
    useGetContactFormDetailsQuery,
    useDeleteContactFormMutation
} = contactFormSlice;