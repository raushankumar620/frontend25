API Gateway Info



Description
Returns the basic status and configuration information of the WhatsApp Business Messaging Platform API Gateway.
This endpoint is used as the initial connectivity check to verify that the backend API server is online and responding correctly.
Endpoint
http://localhost:5000/
Method
GET
Request
Headers
No headers required.
Body
No request body required.
Response
HTTP Status
200 OK
Response Body

{
  "success": true,
  "message": "WhatsApp Messaging Platform API Gateway is Online",
  "data": {
    "name": "WhatsApp Business API & AI Automation Platform Backend",
    "version": "1.0.0",
    "environment": "development",
    "apiPrefix": "/api/v1",
    "docs": "/api/docs",
    "health": "/health"
  }
}
Response Fields

Field
Description
success
Indicates whether the API request was successful.
message
Current API Gateway status message.
data.name
Backend platform name.
data.version
Current backend API version.
data.environment
Current runtime environment.
data.apiPrefix
Base prefix used for versioned API endpoints.
data.docs
Path to the API documentation.
data.health
Path to the health-check endpoint.

Test Result
Status: ✅ Passed
The API Gateway is online and responding successfully.
—----------------------------------------------------------------------------------------------------------------------------
===============Health Check==============
Description
Returns the current health status of the backend platform and provides connectivity information for the configured database, Redis service, and Node.js runtime.
This endpoint is used to verify application availability and monitor critical backend dependencies.
Endpoint
http://localhost:5000/health
Method
GET
Request
Headers
No headers required.
Body
No request body required.
Response
HTTP Status
200 OK
Response Body

{
  "status": "UP",
  "timestamp": "2026-09-14T06:01:17.905Z",
  "uptimeSeconds": 495,
  "environment": "development",
  "services": {
    "database": {
      "status": "connected",
      "readyState": 1,
      "host": "ac-vne9ui7-shard-00-02.dp9as1l.mongodb.net",
      "name": "whatsappmsg"
    },
    "redis": {
      "status": "disconnected",
      "host": "localhost",
      "port": 6379
    }
  },
  "system": {
    "nodeVersion": "v22.14.0",
    "memoryUsageMB": 31
  }
}
Response Fields

Field
Description
status
Overall application health status.
timestamp
Timestamp at which the health check was generated.
uptimeSeconds
Backend process uptime in seconds.
environment
Current application environment.
services.database.status
MongoDB connection status.
services.database.readyState
Current MongoDB connection state.
services.database.host
MongoDB server host.
services.database.name
Database name.
services.redis.status
Redis connection status.
services.redis.host
Redis server host.
services.redis.port
Redis server port.
system.nodeVersion
Node.js runtime version.
system.memoryUsageMB
Current application memory usage in MB.

Test Result
HTTP Response: 200 OK
Application Status: UP
MongoDB: ✅ Connected
Redis: ❌ Disconnected
Node.js: v22.14.0
Observation
The API server and MongoDB are working correctly. However, Redis is currently disconnected at localhost:6379.
Redis is an important infrastructure component for the planned platform because it will handle queues, rate limiting, distributed locks, temporary state, caching, idempotency, and real-time coordination.
User Registration & Tenant Auto-Creation
Description
Registers a new business owner and automatically creates an organization (tenant) for the business.
On successful registration, the API creates the user with the ORG_ADMIN role, creates the associated organization, and returns access and refresh JWT tokens for authenticated API access.
Endpoint
http://localhost:5000/api/v1/auth/register
Method
POST
Request
Headers
Content-Type: application/json
Body

{
  "email": "owner@mybusiness.com",
  "password": "Password123!",
  "firstName": "Rahul",
  "lastName": "Sharma",
  "phone": "+919876543210",
  "organizationName": "Rahul Technologies"
}
Request Fields

Field
Description
email
Email address of the user/business owner.
password
Password for the user account.
firstName
User's first name.
lastName
User's last name.
phone
User's phone number.
organizationName
Name of the organization/tenant to be created.

Response
HTTP Status
201 Created
Response Body

{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "<USER_ID>",
      "email": "owner@mybusiness.com",
      "firstName": "Rahul",
      "lastName": "Sharma",
      "role": "ORG_ADMIN",
      "organizationId": "<ORGANIZATION_ID>"
    },
    "organization": {
      "id": "<ORGANIZATION_ID>",
      "name": "Rahul Technologies",
      "slug": "rahul-technologies-55nj",
      "plan": "FREE_TRIAL"
    },
    "accessToken": "<ACCESS_TOKEN>",
    "refreshToken": "<REFRESH_TOKEN>"
  }
}
Response Fields
User

Field
Description
user.id
Unique identifier of the newly created user.
user.email
Registered user email.
user.firstName
User's first name.
user.lastName
User's last name.
user.role
Organization role assigned to the registered user.
user.organizationId
ID of the organization associated with the user.

Organization

Field
Description
organization.id
Unique identifier of the newly created organization.
organization.name
Organization name provided during registration.
organization.slug
Unique organization slug generated by the backend.
organization.plan
Initial subscription plan assigned to the organization.

Authentication

Field
Description
accessToken
JWT access token used for authenticated API requests.
refreshToken
JWT refresh token used to obtain/renew an access token.

Test Result
HTTP Status: 201 Created
Registration: ✅ Successful
User Created: ✅
Organization Created: ✅
Role: ORG_ADMIN
Initial Plan: FREE_TRIAL
Access Token: ✅ Generated
Refresh Token: ✅ Generated



—----------------------------------------------------------------------------------------------------------------------------


===============Login API====================
Description
Authenticates an existing user using their email address and password.
On successful authentication, the API returns the authenticated user's profile, associated organization details, an access JWT token, and a refresh JWT token.
Endpoint
http://localhost:5000/api/v1/auth/login
Method
POST
Request
Headers
Content-Type: application/json

Body
{
  "email": "owner@mybusiness.com",
  "password": "Password123!"
}

Request Fields
Field
Description
email
Registered user's email address.
password
User's account password.

Response
HTTP Status
200 OK
Response Body
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "<USER_ID>",
      "email": "owner@mybusiness.com",
      "firstName": "Rahul",
      "lastName": "Sharma",
      "phone": "+919876543210",
      "role": "ORG_ADMIN",
      "avatarUrl": "",
      "organizationId": "<ORGANIZATION_ID>"
    },
    "organization": {
      "id": "<ORGANIZATION_ID>",
      "name": "Rahul Technologies",
      "slug": "rahul-technologies-55nj",
      "plan": "FREE_TRIAL"
    },
    "accessToken": "<ACCESS_TOKEN>",
    "refreshToken": "<REFRESH_TOKEN>"
  }
}

Response Fields
User
Field
Description
user.id
Unique identifier of the authenticated user.
user.email
User's registered email address.
user.firstName
User's first name.
user.lastName
User's last name.
user.phone
User's registered phone number.
user.role
User's organization role.
user.avatarUrl
URL/path of the user's avatar. Empty when no avatar is configured.
user.organizationId
Organization/tenant associated with the user.

Organization
Field
Description
organization.id
Unique organization identifier.
organization.name
Organization name.
organization.slug
Unique organization slug.
organization.plan
Current organization plan.

Authentication
Field
Description
accessToken
JWT token used to authenticate protected API requests.
refreshToken
JWT token used to refresh the user's access session.

Test Result
HTTP Status: 200 OK
Login: ✅ Successful
User Authentication: ✅
Organization: ✅ Returned
Access Token: ✅ Generated
Refresh Token: ✅ Generated





