const msalConfig = {
    auth: {
        clientId: "c9e918a7-edd1-4643-931b-1b6e966654e5", // Replace with your Azure AD client ID
        authority: "https://login.microsoftonline.com/bcf732fc-7487-4fd0-b85b-33602eef2fc1", // Replace with your Azure AD tenant ID
        redirectUri: "http://localhost:1313", // Replace with your redirect URI
    },
    cache: {
        cacheLocation: "localStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: true // Set this to true if you are having issues on IE11 or Edge
    }
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

document.addEventListener("DOMContentLoaded", function() {
    msalInstance.handleRedirectPromise().then(response => {
        if (response !== null) {
            msalInstance.setActiveAccount(response.account);
        }

        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
            msalInstance.acquireTokenSilent({
                scopes: ["User.Read"], // Replace with your scopes
                account: accounts[0]
            }).then(tokenResponse => {
                console.log("Token acquired silently:", tokenResponse.accessToken);
                // Token is valid and cached
            }).catch(error => {
                console.log("Silent token acquisition failed:", error);
                // Token is not valid, prompt user to login
                msalInstance.loginRedirect();
            });
        } else {
            // No accounts signed in, prompt user to login
            msalInstance.loginRedirect();
        }
    }).catch(error => {
        console.error(error);
    });
});