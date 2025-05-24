
const https = require("https");

export const handler = async (event) => {
    const postData = JSON.stringify({
        username: event.request.userAttribute['preferred_username'] || event.userName,
        cognitoId: event.userName,
        profilePictureUrl: "i1.jpg",
        teamId: 1
    });

    const options = {
        hostname: "uwl21brax4.execute-api.eu-west-1.amazonaws.com"
    }
}