—----------------------------------------------------------------------------------------------------------------------------

Refresh Access Token
Description
Generates a new access token using a valid refresh token.
The API also returns a new refresh token, allowing the client application to continue authenticated sessions without requiring the user to log in again.
Endpoint
http://localhost:5000/api/v1/auth/refresh
Method
POST
Request
Headers
Content-Type: application/json

Body
{
  "refreshToken": "<REFRESH_TOKEN>"
}

Request Fields
Field
Description
refreshToken
Valid JWT refresh token previously issued by the authentication system.

Response
HTTP Status
200 OK
Response Body
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "<NEW_ACCESS_TOKEN>",
    "refreshToken": "<NEW_REFRESH_TOKEN>"
  }
}

Response Fields
Field
Description
success
Indicates whether the token refresh operation was successful.
message
Result message returned by the API.
data.accessToken
Newly generated JWT access token for authenticated API requests.
data.refreshToken
Newly generated refresh token for subsequent session renewal.

Token Rotation
The API response indicates that a new access token and a new refresh token are issued when the refresh operation succeeds.
The client should replace its previously stored tokens with the newly returned tokens.
Test Result
HTTP Status: 200 OK
Token Refresh: ✅ Successful
New Access Token: ✅ Generated
New Refresh Token: ✅ Generated



—----------------------------------------------------------------------------------------------------------------------------


==========Forgot Password==========
Description
Initiates the password reset process for an existing user account.
The API generates a password reset token and returns password reset instructions along with the generated token.
Endpoint
http://localhost:5000/api/v1/auth/forgot-password
Method
POST
Request
Headers
Content-Type: application/json

Body
{
  "email": "owner@mybusiness.com"
}

Request Fields
Field
Description
email
Email address of the account for which the password reset process should be initiated.

Response
HTTP Status
200 OK
Response Body
{
  "success": true,
  "message": "Password reset instructions sent",
  "data": {
    "message": "Password reset token generated successfully.",
    "resetToken": "<RESET_TOKEN>"
  }
}

Response Fields
Field
Description
success
Indicates whether the password reset request was successful.
message
Overall response message.
data.message
Confirmation that a password reset token was generated.
data.resetToken
Generated token used for the password reset operation.

Test Result
HTTP Status: 200 OK
Forgot Password: ✅ Successful
Reset Token: ✅ Generated

——--------Reset Password—-----------
Description
Resets the password of an existing user account using a valid password reset token.
After successful password reset, the user can log in using the newly configured password.
Endpoint
http://localhost:5000/api/v1/auth/reset-password
Method
POST
Request
Headers
Content-Type: application/json

Body
{
  "token": "9e8a3a036ac24337dc5a5d80d801ec91e40610da4d6de2bcf303af89c628929a",
  "password": "NewSecretPassword123!"
}

Response
HTTP Status
200 OK
Actual Response
{
  "success": true,
  "message": "Password reset successful",
  "data": {
    "message": "Password has been successfully reset. You can now login."
  }
}



Response Fields
Field
Description
success
Indicates whether the password reset operation was successful.
message
Overall password reset result message.
data.message
Confirmation that the password was successfully reset and the user can log in again.

Test Result
HTTP Status: 200 OK
Password Reset: ✅ Successful
New Password: ✅ Set Successfully
Login Available: ✅ Yes



User Login After Password Reset
Description
Authenticates the user using the newly reset password.
This test verifies that the password reset operation was successfully applied and that the user can log in with the new password.
Endpoint
http://localhost:5000/api/v1/auth/login
Method
POST
Request
Headers
Content-Type: application/json

Body
{
  "email": "owner@mybusiness.com",
  "password": "NewSecretPassword123!"
}

Response
HTTP Status
200 OK
Actual Response
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "6aa78e121de33866504da3ae",
      "email": "owner@mybusiness.com",
      "firstName": "Rahul",
      "lastName": "Sharma",
      "phone": "+919876543210",
      "role": "ORG_ADMIN",
      "avatarUrl": "",
      "organizationId": "6aa78e121de33866504da3ac"
    },
    "organization": {
      "id": "6aa78e121de33866504da3ac",
      "name": "Rahul Technologies",
      "slug": "rahul-technologies-55nj",
      "plan": "FREE_TRIAL"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWE3OGUxMjFkZTMzODY2NTA0ZGEzYWUiLCJlbWFpbCI6Im93bmVyQG15YnVzaW5lc3MuY29tIiwicm9sZSI6Ik9SR19BRE1JTiIsIm9yZ2FuaXphdGlvbklkIjoiNmFhNzhlMTIxZGUzMzg2NjUwNGRhM2FjIiwiaWF0IjoxNzg5MzY2Njc3LCJleHAiOjE3ODk5NzE0Nzd9.6IGnvuyayRI6WT6MCh7eCgit59SSeYXCH261gCWlblk",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWE3OGUxMjFkZTMzODY2NTA0ZGEzYWUiLCJlbWFpbCI6Im93bmVyQG15YnVzaW5lc3MuY29tIiwicm9sZSI6Ik9SR19BRE1JTiIsIm9yZ2FuaXphdGlvbklkIjoiNmFhNzhlMTIxZGUzMzg2NjUwNGRhM2FjIiwiaWF0IjoxNzg5MzY2Njc3LCJleHAiOjE3OTE5NTg2Nzd9.tbriT5LG5su2E9sSgKBkw5QPEgk10yLNGN4CqN9PbCg"
  }
}

Response Fields
Field
Description
success
Indicates successful authentication.
message
Login result message.
data.user.id
Unique user ID.
data.user.email
User email address.
data.user.firstName
User first name.
data.user.lastName
User last name.
data.user.phone
User phone number.
data.user.role
User organization role.
data.user.avatarUrl
User avatar URL.
data.user.organizationId
Associated organization ID.
data.organization.id
Organization ID.
data.organization.name
Organization name.
data.organization.slug
Organization slug.
data.organization.plan
Current organization plan.
data.accessToken
JWT access token generated after successful login.
data.refreshToken
JWT refresh token generated after successful login.

Test Result
HTTP Status: 200 OK
Login with New Password: ✅ Successful
Password Reset Verification: ✅ Passed
User: Rahul Sharma
Role: ORG_ADMIN
Organization: Rahul Technologies
Access Token: ✅ Generated
Refresh Token: ✅ Generated


—-----------------User Logout—---------------
Description
Logs out the currently authenticated user and terminates the active authentication session.
The request requires a valid access token.
Endpoint
http://localhost:5000/api/v1/auth/logout
Method
POST
Request
Headers
Authorization: Bearer <ACCESS_TOKEN>

Body
No request body required.
Response
HTTP Status
200 OK
Actual Response
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}

Response Fields
Field
Description
success
Indicates that the logout operation was successful.
message
Confirmation message for the logout operation.
data
Returns null because no additional data is returned after logout.

Test Result
HTTP Status: 200 OK
Logout: ✅ Successful
Authentication Session: ✅ Logout completed




========Get Current User Profile=====
Description
Fetches the profile information of the currently authenticated user.
The response includes the user's personal/account information along with the associated organization details, account status, verification status, timestamps, and last login information.
Endpoint
http://localhost:5000/api/v1/users/me
Method
GET
Request
Headers
Authorization: Bearer <ACCESS_TOKEN>

