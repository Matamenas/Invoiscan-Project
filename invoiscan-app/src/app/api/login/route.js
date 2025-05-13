    //We want to specify to react that in this file we are going to have client-side code (I.e. Code that will run in the browser)
'use client';
//We are importing everything from the 'React library' using the '*' for everything
import * as React from 'react';
import { Container, Box, TextField, Button, Typography } from '@mui/material';
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
/*
So we define a function called 'Login'
- 'export': Means that this function can be exported and can be used in other files in our project
- 'default': Means that it is the default exported function.
    NOTE: This means we can import it without curly brackets.
- '{ onSuccess }': This is a 'prop' we pass into the function (Equivalent of a parameter in Java)
    NOTE: This prop is called when the Login is successful
 */
export default function Login({ onSuccess }) {
    /*
    We declare two constants:
    - 'accountType': A state variable that stores the account type of the user
    - 'setAccountType': This constant updates/ changes the state of the 'accountType' state variable.
    NOTE: Initial state for 'accountType' is Customer as it is more likely for the user to be logging in
     */
    const [accountType, setAccountType] = React.useState('Customer');
    /*
    We declare two constants:
    - 'error': A state variable that tracks any errors during the login process.
    - 'setError': This function updates or clears the 'error' state variable.
    NOTE: Initial value for 'error' is 'null', as there are no errors initially.
    */
    const [error, setError] = React.useState(null);

    /*
    We define a function called 'handleSubmit' to handle the form submission.
    - 'async': This function will return a promise, as it makes a network request to the server.
    - 'event': Represents the form submission event triggered by the user.
    */
    const handleSubmit = async (event) => {
        //We prevent the default form submission behavior to handle it manually
        event.preventDefault();

        /*
        We retrieve the form data entered by the user using the 'FormData' API.
        - 'event.currentTarget': Refers to the form element being submitted.
        - 'data.get("email")': Extracts the value of the input field with the attribute called 'email'
        - 'data.get("pass")': Extracts the value of the input field with the attribute called 'pass'
        */
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const pass = data.get('pass');

        try {
            /*
            We define a constant called 'response' to store the response received from the server
            - We make a network request to the login API to validate user credentials.
            - 'fetch': Performs a GET request to the server with email, password, and account type as query parameters.
            */
            const response = await fetch(
                `/api/loginHandling?email=${email}&pass=${pass}&accType=${accountType}`
            );
            /*
            We create a constant called 'result'
            - Parse the response data into a JSON object for easier processing.
            - 'result': Stores the parsed JSON object containing the success status and any message returned by the API.
            */
        
            const result = await response.json();
            /*
            Check if the response is successful and the login was processed correctly.
            - 'response.ok': Verifies that the HTTP status code indicates success (e.g., 200).
            - 'result.success': Ensures the API confirmed a successful login.
            NOTE: This process is the same as in the 'dashboard'
            */
            if (response.ok && result.success) {
                /*
                Use a Console Log to display a success message to the developer.
                - 'result.message': A custom message returned by the server indicating login success.
                */
                console.log('Login successful:', result.message);

                //This is where we call our 'onSuccess' function passed as a prop to notify the parent component of a successful login.
                onSuccess();
            }
            else {
                /*
                If the login fails, display an error message.
                - 'result.message || "Login failed"': Uses the server's error message or a default message if none exists.
                */
                setError(result.message || 'Login failed');
            }
        }
        catch (error) {
            /*
            If an unexpected exception is caught during the login process, log it to the console for debugging.
            */
            console.error('Error during login:', error);

            /*
            We then update the 'error' state variable with a generic error message to inform the user.
            */
            setError('An unexpected error occurred.');
        }
    };

    /*
    Considering our '/login' directory is a client-side class we include our frontend code to render the Login component
    */
    return (
        <Container maxWidth="sm">
            <Typography variant="h6" textAlign="center" mb={2}>
                Login
            </Typography>

            {/* Buttons for selecting the account type (Customer or Manager). */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                <Button
                    // Style and behavior for the 'Customer' button.
                    variant={accountType === 'Customer' ? 'contained' : 'outlined'}
                    onClick={() => setAccountType('Customer')}
                    sx={{
                        backgroundColor: accountType === 'Customer' ? 'green' : 'transparent',
                        color: accountType === 'Customer' ? 'white' : 'black',
                        borderColor: accountType === 'Customer' ? 'green' : 'black',
                        '&:hover': {
                            backgroundColor: accountType === 'Customer' ? 'darkgreen' : 'lightgray'
                        }
                    }}>
                    Customer
                </Button>

                <Button
                    //Style and behavior for the 'Manager' button.
                    variant={accountType === 'Manager' ? 'contained' : 'outlined'}
                    onClick={() => setAccountType('Manager')}
                    sx={{
                        backgroundColor: accountType === 'Manager' ? 'green' : 'transparent',
                        color: accountType === 'Manager' ? 'white' : 'black',
                        borderColor: accountType === 'Manager' ? 'green' : 'black',
                        '&:hover': {
                            backgroundColor: accountType === 'Manager' ? 'darkgreen' : 'lightgray'
                        }
                    }}>
                    Manager
                </Button>
            </Box>

            {/* Login form with email, password, and a 'Remember Me' checkbox. */}
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    margin="normal"
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    required
                />
                <TextField
                    margin="normal"
                    fullWidth
                    id="pass"
                    label="Password"
                    name="pass"
                    type="password"
                    required
                />
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                />

                {/* Display error messages if the 'error' state variable is not null. */}
                {error && (
                    <Typography color="error" textAlign="center" mt={2}>
                        {error}
                    </Typography>
                )}

                {/* Submit button to trigger the form submission process. */}
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, backgroundColor: 'black' }}>
                    Sign In
                </Button>
            </Box>
        </Container>
    );
}