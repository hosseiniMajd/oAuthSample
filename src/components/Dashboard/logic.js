import {browserHistory} from "react-router";
import {HTTP} from "../../helpers/HTTP";
import {getToken, isNotExistToken} from "../../helpers/token";


export default class logic {

    component = null;

    constructor(c) {
        this.component = c;
    }

    ifExistTokenLoadUserInfoElseNavigateToLogin = async() => {
        try {
            if (isNotExistToken()) {
                this.navigateToLogin();
            } else {
                await this.loadUserInfoFromAPI();
            }
        }
        catch (e) {
            console.log(e);
        }
    };

    loadUserInfoFromAPI = async() => {
        HTTP.POST(
            'check_token',
            this.provideTokenDataForCheckTokenAPI(),
            (response) => {
                this.showUserInfo(response.data);
            },
            (error) => {
                this.showUserInfo();//this line must be removed
                //this.showError(error.message);//this line must be added
                console.log(error);
            }
        );
    };

    provideTokenDataForCheckTokenAPI = () => {
        let data = new FormData();
        data.append('token', getToken());
        return data;
    };

    showUserInfo = (result) => {
        result = this.getSampleUserInfo();//this line must be removed
        const {exp, user_name, authorities, jti, client_id, scope}= result;

        this.component.setState({
            exp: exp,
            userName: user_name,
            authorities: authorities,
            jti: jti,
            clientId: client_id,
            scope: scope,
            loading: false,
            errorText: ''
        });
    };

    /*
     This is Sample
     This function must be removed
     */
    getSampleUserInfo = () => {
        const result =
            {
                "exp": 1529464706,
                "user_name": "developer",
                "authorities": [
                    "ROLE_USER",
                    "ROLE_ADMIN"
                ],
                "jti": "0d5dcb9e-4744-4e63-b74c-2e7f5568bd5e",
                "client_id": "web_app",
                "scope": [
                    "openid"
                ]
            };

        return result;
    };

    navigateToLogin = () => {
        browserHistory.push("/login");
    };

    showError = (error_message) => {
        this.component.setState({
            loading: false,
            errorText: error_message
        });
    };

}