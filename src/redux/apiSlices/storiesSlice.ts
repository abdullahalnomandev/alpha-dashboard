import { api } from "../api/baseApi";
import { TagTypes } from "../tag-types";

const LS_API = "/stories";
const storiesSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get all stories (with optional query)
        getStories: builder.query({
            query: ({ query }: { query?: Record<string, any> } = {}) => ({
                url: LS_API,
                params: query || {},
                method: "GET",
            }),
            providesTags: [TagTypes.story],
        }),
        // Get details for a single story
        getStoryDetails: builder.query({
            query: (id: string) => ({
                url: `${LS_API}/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: TagTypes.story, id }],
        }),
        // Create a new story
        createStory: builder.mutation({
            query: (formData: FormData) => ({
                url: LS_API,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [TagTypes.story],
        }),
        // Update details for a specific story
        updateStory: builder.mutation({
            query: ({ id, data }: { id: string, data: Record<string, any> }) => ({
                url: `${LS_API}/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                TagTypes.story,
                { type: TagTypes.story, id }
            ],
        }),
        // Delete a story
        deleteStory: builder.mutation({
            query: (id: string) => ({
                url: `${LS_API}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [TagTypes.story],
        }),
    }),
});

export const {
    useGetStoriesQuery,
    useGetStoryDetailsQuery,
    useCreateStoryMutation,
    useUpdateStoryMutation,
    useDeleteStoryMutation
} = storiesSlice;