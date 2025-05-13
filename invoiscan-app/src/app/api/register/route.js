'use client';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Register({ onSuccess }) {
    //Defuaulting the button to the customer
    const [accountType, setAccountType] = React.useState('Customer');

    const handleSubmit = (event) => {
        console.log("handling submit");
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let email = data.get('email');
        let pass = data.get('pass');

        console.log("Sent email: " + email);
        console.log("Sent pass: " + pass);
        console.log("Account Type: " + accountType);

        runDBCallAsync(
            `http://localhost:3000/api/registerHandling?email=${email}&pass=${pass}&accType=${accountType}`
        );
        console.log(`Registering with account type: ${accountType}`);
    };

    async function runDBCallAsync(url) {
        try {
            const res = await fetch(url);
            const data = await res.json();

            console.log("Response from server:", data);

            if (data.success) {
                console.log("Account creation successful!");
                onSuccess();
            } else {
                console.log("Account creation failed:", data.message);
            }
        } catch (error) {
            console.error("Error during API call:", error);
        }
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ height: '100vh' }}>
                <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
                    Create an Account!
                </Typography>
                {/* Account Type Selection */}
                <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
                    Select Account Type
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                    <Button
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

                {/* Form Layout used. Keeping it simple */}
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus/>

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="pass"
                        label="Password"
                        type="password"
                        id="pass"
                        autoComplete="current-password"/>

                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"/>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, backgroundColor: 'black' }}>
                        Register
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
