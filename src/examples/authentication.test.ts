import { scenario, given, when, then } from '../index';

scenario('User signs into the application successfully', async () => {
  given.user.isOnLoginPage();
  
  await when.user.authenticates({
    email: 'valid@example.com',
    password: 'correctPassword',
  });
  
  await then.user.sees.dashboard();
  await then.user.sees.notification('success', 'Welcome back!');
});

scenario('User sees error with invalid credentials', async () => {
  given.user.isOnLoginPage();
  given.api.willRejectAuthentication();
  
  await when.user.authenticates({
    email: 'valid@example.com',
    password: 'wrongPassword',
  });
  
  await then.user.sees.errorMessage('Invalid credentials');
});

scenario('User navigates to protected page when authenticated', async () => {
  given.user.isAuthenticated();
  
  await when.user.navigatesTo('/settings');
  
  await then.user.sees.text('Settings');
});
