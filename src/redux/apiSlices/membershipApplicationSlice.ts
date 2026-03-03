import { api } from "../api/baseApi";
import { TagTypes } from "../tag-types";

const LS_API = "/membership-application";
const membershipApplicationSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get all membership applications (with optional query)
        getMembershipApplications: builder.query({
            query: ({ query }: { query?: Record<string, any> }) => ({
                url: LS_API,
                params: query || {},
                method: "GET",
            }),
            providesTags: [TagTypes.membershipApplication],
        }),
        // Get details for a single membership application
        getMembershipApplicationDetails: builder.query({
            query: (id: string) => ({
                url: `${LS_API}/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: TagTypes.membershipApplication, id }],
        }),
        // Create a new membership application
        createMembershipApplication: builder.mutation({
            query: (formData: FormData) => ({
                url: `${LS_API}/crate-from`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [TagTypes.membershipApplication],
        }),
        // Update details for a specific membership application
        updateMembershipApplication: builder.mutation<
            any,
            { id: string; data: FormData | Record<string, any> }
        >({
            query: ({ id, data }) => {
                const isFormData = data instanceof FormData;

                return {
                    url: `${LS_API}/${id}`,
                    method: "PATCH",
                    body: data,
                    headers: isFormData
                        ? undefined // Let the browser set Content-Type for FormData
                        : { "Content-Type": "application/json" },
                };
            },
            invalidatesTags: (_result, _error, { id }) => [
                TagTypes.membershipApplication,
                { type: TagTypes.membershipApplication, id },
            ],
        }),
        // Delete a membership application
        deleteMembershipApplication: builder.mutation({
            query: (id: string) => ({
                url: `${LS_API}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [TagTypes.membershipApplication],
        }),
    }),
});

export const {
    useGetMembershipApplicationsQuery,
    useGetMembershipApplicationDetailsQuery,
    useCreateMembershipApplicationMutation,
    useUpdateMembershipApplicationMutation,
    useDeleteMembershipApplicationMutation
} = membershipApplicationSlice;