Body
No request body required.
Response
HTTP Status
200 OK
Actual Response
{
  "success": true,
  "message": "User profile fetched successfully",
  "data": {
    "_id": "6aa78e121de33866504da3ae",
    "email": "owner@mybusiness.com",
    "firstName": "Rahul",
    "lastName": "Sharma",
    "phone": "+919876543210",
    "role": "ORG_ADMIN",
    "organizationId": {
      "branding": {
        "logoUrl": "",
        "primaryColor": "#25D366",
        "website": ""
      },
      "_id": "6aa78e121de33866504da3ac",
      "name": "Rahul Technologies",
      "slug": "rahul-technologies-55nj",
      "plan": "FREE_TRIAL",
      "status": "ACTIVE",
      "id": "6aa78e121de33866504da3ac"
    },
    "avatarUrl": "",
    "isActive": true,
    "isEmailVerified": false,
    "createdAt": "2026-09-14T06:02:58.386Z",
    "updatedAt": "2026-09-14T06:17:57.828Z",
    "lastLoginAt": "2026-09-14T06:17:57.828Z",
    "id": "6aa78e121de33866504da3ae"
  }
}

Response Fields
Field
Description
_id
Unique MongoDB identifier of the user.
email
Registered email address of the user.
firstName
User's first name.
lastName
User's last name.
phone
Registered phone number.
role
User's organization role.
organizationId
Populated organization associated with the user.
avatarUrl
User avatar URL.
isActive
Indicates whether the user account is active.
isEmailVerified
Indicates whether the user's email has been verified.
createdAt
User account creation timestamp.
updatedAt
Last user record update timestamp.
lastLoginAt
Timestamp of the user's most recent login.
id
User identifier returned by the API.

Organization Fields
Field
Description
organizationId._id
Unique organization identifier.
organizationId.name
Organization name.
organizationId.slug
Organization slug.
organizationId.plan
Current organization subscription plan.
organizationId.status
Current organization status.
organizationId.branding.logoUrl
Organization logo URL.
organizationId.branding.primaryColor
Organization primary branding color.
organizationId.branding.website
Organization website URL.
organizationId.id
Organization identifier returned in the populated object.

Test Result
HTTP Status: 200 OK
Profile Fetch: ✅ Successful
User Data: ✅ Returned
Organization Data: ✅ Populated
Account Status: ACTIVE
User Status: Active
Email Verified: false


=======Update Current User Profile====
Description
Updates the profile information of the currently authenticated user.
The API allows the authenticated user to update supported profile fields such as first name, last name, phone number, and avatar URL.
Endpoint
http://localhost:5000/api/v1/users/me
Method
PATCH
Request
Headers
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json

Body
{
  "firstName": "Rahul",
  "lastName": "Sharma (Lead)",
  "phone": "+919988776655",
  "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
}

Response
HTTP Status
200 OK
Actual Response
{
  "success": true,
  "message": "User profile updated successfully",
  "data": {
    "_id": "6aa78e121de33866504da3ae",
    "email": "owner@mybusiness.com",
    "firstName": "Rahul",
    "lastName": "Sharma (Lead)",
    "phone": "+919988776655",
    "role": "ORG_ADMIN",
    "organizationId": {
      "branding": {
        "logoUrl": "",
        "primaryColor": "#25D366",
        "website": ""
      },
      "_id": "6aa78e121de33866504da3ac",
      "name": "Rahul Technologies",
      "slug": "rahul-technologies-55nj",
      "plan": "FREE_TRIAL",
      "status": "ACTIVE",
      "id": "6aa78e121de33866504da3ac"
    },
    "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    "isActive": true,
    "isEmailVerified": false,
    "createdAt": "2026-09-14T06:02:58.386Z",
    "updatedAt": "2026-09-14T06:22:08.382Z",
    "lastLoginAt": "2026-09-14T06:17:57.828Z",
    "id": "6aa78e121de33866504da3ae"
  }
}

Response Fields
Field
Description
_id
Unique MongoDB identifier of the user.
email
User's registered email address.
firstName
Updated first name.
lastName
Updated last name.
phone
Updated phone number.
role
User's organization role.
organizationId
Populated organization associated with the user.
avatarUrl
Updated avatar URL.
isActive
Indicates whether the user account is active.
isEmailVerified
Indicates whether the user's email is verified.
createdAt
User account creation timestamp.
updatedAt
Timestamp of the latest profile update.
lastLoginAt
Timestamp of the user's most recent login.
id
User identifier returned by the API.

Organization Fields
Field
Description
organizationId._id
Unique organization identifier.
organizationId.name
Organization name.
organizationId.slug
Organization slug.
organizationId.plan
Current organization plan.
organizationId.status
Current organization status.
organizationId.branding.logoUrl
Organization logo URL.
organizationId.branding.primaryColor
Organization primary branding color.
organizationId.branding.website
Organization website URL.
organizationId.id
Organization identifier.

Test Result
HTTP Status: 200 OK
Profile Update: ✅ Successful
First Name: ✅ Updated
Last Name: ✅ Updated
Phone: ✅ Updated
Avatar URL: ✅ Updated
Organization Data: ✅ Returned



12. Get Current Organization
Description
Retrieves the organization details associated with the currently authenticated user.
Endpoint
GET http://localhost:5000/api/v1/organizations/me

Method
GET

Request
Headers
Authorization: Bearer <VALID_ACCESS_TOKEN>

Body
None

Response
Status Code: 200 OK
{
  "success": true,
  "message": "Organization details retrieved",
  "data": {
    "branding": {
      "logoUrl": "",
      "primaryColor": "#25D366",
      "website": ""
    },
    "settings": {
      "timezone": "UTC",
      "defaultLanguage": "en",
      "autoAssignment": false
    },
    "limits": {
      "maxNumbers": 2,
      "maxTeamMembers": 5,
      "monthlyMessages": 1000
    },
    "_id": "6aa78e121de33866504da3ac",
    "name": "Rahul Technologies",
    "slug": "rahul-technologies-55nj",
    "plan": "FREE_TRIAL",
    "status": "ACTIVE",
    "createdAt": "2026-09-14T06:02:58.338Z",
    "updatedAt": "2026-09-14T06:02:58.501Z",
    "ownerId": {
      "_id": "6aa78e121de33866504da3ae",
      "email": "owner@mybusiness.com",
      "firstName": "Rahul",
      "lastName": "Sharma (Lead)",
      "id": "6aa78e121de33866504da3ae"
    },
    "id": "6aa78e121de33866504da3ac"
  }
}

Response Fields
Field
Description
success
Indicates whether the request was successful
message
Organization retrieval status message
data._id
Organization database ID
data.name
Organization name
data.slug
Unique organization slug
data.plan
Current subscription plan
data.status
Organization status
data.branding
Organization branding configuration
data.branding.logoUrl
Organization logo URL
data.branding.primaryColor
Primary brand color
data.branding.website
Organization website
data.settings.timezone
Organization timezone
data.settings.defaultLanguage
Default language
data.settings.autoAssignment
Whether automatic assignment is enabled
data.limits.maxNumbers
Maximum WhatsApp numbers allowed
data.limits.maxTeamMembers
Maximum team members allowed
data.limits.monthlyMessages
Monthly message limit
data.ownerId
Organization owner information
data.createdAt
Organization creation timestamp
data.updatedAt
Last organization update timestamp

Test Result
PASSED — HTTP 200
The authenticated user's organization was successfully retrieved. The response confirms:
Organization: Rahul Technologies
Plan: FREE_TRIAL
Status: ACTIVE
Maximum WhatsApp numbers: 2
Maximum team members: 5
Monthly messages: 1000
Current auto-assignment: false
Owner information is correctly populated.


