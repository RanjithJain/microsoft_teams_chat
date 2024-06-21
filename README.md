<b>This Application is used to send messages to microsoft teams through api</b>

<b> Pre requisite to execute the APi </b>
We need to login to Microsoft Azure portal to register application

Step 1: Register the Azure Application

Sign in to the Azure portal at https://portal.azure.com/.

Register a new application:

Navigate to Manage Microsoft Entra ID> App registrations > New registration.

Enter a name for your application.

Select Accounts in any organizational directory (Any Azure AD directory - Multitenant).

Enter a Redirect URI (e.g., http://localhost:3000/auth/callback).

Click Register.

Note down the following from the Overview page:

Application (client) ID

Directory (tenant) ID

Create a client secret:

Navigate to Certificates & secrets > New client secret.

Enter a description and expiration period.

Click Add and note down the secret value.

API Permissions:

Navigate to API permissions > Add a permission.

Select Microsoft Graph.

Select Delegated permissions and add the following permissions:

Chat.ReadWrite

ChatMessage.ReadWrite

User.Read

Click Add permissions and then Grant admin consent for the permissions.
<b> Easy steps to run the app  
Run the command : node app.js
</b>

<p> Following are the API's which needs to be called

GET API to get Access token and call self user profile http://localhost:3000/getuserprofile

GET API to get userid in the portal http://localhost:3000/teams/getuserid/

POST API to create One on One chat id http://localhost:3000/teams/create

Params for create chat id in body :
{
"userId1":"xxxxx-xxxxx-8509-a284b8da80af",
"userId2":"xxxxxx-xxxx-bca1-18bd1673c48c"
}

POST API to send one on one message http://localhost:3000/teams/sendmessage

Params to send messages in body :
{

    "chatId":"19:xxxxxxxx-xxxxx-xxx-a525e6a91e85_xxxx-xxx-xxxx-8xxx509-a2xxxx84b8da80af@unq.gbl.spaces",
    "message":"Hi 18th June  test message from xxxx's account  througb API"

}

Subscription API for auto reply http://localhost:3000/createsubcrption

Params in the body

{
"callbackUrl":"https://xxx.com/webhook",
"lifecycleNotificationUrl":"https://xxx.com/lifecycle",
"chatId":"19:xxx-51xxe7-xxx-xx-xxxxxx-7xxfef-xxx-xx-xxxxx@unq.gbl.spaces"
}

</p>
