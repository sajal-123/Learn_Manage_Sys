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
                url: "/users/registration",
                method: "POST",
                body: data,
                credentials: "include" as const, // Fixed spelling here
            }), 
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    console.log(result)
                    console.log("Register Query")
                    // console.log(result.data.ActivationToken)
                    // console.log(result.data.message)
                    // console.log(result.data)
                    dispatch(
                        userRegistration({
                            token: result.data
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
                url: "/users/activate-user",
                method: "POST",
                body: {
                    activation_token, activation_code
                }
            })
        })
    })
});

export const { useRegisterMutation, useActivationMutation } = authApi;
