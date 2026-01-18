# TODO: Modify Account Component for Admin Management

- [x] Add getAdminUser() and changeAdminPassword(newPassword) methods to auth.service.ts
- [x] Update account.component.ts to fetch and display admin info if user is admin
- [x] Modify account.component.ts template to show admin connection info and password change form
- [x] Update password change logic in account.component.ts to change admin's password
- [x] Test the changes

# TODO: Implement Client Functionality

- [x] Modify dashboard.component.ts to show client-specific data (accounts, balance, recent transactions) when user is client
- [x] Modify comptes.component.ts to show only client's accounts when user is client
- [x] Modify transactions.component.ts to show only client's transactions when user is client
- [x] Add invoice printing functionality to transactions component
- [x] Display errors in red under the concerned part instead of alerts for both admin and client
- [x] Test client login and dashboard functionality
