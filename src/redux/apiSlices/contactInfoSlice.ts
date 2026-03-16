import { api } from "../api/baseApi";
import { TagTypes } from "../tag-types";

const TEAM_CONTACT_API = "/team-contact";

const teamContactSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        // Submit a new team contact form
        submitTeamContactForm: builder.mutation({
            query: (formData: Record<string, any> | FormData) => ({
                url: TEAM_CONTACT_API,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [TagTypes.contactForm],
        }),
        // Get submitted team contact forms (for admin view)
        getTeamContactForms: builder.query({
            query: ({ query }: { query?: Record<string, any> } = {}) => ({
                url: TEAM_CONTACT_API,
                params: query || {},
                method: "GET",
            }),
            providesTags: [TagTypes.contactForm],
        }),

        // update
        updateTeamContactForm: builder.mutation({
            query: ({ id, data }: { id: string, data: Record<string, any> }) => ({
                url: `${TEAM_CONTACT_API}/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: [TagTypes.contactForm],
        }),
        // Get details for a single submitted team contact form
        getTeamContactFormDetails: builder.query({
            query: (id: string) => ({
                url: `${TEAM_CONTACT_API}/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: TagTypes.contactForm, id }],
        }),
        // Delete a team contact form (for admin)
        deleteTeamContactForm: builder.mutation({
            query: (id: string) => ({
                url: `${TEAM_CONTACT_API}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [TagTypes.contactForm],
        }),
    }),
});

export const {
    useSubmitTeamContactFormMutation,
    useGetTeamContactFormsQuery,
    useGetTeamContactFormDetailsQuery,
    useDeleteTeamContactFormMutation,
    useUpdateTeamContactFormMutation
} = teamContactSlice;