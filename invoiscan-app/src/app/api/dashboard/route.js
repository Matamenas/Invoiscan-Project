//We want to specify to react that in this file we are going to have client-side code (I.e. Code that will run in the browser)
'use client';
//We are importing everything from the 'React library' using the '*' for everything
import * as React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
/*
We are importing 'hooks' from the React library:
1) 'useEffect': Allows me to run code that I want to check after the UI for my component AKA webpage is loaded
    NOTE: In other words, I want to check if a session is active for example, I will have this in my useEffect method as
    I NEED to know if a session is active to determine if certain content should be seen from the user
2) 'useState': Allows me to store and change the state of a variable that a component relies on, like keeping track of a
    session, user input, or toggling a UI element. (I.e. The 'user' constant whose state is null to begin with)
*/
import { useEffect, useState } from 'react';
/*s
We are importing the 'Container' component from the 'MUI Framework' library. The container is the chassis for which all
the parts are allowed to be mounted on.
 */
import Container from '@mui/material/Container';
//We import the 'Button' component from the 'MUI Framework'. Used for our 'Manager/ Customer' and 'View Products' functionalities
import Button from '@mui/material/Button';
//We import the 'Typography' component to render components such as Buttons with predefined styles
import Typography from '@mui/material/Typography';
//We import the 'Box' component to enable flexible layout component to create styled containers
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
/*
So we define a function called 'Dashboard'
- 'export': Means that this function can be exported and can be used in other files in our project
- 'default': Means that it is the default exported function.
    NOTE: This means we can import it without curly brackets.
- '{ showProducts }': This is a 'prop' we pass into the function (Equivalent of a parameter in Java)
    NOTE: This prop is called when the 'View Products' button is called below
 */