—------------------------------------------------------------------------------------------------------------------------

13. Update Current Organization
Description
Updates the organization details associated with the currently authenticated user, including organization name, branding configuration, and organization settings.
Endpoint
PATCH http://localhost:5000/api/v1/organizations/me

Method
PATCH

Request
Headers
Authorization: Bearer <VALID_ACCESS_TOKEN>
Content-Type: application/json

Body
{
  "name": "Rahul Technologies Private Limited",
  "branding": {
    "primaryColor": "#128C7E",
    "website": "https://rahultech.com",
    "logoUrl": "https://rahultech.com/logo.png"
  },
  "settings": {
    "timezone": "Asia/Kolkata",
    "defaultLanguage": "en",
    "autoAssignment": true
  }
}

Response
Status Code: 200 OK
{
  "success": true,
  "message": "Organization updated",
  "data": {
    "branding": {
      "primaryColor": "#128C7E",
      "website": "https://rahultech.com",
      "logoUrl": "https://rahultech.com/logo.png"
    },
    "settings": {
      "timezone": "Asia/Kolkata",
      "defaultLanguage": "en",
      "autoAssignment": true
    },
    "limits": {
      "maxNumbers": 2,
      "maxTeamMembers": 5,
      "monthlyMessages": 1000
    },
    "_id": "6aa78e121de33866504da3ac",
    "name": "Rahul Technologies Private Limited",
    "slug": "rahul-technologies-55nj",
    "plan": "FREE_TRIAL",
    "status": "ACTIVE",
    "createdAt": "2026-09-14T06:02:58.338Z",
    "updatedAt": "2026-09-14T06:36:36.648Z",
    "ownerId": {
      "_id": "6aa78e121de33866504da3ae",
      "email": "owner@mybusiness.com",
      "firstName": "Rahul",
      "lastName": "Sharma (Lead)",
      "id": "6aa78e121de33866504da3ae"
    },
    "id": "6aa78e121de33866504da3ac"
  }
}

Response Fields
Field
Description
success
Indicates whether the update was successful
message
Organization update status message
data._id
Organization database ID
data.name
Updated organization name
data.slug
Unique organization slug
data.plan
Current subscription plan
data.status
Organization status
data.branding.primaryColor
Updated primary brand color
data.branding.website
Updated organization website
data.branding.logoUrl
Updated organization logo URL
data.settings.timezone
Updated organization timezone
data.settings.defaultLanguage
Default language
data.settings.autoAssignment
Updated automatic assignment setting
data.limits.maxNumbers
Maximum WhatsApp numbers allowed
data.limits.maxTeamMembers
Maximum team members allowed
data.limits.monthlyMessages
Monthly message limit
data.ownerId
Organization owner information
data.createdAt
Organization creation timestamp
data.updatedAt
Last organization update timestamp

Test Result
PASSED — HTTP 200
The organization was successfully updated.
Verified changes:
Name → Rahul Technologies Private Limited
Primary color → #128C7E
Website → https://rahultech.com
Logo URL → https://rahultech.com/logo.png
Timezone → Asia/Kolkata
Default language → en
Auto assignment → true
Organization status remains → ACTIVE
Plan remains → FREE_TRIAL
Organization limits remain unchanged.






14. Get Team Members
Description
Retrieves all team members and pending team invitations associated with the currently authenticated user's organization.
Endpoint
GET http://localhost:5000/api/v1/team

Method
GET

Request
Headers
Authorization: Bearer <VALID_ACCESS_TOKEN>

Body
None

Response
Status Code: 200 OK
{
  "success": true,
  "message": "Team members retrieved",
  "data": {
    "members": [
      {
        "_id": "6aa78e121de33866504da3ae",
        "email": "owner@mybusiness.com",
        "firstName": "Rahul",
        "lastName": "Sharma (Lead)",
        "phone": "+919988776655",
        "role": "ORG_ADMIN",
        "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
        "isActive": true,
        "createdAt": "2026-09-14T06:02:58.386Z",
        "lastLoginAt": "2026-09-14T06:17:57.828Z",
        "id": "6aa78e121de33866504da3ae"
      }
    ],
    "invitations": [],
    "totalCount": 1
  }
}

Response Fields
Field
Description
success
Indicates whether the request was successful
message
Team retrieval status message
data.members
List of team members belonging to the organization
data.members[].id
Team member user ID
data.members[].email
Team member email address
data.members[].firstName
Team member first name
data.members[].lastName
Team member last name
data.members[].phone
Team member phone number
data.members[].role
Team member organization role
data.members[].avatarUrl
Team member avatar URL
data.members[].isActive
Indicates whether the member is active
data.members[].createdAt
Team member creation timestamp
data.members[].lastLoginAt
Team member's last login timestamp
data.invitations
List of pending team invitations
data.totalCount
Total number of current team members

Test Result
PASSED — HTTP 200
Verified:
Team members retrieved successfully.
Current organization has 1 team member.
Current user is ORG_ADMIN.
invitations is currently empty.
totalCount is 1.
Member profile data is correctly returned.







15. Invite Team Member
Description
Sends an invitation to a new team member to join the currently authenticated user's organization with the specified role.
Endpoint
POST http://localhost:5000/api/v1/team/invite

Method
POST

Request
Headers
Authorization: Bearer <VALID_ACCESS_TOKEN>
Content-Type: application/json

Body
{
  "email": "member@mybusiness.com",
  "role": "AGENT"
}

Response
Status Code: 200 OK
{
  "success": true,
  "message": "Invitation sent successfully",
  "data": {
    "organizationId": "6aa78e121de33866504da3ac",
    "email": "member@mybusiness.com",
    "name": "",
    "role": "AGENT",
    "invitedBy": "6aa78e121de33866504da3ae",
    "status": "PENDING",
    "inviteToken": "2e9f87f2456bac99d2ea558b5053637a2b494881157c7290",
    "expiresAt": "2026-09-21T06:40:57.526Z",
    "_id": "6aa796f91de33866504da3ca",
    "createdAt": "2026-09-14T06:40:57.527Z",
    "updatedAt": "2026-09-14T06:40:57.527Z",
    "id": "6aa796f91de33866504da3ca"
  }
}

Response Fields
Field
Description
success
Indicates whether the invitation was successfully created
message
Invitation status message
data.organizationId
Organization receiving the invited member
data.email
Email address of the invited member
data.name
Name of the invited member
data.role
Role assigned to the invited member
data.invitedBy
User ID of the person who sent the invitation
data.status
Current invitation status
data.inviteToken
Unique invitation token
data.expiresAt
Invitation expiration timestamp
data._id
Invitation database ID
data.createdAt
Invitation creation timestamp
data.updatedAt
Last invitation update timestamp
data.id
Invitation ID

Test Result
PASSED — HTTP 200
Verified:
Invitation was created successfully.
Invitee: member@mybusiness.com
Assigned role: AGENT
Invitation status: PENDING
Invitation token was generated successfully.
Expiry was set to 2026-09-21T06:40:57.526Z.
Invitation is associated with the correct organization.
invitedBy correctly identifies the current organization admin.

API Gateway Info



Description
Returns the basic status and configuration information of the WhatsApp Business Messaging Platform API Gateway.
This endpoint is used as the initial connectivity check to verify that the backend API server is online and responding correctly.
Endpoint
http://localhost:5000/
Method
GET
Request
Headers
No headers required.
Body
No request body required.
Response
HTTP Status
200 OK
Response Body

