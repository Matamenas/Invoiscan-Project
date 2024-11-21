import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { app } from "./firebase";
export default function Login () {
    useEffect(() => {
        const ui = firebaseui.auth.AuthUI.getInstance() ||
            new firebaseui.auth.AuthUI(getAuth(app));

        ui.start("#firebaseui-auth-container", {
            signInSuccessUrl: "/home",
            signInOptions: [{
                provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            },
            {
                provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                clientId:
                    "622568274870-a12541880s20fahblg2ehiq1c2bmim38.apps.googleusercontent.com",
            },
            {
                provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            },
            {
                provider: firebase.auth.GithubAuthProvider.PROVIDER_ID,
            },
            ],
            credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
        });
    }, []);

    return (
        <div>
        <h1>Account Setup</h1>
        <div id={"firebaseui-auth-container"}></div>
        </div>
    )
}