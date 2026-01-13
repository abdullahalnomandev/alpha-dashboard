import { api } from "../api/baseApi";
import { TagTypes } from "../tag-types";

const LS_API = "/membership-feature";
const membershipFeatureSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get all membership features (with optional query)
        getMembershipFeatures: builder.query({
            query: ({ query }: { query?: Record<string, any> } = {}) => ({
                url: LS_API,
                params: query || {},
                method: "GET",
            }),
            providesTags: [TagTypes.membershipFeature],
        }),
        // Get details for a single membership feature
        getMembershipFeatureDetails: builder.query({
            query: (id: string) => ({
                url: `${LS_API}/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: TagTypes.membershipFeature, id }],
        }),
        // Create a new membership feature
        createMembershipFeature: builder.mutation({
            query: (formData: FormData) => ({
                url: LS_API,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [TagTypes.membershipFeature],
        }),
        // Update details for a specific membership feature
        updateMembershipFeature: builder.mutation({
            query: ({ id, data }: { id: string, data: Record<string, any> }) => ({
                url: `${LS_API}/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                TagTypes.membershipFeature,
                { type: TagTypes.membershipFeature, id }
            ],
        }),
        // Delete a membership feature
        deleteMembershipFeature: builder.mutation({
            query: (id: string) => ({
                url: `${LS_API}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [TagTypes.membershipFeature],
        }),
    }),
});

export const {
    useGetMembershipFeaturesQuery,
    useGetMembershipFeatureDetailsQuery,
    useCreateMembershipFeatureMutation,
    useUpdateMembershipFeatureMutation,
    useDeleteMembershipFeatureMutation
} = membershipFeatureSlice;