{
  "success": true,
  "message": "WhatsApp Messaging Platform API Gateway is Online",
  "data": {
    "name": "WhatsApp Business API & AI Automation Platform Backend",
    "version": "1.0.0",
    "environment": "development",
    "apiPrefix": "/api/v1",
    "docs": "/api/docs",
    "health": "/health"
  }
}
Response Fields

Field
Description
success
Indicates whether the API request was successful.
message
Current API Gateway status message.
data.name
Backend platform name.
data.version
Current backend API version.
data.environment
Current runtime environment.
data.apiPrefix
Base prefix used for versioned API endpoints.
data.docs
Path to the API documentation.
data.health
Path to the health-check endpoint.

Test Result
Status: ✅ Passed
The API Gateway is online and responding successfully.
—----------------------------------------------------------------------------------------------------------------------------
===============Health Check==============
Description
Returns the current health status of the backend platform and provides connectivity information for the configured database, Redis service, and Node.js runtime.
This endpoint is used to verify application availability and monitor critical backend dependencies.
Endpoint
http://localhost:5000/health
Method
GET
Request
Headers
No headers required.
Body
No request body required.
Response
HTTP Status
200 OK
Response Body

{
  "status": "UP",
  "timestamp": "2026-09-14T06:01:17.905Z",
  "uptimeSeconds": 495,
  "environment": "development",
  "services": {
    "database": {
      "status": "connected",
      "readyState": 1,
      "host": "ac-vne9ui7-shard-00-02.dp9as1l.mongodb.net",
      "name": "whatsappmsg"
    },
    "redis": {
      "status": "disconnected",
      "host": "localhost",
      "port": 6379
    }
  },
  "system": {
    "nodeVersion": "v22.14.0",
    "memoryUsageMB": 31
  }
}
Response Fields

Field
Description
status
Overall application health status.
timestamp
Timestamp at which the health check was generated.
uptimeSeconds
Backend process uptime in seconds.
environment
Current application environment.
services.database.status
MongoDB connection status.
services.database.readyState
Current MongoDB connection state.
services.database.host
MongoDB server host.
services.database.name
Database name.
services.redis.status
Redis connection status.
services.redis.host
Redis server host.
services.redis.port
Redis server port.
system.nodeVersion
Node.js runtime version.
system.memoryUsageMB
Current application memory usage in MB.

Test Result
HTTP Response: 200 OK
Application Status: UP
MongoDB: ✅ Connected
Redis: ❌ Disconnected
Node.js: v22.14.0
Observation
The API server and MongoDB are working correctly. However, Redis is currently disconnected at localhost:6379.
Redis is an important infrastructure component for the planned platform because it will handle queues, rate limiting, distributed locks, temporary state, caching, idempotency, and real-time coordination.
User Registration & Tenant Auto-Creation
Description
Registers a new business owner and automatically creates an organization (tenant) for the business.
On successful registration, the API creates the user with the ORG_ADMIN role, creates the associated organization, and returns access and refresh JWT tokens for authenticated API access.
Endpoint
http://localhost:5000/api/v1/auth/register
Method
POST
Request
Headers
Content-Type: application/json
Body

{
  "email": "owner@mybusiness.com",
  "password": "Password123!",
  "firstName": "Rahul",
  "lastName": "Sharma",
  "phone": "+919876543210",
  "organizationName": "Rahul Technologies"
}
Request Fields

Field
Description
email
Email address of the user/business owner.
password
Password for the user account.
firstName
User's first name.
lastName
User's last name.
phone
User's phone number.
organizationName
Name of the organization/tenant to be created.

Response
HTTP Status
201 Created
Response Body

{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "<USER_ID>",
      "email": "owner@mybusiness.com",
      "firstName": "Rahul",
      "lastName": "Sharma",
      "role": "ORG_ADMIN",
      "organizationId": "<ORGANIZATION_ID>"
    },
    "organization": {
      "id": "<ORGANIZATION_ID>",
      "name": "Rahul Technologies",
      "slug": "rahul-technologies-55nj",
      "plan": "FREE_TRIAL"
    },
    "accessToken": "<ACCESS_TOKEN>",
    "refreshToken": "<REFRESH_TOKEN>"
  }
}
Response Fields
User

Field
Description
user.id
Unique identifier of the newly created user.
user.email
Registered user email.
user.firstName
User's first name.
user.lastName
User's last name.
user.role
Organization role assigned to the registered user.
user.organizationId
ID of the organization associated with the user.

Organization

Field
Description
organization.id
Unique identifier of the newly created organization.
organization.name
Organization name provided during registration.
organization.slug
Unique organization slug generated by the backend.
organization.plan
Initial subscription plan assigned to the organization.

Authentication

Field
Description
accessToken
JWT access token used for authenticated API requests.
refreshToken
JWT refresh token used to obtain/renew an access token.

Test Result
HTTP Status: 201 Created
Registration: ✅ Successful
User Created: ✅
Organization Created: ✅
Role: ORG_ADMIN
Initial Plan: FREE_TRIAL
Access Token: ✅ Generated
Refresh Token: ✅ Generated



—----------------------------------------------------------------------------------------------------------------------------


===============Login API====================
Description
Authenticates an existing user using their email address and password.
On successful authentication, the API returns the authenticated user's profile, associated organization details, an access JWT token, and a refresh JWT token.
Endpoint
http://localhost:5000/api/v1/auth/login
Method
POST
Request
Headers
Content-Type: application/json

Body
{
  "email": "owner@mybusiness.com",
  "password": "Password123!"
}

Request Fields
Field
Description
email
Registered user's email address.
password
User's account password.

Response
HTTP Status
200 OK
Response Body
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "<USER_ID>",
      "email": "owner@mybusiness.com",
      "firstName": "Rahul",
      "lastName": "Sharma",
      "phone": "+919876543210",
      "role": "ORG_ADMIN",
      "avatarUrl": "",
      "organizationId": "<ORGANIZATION_ID>"
    },
    "organization": {
      "id": "<ORGANIZATION_ID>",
      "name": "Rahul Technologies",
      "slug": "rahul-technologies-55nj",
      "plan": "FREE_TRIAL"
    },
    "accessToken": "<ACCESS_TOKEN>",
    "refreshToken": "<REFRESH_TOKEN>"
  }
}

Response Fields
User
Field
Description
user.id
Unique identifier of the authenticated user.
user.email
User's registered email address.
user.firstName
User's first name.
user.lastName
User's last name.
user.phone
User's registered phone number.
user.role
User's organization role.
user.avatarUrl
URL/path of the user's avatar. Empty when no avatar is configured.
user.organizationId
Organization/tenant associated with the user.

Organization
Field
Description
organization.id
Unique organization identifier.
organization.name
Organization name.
organization.slug
Unique organization slug.
organization.plan
Current organization plan.

Authentication
Field
Description
accessToken
JWT token used to authenticate protected API requests.
refreshToken
JWT token used to refresh the user's access session.

Test Result
HTTP Status: 200 OK
Login: ✅ Successful
User Authentication: ✅
Organization: ✅ Returned
Access Token: ✅ Generated
Refresh Token: ✅ Generated





—----------------------------------------------------------------------------------------------------------------------------

Refresh Access Token
Description
Generates a new access token using a valid refresh token.
The API also returns a new refresh token, allowing the client application to continue authenticated sessions without requiring the user to log in again.
Endpoint
http://localhost:5000/api/v1/auth/refresh
Method
POST
Request
Headers
Content-Type: application/json

