# microsoft_teams_chat
This Application is used to send messages to microsoft teams  through api 

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

