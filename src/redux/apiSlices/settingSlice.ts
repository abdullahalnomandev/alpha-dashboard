import { api } from "../api/baseApi";
import { TagTypes } from "../tag-types";

const API_ABOUT = "/settings/about";
const API_PRIVACY = "/settings/privacy-policy";
const API_TERMS = "/settings/terms-of-services";

const settingSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        // About
        getAbout: builder.query({
            query: () => ({
                url: API_ABOUT,
                method: "GET",
            }),
            providesTags: [TagTypes.setting],
        }),
        postAbout: builder.mutation({
            query: (body: Record<string, any>) => ({
                url: API_ABOUT,
                method: "POST",
                body,
            }),
            invalidatesTags: [TagTypes.setting],
        }),

        // Privacy Policy
        getPrivacyPolicy: builder.query({
            query: () => ({
                url: API_PRIVACY,
                method: "GET",
            }),
            providesTags: [TagTypes.setting],
        }),
        postPrivacyPolicy: builder.mutation({
            query: (body: Record<string, any>) => ({
                url: API_PRIVACY,
                method: "POST",
                body,
            }),
            invalidatesTags: [TagTypes.setting],
        }),

        // Terms of Services
        getTermsOfServices: builder.query({
            query: () => ({
                url: API_TERMS,
                method: "GET",
            }),
            providesTags: [TagTypes.setting],
        }),
        postTermsOfServices: builder.mutation({
            query: (body: Record<string, any>) => ({
                url: API_TERMS,
                method: "POST",
                body,
            }),
            invalidatesTags: [TagTypes.setting],
        }),
    }),
});

export const {
    useGetAboutQuery,
    usePostAboutMutation,
    useGetPrivacyPolicyQuery,
    usePostPrivacyPolicyMutation,
    useGetTermsOfServicesQuery,
    usePostTermsOfServicesMutation,
} = settingSlice;