Body
{
  "refreshToken": "<REFRESH_TOKEN>"
}

Request Fields
Field
Description
refreshToken
Valid JWT refresh token previously issued by the authentication system.

Response
HTTP Status
200 OK
Response Body
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "<NEW_ACCESS_TOKEN>",
    "refreshToken": "<NEW_REFRESH_TOKEN>"
  }
}

Response Fields
Field
Description
success
Indicates whether the token refresh operation was successful.
message
Result message returned by the API.
data.accessToken
Newly generated JWT access token for authenticated API requests.
data.refreshToken
Newly generated refresh token for subsequent session renewal.

Token Rotation
The API response indicates that a new access token and a new refresh token are issued when the refresh operation succeeds.
The client should replace its previously stored tokens with the newly returned tokens.
Test Result
HTTP Status: 200 OK
Token Refresh: ✅ Successful
New Access Token: ✅ Generated
New Refresh Token: ✅ Generated



—----------------------------------------------------------------------------------------------------------------------------


==========Forgot Password==========
Description
Initiates the password reset process for an existing user account.
The API generates a password reset token and returns password reset instructions along with the generated token.
Endpoint
http://localhost:5000/api/v1/auth/forgot-password
Method
POST
Request
Headers
Content-Type: application/json

Body
{
  "email": "owner@mybusiness.com"
}

Request Fields
Field
Description
email
Email address of the account for which the password reset process should be initiated.

Response
HTTP Status
200 OK
Response Body
{
  "success": true,
  "message": "Password reset instructions sent",
  "data": {
    "message": "Password reset token generated successfully.",
    "resetToken": "<RESET_TOKEN>"
  }
}

Response Fields
Field
Description
success
Indicates whether the password reset request was successful.
message
Overall response message.
data.message
Confirmation that a password reset token was generated.
data.resetToken
Generated token used for the password reset operation.

Test Result
HTTP Status: 200 OK
Forgot Password: ✅ Successful
Reset Token: ✅ Generated

——--------Reset Password—-----------
Description
Resets the password of an existing user account using a valid password reset token.
After successful password reset, the user can log in using the newly configured password.
Endpoint
http://localhost:5000/api/v1/auth/reset-password
Method
POST
Request
Headers
Content-Type: application/json

Body
{
  "token": "9e8a3a036ac24337dc5a5d80d801ec91e40610da4d6de2bcf303af89c628929a",
  "password": "NewSecretPassword123!"
}

Response
HTTP Status
200 OK
Actual Response
{
  "success": true,
  "message": "Password reset successful",
  "data": {
    "message": "Password has been successfully reset. You can now login."
  }
}



Response Fields
Field
Description
success
Indicates whether the password reset operation was successful.
message
Overall password reset result message.
data.message
Confirmation that the password was successfully reset and the user can log in again.

Test Result
HTTP Status: 200 OK
Password Reset: ✅ Successful
New Password: ✅ Set Successfully
Login Available: ✅ Yes



User Login After Password Reset
Description
Authenticates the user using the newly reset password.
This test verifies that the password reset operation was successfully applied and that the user can log in with the new password.
Endpoint
http://localhost:5000/api/v1/auth/login
Method
POST
Request
Headers
Content-Type: application/json

Body
{
  "email": "owner@mybusiness.com",
  "password": "NewSecretPassword123!"
}

Response
HTTP Status
200 OK
Actual Response
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "6aa78e121de33866504da3ae",
      "email": "owner@mybusiness.com",
      "firstName": "Rahul",
      "lastName": "Sharma",
      "phone": "+919876543210",
      "role": "ORG_ADMIN",
      "avatarUrl": "",
      "organizationId": "6aa78e121de33866504da3ac"
    },
    "organization": {
      "id": "6aa78e121de33866504da3ac",
      "name": "Rahul Technologies",
      "slug": "rahul-technologies-55nj",
      "plan": "FREE_TRIAL"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWE3OGUxMjFkZTMzODY2NTA0ZGEzYWUiLCJlbWFpbCI6Im93bmVyQG15YnVzaW5lc3MuY29tIiwicm9sZSI6Ik9SR19BRE1JTiIsIm9yZ2FuaXphdGlvbklkIjoiNmFhNzhlMTIxZGUzMzg2NjUwNGRhM2FjIiwiaWF0IjoxNzg5MzY2Njc3LCJleHAiOjE3ODk5NzE0Nzd9.6IGnvuyayRI6WT6MCh7eCgit59SSeYXCH261gCWlblk",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWE3OGUxMjFkZTMzODY2NTA0ZGEzYWUiLCJlbWFpbCI6Im93bmVyQG15YnVzaW5lc3MuY29tIiwicm9sZSI6Ik9SR19BRE1JTiIsIm9yZ2FuaXphdGlvbklkIjoiNmFhNzhlMTIxZGUzMzg2NjUwNGRhM2FjIiwiaWF0IjoxNzg5MzY2Njc3LCJleHAiOjE3OTE5NTg2Nzd9.tbriT5LG5su2E9sSgKBkw5QPEgk10yLNGN4CqN9PbCg"
  }
}

Response Fields
Field
Description
success
Indicates successful authentication.
message
Login result message.
data.user.id
Unique user ID.
data.user.email
User email address.
data.user.firstName
User first name.
data.user.lastName
User last name.
data.user.phone
User phone number.
data.user.role
User organization role.
data.user.avatarUrl
User avatar URL.
data.user.organizationId
Associated organization ID.
data.organization.id
Organization ID.
data.organization.name
Organization name.
data.organization.slug
Organization slug.
data.organization.plan
Current organization plan.
data.accessToken
JWT access token generated after successful login.
data.refreshToken
JWT refresh token generated after successful login.

Test Result
HTTP Status: 200 OK
Login with New Password: ✅ Successful
Password Reset Verification: ✅ Passed
User: Rahul Sharma
Role: ORG_ADMIN
Organization: Rahul Technologies
Access Token: ✅ Generated
Refresh Token: ✅ Generated


—-----------------User Logout—---------------
Description
Logs out the currently authenticated user and terminates the active authentication session.
The request requires a valid access token.
Endpoint
http://localhost:5000/api/v1/auth/logout
Method
POST
Request
Headers
Authorization: Bearer <ACCESS_TOKEN>

Body
No request body required.
Response
HTTP Status
200 OK
Actual Response
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}

Response Fields
Field
Description
success
Indicates that the logout operation was successful.
message
Confirmation message for the logout operation.
data
Returns null because no additional data is returned after logout.

Test Result
HTTP Status: 200 OK
Logout: ✅ Successful
Authentication Session: ✅ Logout completed




========Get Current User Profile=====
Description
Fetches the profile information of the currently authenticated user.
The response includes the user's personal/account information along with the associated organization details, account status, verification status, timestamps, and last login information.
Endpoint
http://localhost:5000/api/v1/users/me
Method
GET
Request
Headers
Authorization: Bearer <ACCESS_TOKEN>

