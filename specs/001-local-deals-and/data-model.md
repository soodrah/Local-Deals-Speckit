# Data Model: NearbyPerks

## Entities

### User
- id (UUID)
- name
- email
- password hash
- location (city, zip)
- preferences
- role (user, admin, merchant)
- redemption history (list of Redemption)
- ratings (list of Rating)
- invitations sent/received

### Merchant
- id (UUID)
- name
- contact info
- address (city, zip, geo-coordinates)
- deals (list of Deal)
- status (active, pending, rejected)

### Deal
- id (UUID)
- merchant_id
- title
- description
- category
- location (city, zip, geo-coordinates)
- validity (start/end date)
- redemption method (QR/barcode)
- rating
- validation status
- approved (bool)

### Redemption
- id (UUID)
- user_id
- deal_id
- timestamp
- QR/barcode
- validation status

### Notification
- id (UUID)
- user_id
- deal_id
- location
- time sent

### Ad
- id (UUID)
- targeting parameters
- display status
- error state

### Rating
- id (UUID)
- user_id
- deal_id
- score (1-5)
- comment
- timestamp

## Relationships
- User <-> Redemption (1:N)
- User <-> Rating (1:N)
- Merchant <-> Deal (1:N)
- Deal <-> Redemption (1:N)
- Deal <-> Rating (1:N)
- User <-> Notification (1:N)
- Deal <-> Notification (1:N)

## Notes
- All entities use UUIDs for identity
- Data model supports role-based access and merchant onboarding
- Designed for scalability and compliance
