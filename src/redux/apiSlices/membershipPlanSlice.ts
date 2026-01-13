import { api } from "../api/baseApi";
import { TagTypes } from "../tag-types";

const LS_API = "/membership-plan";
const membershipPlanSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get all membership plans (with optional query)
        getMembershipPlans: builder.query({
            query: ({ query }: { query?: Record<string, any> } = {}) => ({
                url: LS_API,
                params: query || {},
                method: "GET",
            }),
            providesTags: [TagTypes.membershipPlan],
        }),
        // Get details for a single membership plan
        getMembershipPlanDetails: builder.query({
            query: (id: string) => ({
                url: `${LS_API}/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: TagTypes.membershipPlan, id }],
        }),
        // Create a new membership plan
        createMembershipPlan: builder.mutation({
            query: (formData: FormData) => ({
                url: LS_API,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [TagTypes.membershipPlan],
        }),
        // Update details for a specific membership plan
        updateMembershipPlan: builder.mutation({
            query: ({ id, data }: { id: string, data: Record<string, any> }) => ({
                url: `${LS_API}/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                TagTypes.membershipPlan,
                { type: TagTypes.membershipPlan, id }
            ],
        }),
        // Delete a membership plan
        deleteMembershipPlan: builder.mutation({
            query: (id: string) => ({
                url: `${LS_API}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [TagTypes.membershipPlan],
        }),
    }),
});

export const {
    useGetMembershipPlansQuery,
    useGetMembershipPlanDetailsQuery,
    useCreateMembershipPlanMutation,
    useUpdateMembershipPlanMutation,
    useDeleteMembershipPlanMutation
} = membershipPlanSlice;