Body
No request body required.
Response
HTTP Status
200 OK
Actual Response
{
  "success": true,
  "message": "User profile fetched successfully",
  "data": {
    "_id": "6aa78e121de33866504da3ae",
    "email": "owner@mybusiness.com",
    "firstName": "Rahul",
    "lastName": "Sharma",
    "phone": "+919876543210",
    "role": "ORG_ADMIN",
    "organizationId": {
      "branding": {
        "logoUrl": "",
        "primaryColor": "#25D366",
        "website": ""
      },
      "_id": "6aa78e121de33866504da3ac",
      "name": "Rahul Technologies",
      "slug": "rahul-technologies-55nj",
      "plan": "FREE_TRIAL",
      "status": "ACTIVE",
      "id": "6aa78e121de33866504da3ac"
    },
    "avatarUrl": "",
    "isActive": true,
    "isEmailVerified": false,
    "createdAt": "2026-09-14T06:02:58.386Z",
    "updatedAt": "2026-09-14T06:17:57.828Z",
    "lastLoginAt": "2026-09-14T06:17:57.828Z",
    "id": "6aa78e121de33866504da3ae"
  }
}

Response Fields
Field
Description
_id
Unique MongoDB identifier of the user.
email
Registered email address of the user.
firstName
User's first name.
lastName
User's last name.
phone
Registered phone number.
role
User's organization role.
organizationId
Populated organization associated with the user.
avatarUrl
User avatar URL.
isActive
Indicates whether the user account is active.
isEmailVerified
Indicates whether the user's email has been verified.
createdAt
User account creation timestamp.
updatedAt
Last user record update timestamp.
lastLoginAt
Timestamp of the user's most recent login.
id
User identifier returned by the API.

Organization Fields
Field
Description
organizationId._id
Unique organization identifier.
organizationId.name
Organization name.
organizationId.slug
Organization slug.
organizationId.plan
Current organization subscription plan.
organizationId.status
Current organization status.
organizationId.branding.logoUrl
Organization logo URL.
organizationId.branding.primaryColor
Organization primary branding color.
organizationId.branding.website
Organization website URL.
organizationId.id
Organization identifier returned in the populated object.

Test Result
HTTP Status: 200 OK
Profile Fetch: ✅ Successful
User Data: ✅ Returned
Organization Data: ✅ Populated
Account Status: ACTIVE
User Status: Active
Email Verified: false


=======Update Current User Profile====
Description
Updates the profile information of the currently authenticated user.
The API allows the authenticated user to update supported profile fields such as first name, last name, phone number, and avatar URL.
Endpoint
http://localhost:5000/api/v1/users/me
Method
PATCH
Request
Headers
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json

Body
{
  "firstName": "Rahul",
  "lastName": "Sharma (Lead)",
  "phone": "+919988776655",
  "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
}

Response
HTTP Status
200 OK
Actual Response
{
  "success": true,
  "message": "User profile updated successfully",
  "data": {
    "_id": "6aa78e121de33866504da3ae",
    "email": "owner@mybusiness.com",
    "firstName": "Rahul",
    "lastName": "Sharma (Lead)",
    "phone": "+919988776655",
    "role": "ORG_ADMIN",
    "organizationId": {
      "branding": {
        "logoUrl": "",
        "primaryColor": "#25D366",
        "website": ""
      },
      "_id": "6aa78e121de33866504da3ac",
      "name": "Rahul Technologies",
      "slug": "rahul-technologies-55nj",
      "plan": "FREE_TRIAL",
      "status": "ACTIVE",
      "id": "6aa78e121de33866504da3ac"
    },
    "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    "isActive": true,
    "isEmailVerified": false,
    "createdAt": "2026-09-14T06:02:58.386Z",
    "updatedAt": "2026-09-14T06:22:08.382Z",
    "lastLoginAt": "2026-09-14T06:17:57.828Z",
    "id": "6aa78e121de33866504da3ae"
  }
}

Response Fields
Field
Description
_id
Unique MongoDB identifier of the user.
email
User's registered email address.
firstName
Updated first name.
lastName
Updated last name.
phone
Updated phone number.
role
User's organization role.
organizationId
Populated organization associated with the user.
avatarUrl
Updated avatar URL.
isActive
Indicates whether the user account is active.
isEmailVerified
Indicates whether the user's email is verified.
createdAt
User account creation timestamp.
updatedAt
Timestamp of the latest profile update.
lastLoginAt
Timestamp of the user's most recent login.
id
User identifier returned by the API.

Organization Fields
Field
Description
organizationId._id
Unique organization identifier.
organizationId.name
Organization name.
organizationId.slug
Organization slug.
organizationId.plan
Current organization plan.
organizationId.status
Current organization status.
organizationId.branding.logoUrl
Organization logo URL.
organizationId.branding.primaryColor
Organization primary branding color.
organizationId.branding.website
Organization website URL.
organizationId.id
Organization identifier.

Test Result
HTTP Status: 200 OK
Profile Update: ✅ Successful
First Name: ✅ Updated
Last Name: ✅ Updated
Phone: ✅ Updated
Avatar URL: ✅ Updated
Organization Data: ✅ Returned



12. Get Current Organization
Description
Retrieves the organization details associated with the currently authenticated user.
Endpoint
GET http://localhost:5000/api/v1/organizations/me

Method
GET

Request
Headers
Authorization: Bearer <VALID_ACCESS_TOKEN>

Body
None

Response
Status Code: 200 OK
{
  "success": true,
  "message": "Organization details retrieved",
  "data": {
    "branding": {
      "logoUrl": "",
      "primaryColor": "#25D366",
      "website": ""
    },
    "settings": {
      "timezone": "UTC",
      "defaultLanguage": "en",
      "autoAssignment": false
    },
    "limits": {
      "maxNumbers": 2,
      "maxTeamMembers": 5,
      "monthlyMessages": 1000
    },
    "_id": "6aa78e121de33866504da3ac",
    "name": "Rahul Technologies",
    "slug": "rahul-technologies-55nj",
    "plan": "FREE_TRIAL",
    "status": "ACTIVE",
    "createdAt": "2026-09-14T06:02:58.338Z",
    "updatedAt": "2026-09-14T06:02:58.501Z",
    "ownerId": {
      "_id": "6aa78e121de33866504da3ae",
      "email": "owner@mybusiness.com",
      "firstName": "Rahul",
      "lastName": "Sharma (Lead)",
      "id": "6aa78e121de33866504da3ae"
    },
    "id": "6aa78e121de33866504da3ac"
  }
}

Response Fields
Field
Description
success
Indicates whether the request was successful
message
Organization retrieval status message
data._id
Organization database ID
data.name
Organization name
data.slug
Unique organization slug
data.plan
Current subscription plan
data.status
Organization status
data.branding
Organization branding configuration
data.branding.logoUrl
Organization logo URL
data.branding.primaryColor
Primary brand color
data.branding.website
Organization website
data.settings.timezone
Organization timezone
data.settings.defaultLanguage
Default language
data.settings.autoAssignment
Whether automatic assignment is enabled
data.limits.maxNumbers
Maximum WhatsApp numbers allowed
data.limits.maxTeamMembers
Maximum team members allowed
data.limits.monthlyMessages
Monthly message limit
data.ownerId
Organization owner information
data.createdAt
Organization creation timestamp
data.updatedAt
Last organization update timestamp

Test Result
PASSED — HTTP 200
The authenticated user's organization was successfully retrieved. The response confirms:
Organization: Rahul Technologies
Plan: FREE_TRIAL
Status: ACTIVE
Maximum WhatsApp numbers: 2
Maximum team members: 5
Monthly messages: 1000
Current auto-assignment: false
Owner information is correctly populated.


—------------------------------------------------------------------------------------------------------------------------

13. Update Current Organization
Description
Updates the organization details associated with the currently authenticated user, including organization name, branding configuration, and organization settings.
Endpoint
PATCH http://localhost:5000/api/v1/organizations/me

Method
PATCH

Request
Headers
Authorization: Bearer <VALID_ACCESS_TOKEN>
Content-Type: application/json

