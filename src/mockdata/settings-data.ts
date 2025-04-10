// This is a placeholder for the actual data fetching logic
// In a real application, this would call your API

export async function getSettings(_id: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Return mock data
  return {
    smtp: {
      enabled: 'No',
      server: '',
      port: '',
      username: '',
      passwordMasked: '1234',
    },
    database: {
      enabled: 'No',
      host: '',
      port: '',
      name: '',
      username: '',
      passwordMasked: '5678',
    },
    jira: {
      enabled: 'No',
      url: '',
      projectKey: '',
      username: '',
      apiKeyMasked: '9012',
    },
  };
}
