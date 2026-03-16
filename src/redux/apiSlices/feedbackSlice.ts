import { api } from "../api/baseApi";
import { TagTypes } from "../tag-types";

const FEEDBACK_API = "/feedback";

const feedbackSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all feedback (with optional query)
    getFeedbacks: builder.query({
      query: ({ query }: { query?: Record<string, any> } = {}) => ({
        url: FEEDBACK_API,
        params: query || {},
        method: "GET",
      }),
      providesTags: [TagTypes.feedback],
    }),

    // Get details for a single feedback
    getFeedbackDetails: builder.query({
      query: (id: string) => ({
        url: `${FEEDBACK_API}/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: TagTypes.feedback, id }],
    }),

    // Create a new feedback
    createFeedback: builder.mutation({
      query: (formData: FormData) => ({
        url: FEEDBACK_API,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [TagTypes.feedback],
    }),

    // Update details for a specific feedback
    updateFeedback: builder.mutation({
      query: ({ id, data }: { id: string; data: Record<string, any> }) => ({
        url: `${FEEDBACK_API}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        TagTypes.feedback,
        { type: TagTypes.feedback, id },
      ],
    }),

    // Delete a feedback
    deleteFeedback: builder.mutation({
      query: (id: string) => ({
        url: `${FEEDBACK_API}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TagTypes.feedback],
    }),
  }),
});

export const {
  useGetFeedbacksQuery,
  useGetFeedbackDetailsQuery,
  useCreateFeedbackMutation,
  useUpdateFeedbackMutation,
  useDeleteFeedbackMutation,
} = feedbackSlice;