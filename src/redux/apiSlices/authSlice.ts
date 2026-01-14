import { api } from "../api/baseApi";
import { TagTypes } from "../tag-types";
const authSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    otpVerify: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/verify-email",
          body: data,
        };
      },
    }),

    login: builder.mutation({
      query: (data) => {
        console.log("data is ", data);
        return {
          method: "POST",
          url: "/auth/admin-login",
          body: data,
        };
      },
    }),

    forgetPassword: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/forget-password",
          body: data,
        };
      },
    }),

    resetPassword: builder.mutation({
      query: (value) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: value,
      }),
    }),

    changePassword: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/change-password",
          body: data,
        };
      },
    }),

    updateProfile: builder.mutation({
      query: (data) => {
        return {
          method: "PATCH",
          url: "/user/profile",
          body: data,
        };
        
      },
    }),

    profile: builder.query({
      query: () => ({
        url: "/user/my-profile",
        method: "GET",
      }),
      providesTags: [TagTypes.user], // Provided tag for RTK Query caching/invalidation
    }),

  }),
});

export const {
  useOtpVerifyMutation,
  useLoginMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useProfileQuery,
} = authSlice;
