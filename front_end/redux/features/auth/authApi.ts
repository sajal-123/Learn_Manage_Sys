import { apiSlice } from "../api/ApiSlice";
import { userRegistration } from './authSlice';
import { userLoggedIn } from "./authSlice";
type RegistrationResponse = {
    message: string;
    activationToken: string;
}

type RegistrationData = {
    // message: string;
    // activationToken: string;
}

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<RegistrationResponse, RegistrationData>({
            query: (data) => ({
                url: "/users/registration",
                method: "POST",
                body: data,
                credentials: "include" as const, // Fixed spelling here
            }), 
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userRegistration({
                            token: result.data.activationToken
                        })
                    );
                } catch (error: any) {
                    // Handle the error if needed
                    console.log("error->",error)
                }
            }
        }),

        activation: builder.mutation({
            query: ({ activation_token, activation_code }) => ({
                url: "/users/activate-user",
                method: "POST",
                body: {
                    activation_token, activation_code
                }
            })
        }),
        login: builder.mutation({
            query: ({email,password}) => ({
                url: "/users/login",
                method: "POST",
                body: {email,password},
                credentials: "include" as const, // Fixed spelling here
            }), 
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userLoggedIn({
                            accessToken: result.data.accessToken,
                            user:result.data.user
                        })
                    );
                } catch (error: any) {
                    // Handle the error if needed
                    console.log("error->",error)
                }
            }
        }),

    })
});

export const { useRegisterMutation, useActivationMutation, useLoginMutation } = authApi;
