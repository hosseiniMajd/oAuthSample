import {HTTP} from "../../helpers/HTTP";
import {browserHistory} from "react-router";
import {setToken, isNotExistToken} from "../../helpers/token";
import {isEmpty} from "../../helpers/isEmpty";


export default class logic {

    component = null;

    constructor(c) {
        this.component = c;
    }

    checkExistTokenIfExistNavigateToDashboard = () => {
        if (isNotExistToken()) {
            this.component.setState({loading: false});
        } else {
            this.navigateToDashboard();
        }
    };

    updateUsername = (e) => {
        this.component.setState({username: e.target.value});
    };

    updatePassword = (e) => {
        this.component.setState({password: e.target.value});
    };

    sendFormToAPI = async() => {
        try {
            this.component.setState({
                apiLoading: true,
                errorText: '',
            });

            if (this.ifUsernameOrPasswordIsNullShowHintToUser()) {
                HTTP.POST(
                    'token',
                    this.provideDataForTokenAPI(),
                    (response) => {
                        this.saveTokenInLocalStorageThenNavigateToDashboard(response.data);
                    },
                    (error) => {
                        this.saveTokenInLocalStorageThenNavigateToDashboard();//this line must be removed
                        //this.showError(error.message);//this line must be added
                        console.log(error);
                    }
                );
            }
        }
        catch (e) {
            console.log(e);
        }
    };

    ifUsernameOrPasswordIsNullShowHintToUser = () => {
        const {username, password}= this.component.state;

        let username_hint = '';
        let password_hint = '';

        if (isEmpty(username)) {
            username_hint = 'Please Insert Your Username!'
        }
        if (isEmpty(password)) {
            password_hint = 'Please Insert Your Password!'
        }

        if (isEmpty(username) || isEmpty(password)) {
            this.component.setState({
                userNameHint: username_hint,
                passwordHint: password_hint,
                apiLoading: false
            });
            return false;
        }
        else {
            this.component.setState({
                userNameHint: '',
                passwordHint: '',
            });
            return true;
        }
    };

    provideDataForTokenAPI = () => {
        const {username, password}= this.component.state;

        let data = new FormData();
        data.append('username', username);
        data.append('password', password);
        data.append('grant_type', 'password');

        return data;
    };

    saveTokenInLocalStorageThenNavigateToDashboard = (result) => {
        result = this.getSampleResult();//this line must be removed
        setToken(result.access_token);
        this.navigateToDashboard();
    };

    /*
     This is Sample
     This function must be removed
     */
    getSampleResult = () => {
        const result =
            {
                "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1Mjk0NjQ3MDYsInVzZXJfbmFtZSI6ImRldmVsb3BlciIsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdLCJqdGkiOiIwZDVkY2I5ZS00NzQ0LTRlNjMtYjc0Yy0yZTdmNTU2OGJkNWUiLCJjbGllbnRfaWQiOiJ3ZWJfYXBwIiwic2NvcGUiOlsib3BlbmlkIl19.iTPZur7uCdZRM2c1hNKlhLC1A1LzOBZSlKZ1wzgeGS977-1AvHaLXVt1V2jkb1SQRDTRrmNvqRa_gsXRoZDu5DU8urAv-UimiRoMmvCkYI-6AJk8HljxH2yK2LofvIxZSRAQ3forg659x0wAMKEG1uMZHRMqCNxpV2hFZSub6lUjsVUsHmBHEWGDI6zZSFesAu_olq7SdcC6Q0Kq1KijEUeHAh6ZAEL9rr3WWMnJ8C-ACk8-PIT2KWrggaZ4_qrnf-bh9npTtAZCc-xiVDeDmXiARYpCeJXHYnwqWfP2CRS-__XJ3fILxhGYiTxsr8FQ4j9IEX59XqvEz8pi2d_fdg",
                "token_type": "bearer",
                "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJkZXZlbG9wZXIiLCJzY29wZSI6WyJvcGVuaWQiXSwiYXRpIjoiMGQ1ZGNiOWUtNDc0NC00ZTYzLWI3NGMtMmU3ZjU1NjhiZDVlIiwiZXhwIjoxNTMyMDEzNTA2LCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiXSwianRpIjoiMmU3NzRkMzAtMDBiMi00MDRhLTkzNzYtYThmZjIyZDYwY2JmIiwiY2xpZW50X2lkIjoid2ViX2FwcCJ9.JcrVAyOCFqPVcHfeLuyX08rpnHIpoTaPHZEK44hL93lyWB0GJPvYGFKKLePmmTfl9zkE_eN2ioT9PT3h4GLV2bQfQsNULJoMlrtYdR6ooZvTtaaFj6Q-6q_dYdzaX9uKWX7DTnTJuNrKlvdtgqpTf7ZdXl_cU9qBmVVZP0WvSnqS6oorulC38iwAoSWvwRByrIq6cJgn9t2BCy4Fl6qtTULznlpDhEtl7jgt7kLYjh4p4VVqWyx7cNegpMcBvRFmW_l38eHxeaeLfSSyTyAvsSBxD-8s1Ej8uUifQgszqjnhfzNe8WIdNDaFfW5i0sHkELfHVWzAKwdlI9xBlRCaag",
                "expires_in": 43199,
                "scope": "openid",
                "jti": "0d5dcb9e-4744-4e63-b74c-2e7f5568bd5e"
            };

        return result;
    };

    navigateToDashboard = () => {
        browserHistory.push("/dashboard");
    };

    showError = (error_message) => {
        this.component.setState({
            apiLoading: false,
            errorText: error_message
        });
    };

}