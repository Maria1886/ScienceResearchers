const axios = require('axios').default;

// define mendeley API URLs
const mendeleyBaseUrl = 'https://api.mendeley.com'
const MendeleyApiURL = {
    RequestAcessToken: mendeleyBaseUrl + '/oauth/token',
    ListDocumentTypes: mendeleyBaseUrl + '/document_types',
    SearchAuthorByEmail: (email) => mendeleyBaseUrl + `/profiles/v2?email=${email}`,
    SearchAuthorById: (id) => mendeleyBaseUrl + `/profiles/v2/${id}`,
    GetArticlesAuthoredById: (id) => mendeleyBaseUrl + `/catalog?author_profile_id=${id}`,
}

// create request body for asking for a token
function getRequestTokenBody() {
    const requestTokenBody = new URLSearchParams();
    requestTokenBody.append('grant_type', 'client_credentials');
    requestTokenBody.append('scope', 'all');
    requestTokenBody.append('client_id', process.env.MENDELEY_ID);
    requestTokenBody.append('client_secret', process.env.MENDELEY_SECRET);
    return requestTokenBody;
}

// define methods for accessing the mendeley API using axios
const mendeley = {
    RequestAccessToken: async () => {
        const response = await axios.post(
            MendeleyApiURL.RequestAcessToken,
            getRequestTokenBody(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )
        return response.data.access_token;
    },
    
    ListDocumentTypes: async () => {
        const token = await mendeley.RequestAccessToken();

        const response = await axios.get(
            MendeleyApiURL.ListDocumentTypes,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        return response?.data;
    },

    SearchAuthorByEmail: async (email) => {
        const token = await mendeley.RequestAccessToken();

        const response = await axios.get(
            MendeleyApiURL.SearchAuthorByEmail(email),
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        return response?.data;
    },

    SearchAuthorById: async (id) => {
        const token = await mendeley.RequestAccessToken();

        const response = await axios.get(
            MendeleyApiURL.SearchAuthorById(id),
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        return response?.data;
    },

    GetArticlesAuthoredById: async (id) => {
        const token = await mendeley.RequestAccessToken();

        const response = await axios.get(
            MendeleyApiURL.GetArticlesAuthoredById(id),
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        return response?.data;
    }
}



module.exports = mendeley;