export default function Dashboard({}) {
    /*
    We declare two constants:
    - 'user': A state variable that stores the session data for our logged-in user
    - 'setUser': This constant updates/ changes the state of the 'user' state variable.
    NOTE: Initial value for 'user' is null as at this point we haven't checked if the user is logged-in or not (AKA, no session)
     */
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState(null);

    /*
    We declare two constants:
    - 'loading': A state variable that tracks the page's loading status
    - 'setLoading': This constant updates/ changes the state of the 'loading' state variable.
       NOTE: Initial value for 'loading' is set to TRUE as at this point in the program we are in the loading phase initially
     */
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState({totalUsers: 0, totalRecentUsers: 0});
    const [editUser, setEditUser] = useState(null);
    const [editName, setEditName] = useState('');
    /*
    We use the 'useEffect' method imported from the React library to ensure we check if a session is active after the
    component renders (The component is the Dashboard webpage)
    */
    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await fetch('/api/analytics');
                const data = await response.json();
                console.log("Fetched analytics:", data);
                setAnalytics(data);
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };
            fetchAnalytics();

        const fetchUsers = async () => {
            try {
                const response = await fetch('api/users');
                const data = await response.json();
                console.log("Fetched Users: ", data);
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users: ", error);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();

        /*
        We declare a constant called 'checkSession' that stores an asynchronous function.
        - 'async': Means that this function will return a promise. Considering we are checking if a session is valid,
            THAT is our promise.
         */
        const checkSession = async () => {
            //To catch potential issues or exceptions we put our session handling in a 'try' 'catch' block
            try {
                //We use a Console Log BEFORE the session is checked to keep a consistent timeline of events
                console.log("Checking session...");

                /*
                We declare a constant called 'response'
                - 'await': This function ensures that the next function 'fetch' returns something before the rest of the
                    async function and rest of the code is executed.
                - 'fetch()': This function performs a network request to the 'api' directory to fetch my 'sessionHandling'
                    file where the actual session checking occurs.
                - { credentials }: This is an optional argument passed to our 'fetch()' request that tells the browser
                    to include any session information stored in COOKIES in the 'fetch' request.
                - 'include': When the client and the server are on different domains or ports, we want to ensure
                    cross-origin requests. (AKA, we want to include session information even if it comes from a different port)
                 */
                const response = await fetch('../api/sessionHandling', { credentials: 'include' });

                /*
                We need to store the backend 'result' from our 'fetch()' request, therefore, we create a constant called
                'data'. This variable will store a parsed version of the network request.
                - 'await': This function ensures that the 'json' function returns something before moving on
                 */
                const data = await response.json();

                /*
                We use a Console Log AFTER the session is checked to keep a consistent timeline of events and print out
                the converted network request through the 'data' constant
                 */
                console.log("Session data fetched:", data);

                /*
                If the network request was successful and the session data exists we update the state of our 'user'
                state variable with the session data.
                NOTE: Even though we pass the 'data' constant in the 'setUser' method and not 'user', the data in the
                'data' constant is updating the state of 'user'
                - === 200': A successful network request will return 200
                 */
                if (response.status === 200 && data) {
                    setUser(data);
                }
                else {
                    /*
                    If either the response was unsuccessful (Therefore a different HTTP status is returned E.g. 404) or
                    the session data does not exist, we use Console Log to tell me, the developer, that there is no active session right now
                    */
                    console.log("No active session");

                    //We update the state of 'user' to null as session data does not exist
                    setUser(null);
                }
            }
            /*
            In case of an exceptions or errors that occur DURING the network request, we catch them.
            - 'error': Name of the variable that is passed in the 'catch' method that will store any errors
             */
            catch (error) {
                //We use a Console Log to display any errors that might have occurred during the session check
                console.error('Error checking session:', error);

                //We update the state of 'user' to null as session data does not exist
                setUser(null);
            }
            /*
            Whatever happens, we use a 'finally' block to stop the loading phase.
            (This does not mean that it stops the page from loading)
            NOTE: We set the 'loading' constant to false as it was originally set to true
             */
            finally {
                setLoading(false);
            }
        };

        /*
        NOW, we call the 'checkSession' function. This is because up until this point we haven't actually called or
        invoked it. We have just declared it.
        */
        checkSession();
        /*
        To ensure that the 'useEffect' method is run only once after the component is loaded, we pass an empty
        dependency array
         */
    }, []);

    const handleDelete = async (userId) => {
        try {
            await fetch('/api/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleUpdate = async () => {
        try {
            //Start empty and fill it out dynamically
            const updates = {};
            if (editUser.email) { updates.username = editUser.email; }
            if (editUser.pass) { updates.pass = editUser.pass; }
            if (Object.keys(updates).length === 0) {
                console.log("No updates provided. Skipping PATCH request.");
                return; }

            const response = await fetch('/api/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: editUser._id, updates })
            });

            if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }

            setUsers(users.map(user => user._id === editUser._id ? { ...user, ...updates } : user));
            setEditUser(null);
            alert('User updated successfully!');
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const isSaveDisabled = () => {
        if (!editUser) return true;
        const originalUser = users.find((u) => u._id === editUser._id);
        return (
            editUser.email === originalUser.username &&
            (!editUser.pass || editUser.pass.length === 0)
        );
    };

    if (loading) return <CircularProgress />;

    const chartData = [
        { name: "Total Users", count: analytics.totalUsers },
        { name: "New Users (7 Days)", count: analytics.totalRecentUsers }
    ]

    /*
    We declare a constant called 'handleLogout' that stores an asynchronous function.
    - 'async': Means that this function will return a promise. Considering we DELETING a session,
        THAT is our promise.
    */
    const handleLogout = async () => {
        try {
            /*
            We declare a constant called 'response'
            - 'await': This function ensures that the next function 'fetch' returns something before the rest of the
                async function and rest of the code is executed.
            - 'fetch()': This function performs a network request to the 'api' directory to fetch my 'sessionHandling'
            file where the actual session checking occurs.
            - { method: }: This option allows us to call a method within the 'api/logoutHandling' directory
            - 'DELETE': This is the name of the method that takes care of the DELETING of the session
            */
            const response = await fetch('/api/logoutHandling', { method: 'DELETE' });

            //If the network request was successful (Same as saying '== 200') then we will execute the following code
            if (response.ok) {
                /*
                Instead of a console log that the user won't be able to see, we use an alert
                - 'alert': A GUI component that is displayed over the currently loaded content (Same as a 'JMessageDialogBox' on Swing)
                 */
                alert('You have been logged out.');
                /*
                We declare a constant called 'sessionCheck'
                - We will make another request AFTER the session is destroyed to check if it has actually been destroyed
                */
                const sessionCheck = await fetch('/api/sessionHandling');
                /*
                Here we check the session status.
                - If the session is NOT ok (Using the !) then this means that the DELETION was successful
                 */
                if (!sessionCheck.ok) {
                    //We use a Console Log to display that the session was destroyed
                    console.log('Session successfully destroyed.');
                }
                else {
                    //If the session was not destroyed, then we return the user's session data in a readable JSON format
                    console.error('Session still active:', await sessionCheck.json());
                }
                /*
                Whether the session is destroyed or is still active, we return the user back to the '/home' directory.
                - 'window.location.href': This sets the browser location to the specified URL
                 */
                window.location.href = "/home";
            }
            else {
                //If the network request was unsuccessful (Same as saying '== 404') then we will use the console to display the error
                console.error('Failed to log out.');
            }
        }
        catch (error) {
            /*
            Since we only tell myself, the developer, that the user failed to log out, we might as well print out the
            specific details regarding the failed session destruction
             */
            console.error('Error during logout:', error);
        }
    };

    /*
    We have an 'if' condition that will check whether the page is still in the loading state
    - If 'loading' is set to TRUE, then we return a 'Loading...' message
    */
    if (loading) return <p>Loading...</p>;
    //If the user state is set to false, then we want to prompt the user to log in by returning a message
    if (!user) {
        return <p>You are not logged in. Please log in.</p>;
    }

    console.log("User account type:", user?.accType);

    const redirectToScanner = () => {
        window.location.href= "/Scanner"
    }

    /*
    This block of code will run if the 'user' is VALID (AKA set to True) and if the loading state is FALSE
     */
    return (
        //Use the `Container` component to wrap the content and limit its width
        <Container maxWidth="sm">
            <Typography variant="h4" sx={{ mb: 2 }}>
                Welcome, {user?.accType} to Invoiscan!
            </Typography>
            {/* Use `Box` for vertical alignment and spacing */}
            {user.accType === 'Manager' ? (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 4 }}>
                        Admin Dashboard - User Management
                    </Typography>

                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#4CAF50" />
                        </BarChart>
                    </ResponsiveContainer>

                <Box sx={{ mt: 4, whiteSpace: "nowrap",  margin: "auto"}}>
                    <Typography variant="h6">User Management</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Account Type</TableCell>
                                    <TableCell>Date Created</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users?.map((user) => (
                                    <TableRow key={user._id + (user.email || "no-email")}>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.accType}</TableCell>
                                        <TableCell>{new Date(user.createdAt).toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                sx={{ mr: 1 }}
                                                onClick={() => setEditUser(user)}>
                                                Edit
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleDelete(user._id)}>
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                    {editUser && (
                        <Box sx={{ mt: 4, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Edit User</Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={editUser.email}
                                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                    fullWidth/>
                                <TextField
                                    label="Password"
                                    type="password"
                                    value={editUser.pass || ''}
                                    onChange={(e) => setEditUser({ ...editUser, pass: e.target.value })}
                                    fullWidth/>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                    <Button
                                        onClick={handleUpdate}
                                        variant="contained"
                                        disabled={isSaveDisabled()}
                                        sx={{
                                            backgroundColor: isSaveDisabled() ? 'grey' : 'green',
                                            '&:hover': {
                                                backgroundColor: isSaveDisabled() ? 'grey' : 'darkgreen'
                                            }}}>
                                        Save
                                    </Button>
                                    <Button
                                        onClick={() => setEditUser(null)}
                                        variant="outlined">
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Box>
            ) : (
                <Box sx={{height: '70vh', textAlign: 'center', mt: 4}}>
                    <Button
                        variant="contained"
                        sx={{backgroundColor: 'green', color: 'white', '&:hover': {backgroundColor: 'darkgreen' }}}
                        onClick={redirectToScanner}>
                        Your Documents
                    </Button>
                </Box>
            )}
            {/* Button to log out, calls `handleLogout` when clicked */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: 'red',
                        color: 'white',
                        '&:hover': { backgroundColor: 'darkred' }
                    }}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>
        </Container>
    );
}