Body
{
  "name": "Rahul Technologies Private Limited",
  "branding": {
    "primaryColor": "#128C7E",
    "website": "https://rahultech.com",
    "logoUrl": "https://rahultech.com/logo.png"
  },
  "settings": {
    "timezone": "Asia/Kolkata",
    "defaultLanguage": "en",
    "autoAssignment": true
  }
}

Response
Status Code: 200 OK
{
  "success": true,
  "message": "Organization updated",
  "data": {
    "branding": {
      "primaryColor": "#128C7E",
      "website": "https://rahultech.com",
      "logoUrl": "https://rahultech.com/logo.png"
    },
    "settings": {
      "timezone": "Asia/Kolkata",
      "defaultLanguage": "en",
      "autoAssignment": true
    },
    "limits": {
      "maxNumbers": 2,
      "maxTeamMembers": 5,
      "monthlyMessages": 1000
    },
    "_id": "6aa78e121de33866504da3ac",
    "name": "Rahul Technologies Private Limited",
    "slug": "rahul-technologies-55nj",
    "plan": "FREE_TRIAL",
    "status": "ACTIVE",
    "createdAt": "2026-09-14T06:02:58.338Z",
    "updatedAt": "2026-09-14T06:36:36.648Z",
    "ownerId": {
      "_id": "6aa78e121de33866504da3ae",
      "email": "owner@mybusiness.com",
      "firstName": "Rahul",
      "lastName": "Sharma (Lead)",
      "id": "6aa78e121de33866504da3ae"
    },
    "id": "6aa78e121de33866504da3ac"
  }
}

Response Fields
Field
Description
success
Indicates whether the update was successful
message
Organization update status message
data._id
Organization database ID
data.name
Updated organization name
data.slug
Unique organization slug
data.plan
Current subscription plan
data.status
Organization status
data.branding.primaryColor
Updated primary brand color
data.branding.website
Updated organization website
data.branding.logoUrl
Updated organization logo URL
data.settings.timezone
Updated organization timezone
data.settings.defaultLanguage
Default language
data.settings.autoAssignment
Updated automatic assignment setting
data.limits.maxNumbers
Maximum WhatsApp numbers allowed
data.limits.maxTeamMembers
Maximum team members allowed
data.limits.monthlyMessages
Monthly message limit
data.ownerId
Organization owner information
data.createdAt
Organization creation timestamp
data.updatedAt
Last organization update timestamp

Test Result
PASSED — HTTP 200
The organization was successfully updated.
Verified changes:
Name → Rahul Technologies Private Limited
Primary color → #128C7E
Website → https://rahultech.com
Logo URL → https://rahultech.com/logo.png
Timezone → Asia/Kolkata
Default language → en
Auto assignment → true
Organization status remains → ACTIVE
Plan remains → FREE_TRIAL
Organization limits remain unchanged.






14. Get Team Members
Description
Retrieves all team members and pending team invitations associated with the currently authenticated user's organization.
Endpoint
GET http://localhost:5000/api/v1/team

Method
GET

Request
Headers
Authorization: Bearer <VALID_ACCESS_TOKEN>

Body
None

Response
Status Code: 200 OK
{
  "success": true,
  "message": "Team members retrieved",
  "data": {
    "members": [
      {
        "_id": "6aa78e121de33866504da3ae",
        "email": "owner@mybusiness.com",
        "firstName": "Rahul",
        "lastName": "Sharma (Lead)",
        "phone": "+919988776655",
        "role": "ORG_ADMIN",
        "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
        "isActive": true,
        "createdAt": "2026-09-14T06:02:58.386Z",
        "lastLoginAt": "2026-09-14T06:17:57.828Z",
        "id": "6aa78e121de33866504da3ae"
      }
    ],
    "invitations": [],
    "totalCount": 1
  }
}

Response Fields
Field
Description
success
Indicates whether the request was successful
message
Team retrieval status message
data.members
List of team members belonging to the organization
data.members[].id
Team member user ID
data.members[].email
Team member email address
data.members[].firstName
Team member first name
data.members[].lastName
Team member last name
data.members[].phone
Team member phone number
data.members[].role
Team member organization role
data.members[].avatarUrl
Team member avatar URL
data.members[].isActive
Indicates whether the member is active
data.members[].createdAt
Team member creation timestamp
data.members[].lastLoginAt
Team member's last login timestamp
data.invitations
List of pending team invitations
data.totalCount
Total number of current team members

Test Result
PASSED — HTTP 200
Verified:
Team members retrieved successfully.
Current organization has 1 team member.
Current user is ORG_ADMIN.
invitations is currently empty.
totalCount is 1.
Member profile data is correctly returned.







15. Invite Team Member
Description
Sends an invitation to a new team member to join the currently authenticated user's organization with the specified role.
Endpoint
POST http://localhost:5000/api/v1/team/invite

Method
POST

Request
Headers
Authorization: Bearer <VALID_ACCESS_TOKEN>
Content-Type: application/json

Body
{
  "email": "member@mybusiness.com",
  "role": "AGENT"
}

Response
Status Code: 200 OK
{
  "success": true,
  "message": "Invitation sent successfully",
  "data": {
    "organizationId": "6aa78e121de33866504da3ac",
    "email": "member@mybusiness.com",
    "name": "",
    "role": "AGENT",
    "invitedBy": "6aa78e121de33866504da3ae",
    "status": "PENDING",
    "inviteToken": "2e9f87f2456bac99d2ea558b5053637a2b494881157c7290",
    "expiresAt": "2026-09-21T06:40:57.526Z",
    "_id": "6aa796f91de33866504da3ca",
    "createdAt": "2026-09-14T06:40:57.527Z",
    "updatedAt": "2026-09-14T06:40:57.527Z",
    "id": "6aa796f91de33866504da3ca"
  }
}

Response Fields
Field
Description
success
Indicates whether the invitation was successfully created
message
Invitation status message
data.organizationId
Organization receiving the invited member
data.email
Email address of the invited member
data.name
Name of the invited member
data.role
Role assigned to the invited member
data.invitedBy
User ID of the person who sent the invitation
data.status
Current invitation status
data.inviteToken
Unique invitation token
data.expiresAt
Invitation expiration timestamp
data._id
Invitation database ID
data.createdAt
Invitation creation timestamp
data.updatedAt
Last invitation update timestamp
data.id
Invitation ID

Test Result
PASSED — HTTP 200
Verified:
Invitation was created successfully.
Invitee: member@mybusiness.com
Assigned role: AGENT
Invitation status: PENDING
Invitation token was generated successfully.
Expiry was set to 2026-09-21T06:40:57.526Z.
Invitation is associated with the correct organization.
invitedBy correctly identifies the current organization admin.

---

## 36. Billing & Subscription — Cashfree Payment Gateway Integration

### Test Case: Cashfree Order Creation & Sandbox Session Generation
- **Target Endpoint**: `POST /api/v1/billing/create-order`
- **Environment**: `SANDBOX`
- **App ID**: `TEST430329ae80e0f32e41a393d78b923034`
- **API Version**: `2025-01-01`

### Test Result:
**PASSED — HTTP 200**
- Order ID created successfully on Cashfree PG Sandbox.
- Payment Session ID generated for in-app modal checkout.
- Multi-tier plans (`₹1,599` / `₹2,599` / `₹15,999`) ready with UPI, Cards, NetBanking, and Wallets.
- Auto GST tax invoice receipt generation upon payment confirmation.








