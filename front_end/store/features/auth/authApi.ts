import { apiSlice } from "../api/ApiSlice";
import { userRegistration } from './authSlice';

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
                url: "users/registration",
                method: "POST",
                body: data,
                credentials: "include" as const, // Fixed spelling here
            }), 
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    console.log("Register Query")
                    dispatch(
                        userRegistration({
                            token: result.data.activationToken
                        })
                    );
                } catch (error: any) {
                    // Handle the error if needed
                    console.log(process.env.NEXT_PUBLIC_SERVER_URI)
                    console.log(error)
                }
            }
        }),
        activation: builder.mutation({
            query: ({ activation_token, activation_code }) => ({
                url: "active-user",
                method: "POST",
                body: {
                    activation_token, activation_code
                }
            })
        })
    })
});

export const { useRegisterMutation, useActivationMutation } = authApi;
