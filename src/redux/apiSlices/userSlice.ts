import { api } from "../api/baseApi";
import { TagTypes } from "../tag-types";

const userSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: ({query}:{query?:Record<string, any>}) => {
                return {
                    url: "/user",
                    params: query || {},
                    method: "GET",
                };
            },
            
        }),
        changeStatusUser: builder.mutation({
            query: ({id}:{id:string}) => {
                return {
                    method: "PATCH",
                    url: `/user/${id}`,
                };
            },
        }),
        updateUser: builder.mutation({
            query: (formData: FormData) => {
                return {
                    method: "PATCH",
                    url: "/user",
                    body: formData,
                    formData: true,
                };
            },
            invalidatesTags: [TagTypes.user], 
        }),
        updateSingleUser: builder.mutation({
            query: ({ id, formData }: { id: string; formData: FormData }) => {
                return {
                    method: "PATCH",
                    url: `/user/single-user/${id}`,
                    body: formData,
                    formData: true,
                };
            },
        }),
        updatePendingUserProfile: builder.mutation({
            query: ({ id, status }: { id: string; status: string }) => {
                return {
                    method: "PATCH",
                    url: `/user/approve-pending-users/${id}`,
                    body: status,
                    formData: true,
                };
            },
        }),
        changePassword: builder.mutation({
            query: ({
                currentPassword,
                newPassword,
                confirmPassword,
            }: {
                currentPassword: string;
                newPassword: string;
                confirmPassword: string;
            }) => {
                return {
                    method: "POST",
                    url: `/auth/change-password`,
                    body: {
                        currentPassword,
                        newPassword,
                        confirmPassword,
                    },
                    // no formData
                };
            },
        }),

        getHosts: builder.query({
            query: ({query}:{query?:string}) => {
                return {
                    url: "/user/host?"+query,
                };
            },
        }),
        getStatistics: builder.query({
            query: () => {
                return {
                    url: "/user/statistics",
                    method: "GET",
                };
            },
        }),

        getUserStatistics: builder.query({
            query: ({year}:{year?:string}) => {
                return {
                    url: "/user/statistics?year="+year,
                    method: "GET",
                };
            },
        }),

        sendPushNotification: builder.mutation({
            query: ({usersId = [], message}: {
                usersId?: string[],
                message: string
            }) => ({
                url: '/user/push-notification',
                method: 'POST',
                body: {usersId, message}
            })
        }),
    }),
});
export const {useGetUsersQuery, useChangeStatusUserMutation,useGetHostsQuery, useGetStatisticsQuery, useGetUserStatisticsQuery, useUpdateUserMutation,useChangePasswordMutation, useUpdateSingleUserMutation , useSendPushNotificationMutation, useUpdatePendingUserProfileMutation } = userSlice;