import { api } from "../api/baseApi";
import { TagTypes } from "../tag-types";

const LS_API = "/club";
const clubSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get all clubs (with optional query)
        getClubs: builder.query({
            query: ({ query }: { query?: Record<string, any> } = {}) => ({
                url: LS_API,
                params: query || {},
                method: "GET",
            }),
            providesTags: [TagTypes.club],
        }),
        // Get details for a single club
        getClubDetails: builder.query({
            query: (id: string) => ({
                url: `${LS_API}/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: TagTypes.club, id }],
        }),
        // Create a new club
        createClub: builder.mutation({
            query: (formData: FormData) => ({
                url: LS_API,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [TagTypes.club],
        }),
        // Update details for a specific club
        updateClub: builder.mutation({
            query: ({ id, data }: { id: string, data: Record<string, any> }) => ({
                url: `${LS_API}/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                TagTypes.club,
                { type: TagTypes.club, id }
            ],
        }),
        // Delete a club
        deleteClub: builder.mutation({
            query: (id: string) => ({
                url: `${LS_API}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [TagTypes.club],
        }),
    }),
});

export const {
    useGetClubsQuery,
    useGetClubDetailsQuery,
    useCreateClubMutation,
    useUpdateClubMutation,
    useDeleteClubMutation
} = clubSlice;