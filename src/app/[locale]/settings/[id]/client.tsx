'use client';

import { ZrxAlertBar } from '@/components/zrx/alertbar/alertbar';
import ZrxButton from '@/components/zrx/button/button';
import { ZrxInput } from '@/components/zrx/input/input';
import ZrxSwitch from '@/components/zrx/switch/switch';
import { useNavigationPath } from '@/hooks/useNavigationPath';
import {
  RiCloseLine,
  RiKeyLine,
  RiSave3Line,
  RiSettings3Line,
} from '@remixicon/react';
import Link from 'next/link';
import { useLayoutEffect, useState } from 'react';

type Settings = {
  smtp: {
    enabled: string;
    server: string;
    port: string;
    username: string;
    passwordMasked: string;
  };
  database: {
    enabled: string;
    host: string;
    port: string;
    name: string;
    username: string;
    passwordMasked: string;
  };
  jira: {
    enabled: string;
    url: string;
    projectKey: string;
    username: string;
    apiKeyMasked: string;
  };
};

type SettingsClientProps = {
  initialSettings: Settings;
};

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const { setNavigationPath } = useNavigationPath();

  // SMTP state
  const [smtpEnabled, setSmtpEnabled] = useState(initialSettings.smtp.enabled);
  const [smtpServer, setSmtpServer] = useState(initialSettings.smtp.server);
  const [smtpPort, setSmtpPort] = useState(initialSettings.smtp.port);
  const [smtpUsername, setSmtpUsername] = useState(initialSettings.smtp.username);
  const [smtpPassword, setSmtpPassword] = useState('');

  // SMTP alert states
  const [smtpSaveSuccess, setSmtpSaveSuccess] = useState(false);
  const [smtpTestSuccess, setSmtpTestSuccess] = useState(false);
  const [smtpTestWarning, setSmtpTestWarning] = useState(false);
  const [smtpSaveError, setSmtpSaveError] = useState(false);
  const [smtpSaveWarning, setSmtpSaveWarning] = useState(false);
  const [smtpTestErrorMessage, setSmtpTestErrorMessage] = useState('');
  const [smtpSaveErrorMessage, setSmtpSaveErrorMessage] = useState('');
  const [smtpSaveWarningMessage, setSmtpSaveWarningMessage] = useState('');

  // Database state
  const [dbEnabled, setDbEnabled] = useState(initialSettings.database.enabled);
  const [dbHost, setDbHost] = useState(initialSettings.database.host);
  const [dbPort, setDbPort] = useState(initialSettings.database.port);
  const [dbName, setDbName] = useState(initialSettings.database.name);
  const [dbUsername, setDbUsername] = useState(initialSettings.database.username);
  const [dbPassword, setDbPassword] = useState('');

  // Database alert states
  const [dbSaveSuccess, setDbSaveSuccess] = useState(false);
  const [dbTestSuccess, setDbTestSuccess] = useState(false);
  const [dbTestWarning, setDbTestWarning] = useState(false);
  const [dbSaveError, setDbSaveError] = useState(false);
  const [dbTestErrorMessage, setDbTestErrorMessage] = useState('');
  const [dbSaveErrorMessage, setDbSaveErrorMessage] = useState('');

  // JIRA state
  const [jiraEnabled, setJiraEnabled] = useState(initialSettings.jira.enabled);
  const [jiraUrl, setJiraUrl] = useState(initialSettings.jira.url);
  const [jiraProjectKey, setJiraProjectKey] = useState(initialSettings.jira.projectKey);
  const [jiraUsername, setJiraUsername] = useState(initialSettings.jira.username);
  const [jiraApiKey, setJiraApiKey] = useState('');

  // JIRA alert states
  const [jiraSaveSuccess, setJiraSaveSuccess] = useState(false);
  const [jiraTestSuccess, setJiraTestSuccess] = useState(false);
  const [jiraTestWarning, setJiraTestWarning] = useState(false);
  const [jiraSaveError, setJiraSaveError] = useState(false);
  const [jiraTestErrorMessage, setJiraTestErrorMessage] = useState('');
  const [jiraSaveErrorMessage, setJiraSaveErrorMessage] = useState('');

  // Use layout effect with higher priority to update navigation path immediately
  useLayoutEffect(() => {
    setNavigationPath([
      {
        label: 'Settings',
        path: '/settings',
        icon: <RiSettings3Line className="w-5 h-5" />,
      },
      {
        label: 'System Configuration',
        path: '/settings/system',
        icon: <RiSettings3Line className="w-5 h-5" />,
      },
    ]);
  }, [setNavigationPath]);

  // SMTP handlers
  const handleSmtpTest = () => {
    if (smtpEnabled === 'No') {
      setSmtpTestWarning(true);
      setSmtpTestErrorMessage('SMTP is disabled. Enable it first to test the connection.');
      return;
    }

    // Simulate API call with timeout
    setTimeout(() => {
      if (smtpServer && smtpPort && smtpUsername) {
        setSmtpTestSuccess(true);
        setSmtpTestWarning(false);
      } else {
        setSmtpTestWarning(true);
        setSmtpTestErrorMessage('Please fill in all required SMTP fields.');
      }
    }, 0);
  };

  const handleSmtpSave = () => {
    // Simulate API call with timeout
    setTimeout(() => {
      if (smtpEnabled === 'No') {
        setSmtpSaveWarning(true);
        setSmtpSaveWarningMessage('Email notifications are now disabled.');
        return;
      }

      if (smtpServer && smtpPort && smtpUsername) {
        setSmtpSaveSuccess(true);
        setSmtpSaveError(false);
      } else {
        setSmtpSaveError(true);
        setSmtpSaveErrorMessage('Please fill in all required SMTP fields.');
      }
    }, 0);
  };

  // Database handlers
  const handleDbTest = () => {
    if (dbEnabled === 'No') {
      setDbTestWarning(true);
      setDbTestErrorMessage('Database integration is disabled. Enable it first to test the connection.');
      return;
    }

    // Simulate API call with timeout
    setTimeout(() => {
      if (dbHost && dbPort && dbName && dbUsername) {
        setDbTestSuccess(true);
        setDbTestWarning(false);
      } else {
        setDbTestWarning(true);
        setDbTestErrorMessage('Please fill in all required database fields.');
      }
    }, 0);
  };

  const handleDbSave = () => {
    // Simulate API call with timeout
    setTimeout(() => {
      if (dbEnabled === 'Yes' && (!dbHost || !dbPort || !dbName || !dbUsername)) {
        setDbSaveError(true);
        setDbSaveErrorMessage('Please fill in all required database fields.');
        return;
      }

      setDbSaveSuccess(true);
      setDbSaveError(false);
    }, 0);
  };

  // JIRA handlers
  const handleJiraTest = () => {
    if (jiraEnabled === 'No') {
      setJiraTestWarning(true);
      setJiraTestErrorMessage('JIRA integration is disabled. Enable it first to test the connection.');
      return;
    }

    // Simulate API call with timeout
    setTimeout(() => {
      if (jiraUrl && jiraProjectKey && jiraUsername) {
        setJiraTestSuccess(true);
        setJiraTestWarning(false);
      } else {
        setJiraTestWarning(true);
        setJiraTestErrorMessage('Please fill in all required JIRA fields.');
      }
    }, 0);
  };

  const handleJiraSave = () => {
    // Simulate API call with timeout
    setTimeout(() => {
      if (jiraEnabled === 'Yes' && (!jiraUrl || !jiraProjectKey || !jiraUsername)) {
        setJiraSaveError(true);
        setJiraSaveErrorMessage('Please fill in all required JIRA fields.');
        return;
      }

      setJiraSaveSuccess(true);
      setJiraSaveError(false);
    }, 0);
  };

  return (
    <>
      {/* Email (SMTP) Section */}
      <section className="mt-10 w-full">
        <div className="flex items-center justify-between w-full md:w-1/2">
          <h2 className="zrx-h1 mb-0">Email (SMTP)</h2>
          <div className="flex items-center">
            <ZrxSwitch
              options={[
                { value: 'No', label: 'Disabled' },
                { value: 'Yes', label: 'Enabled' },
              ]}
              value={smtpEnabled}
              onChange={value => setSmtpEnabled(value as string)}
              size="small"
              toggle={true} // Enable toggle styling
            />
          </div>
        </div>

        {/* Conditional explainer text with zrx-field-description class */}
        <p className="mt-6 mb-4 zrx-field-description">
          Email is
          {' '}
          <span className={smtpEnabled === 'Yes' ? 'font-bold text-green-0' : 'font-bold text-red-0'}>
            {smtpEnabled === 'Yes' ? 'enabled' : 'disabled'}
          </span>
          .
          {smtpEnabled === 'Yes'
            ? ' The system can send email notifications.'
            : ' The system will not send email notifications.'}
        </p>

        {/* Alert bars for SMTP - will show conditionally */}
        {smtpSaveSuccess && (
          <div className="mt-4 mb-4">
            <ZrxAlertBar
              success
              title="Success"
              message="Your email settings have been saved."
              onClose={() => setSmtpSaveSuccess(false)}
            />
          </div>
        )}

        {smtpTestSuccess && (
          <div className="mt-4 mb-4">
            <ZrxAlertBar
              primary
              title="Test Successful"
              message="SMTP connection test completed successfully."
              onClose={() => setSmtpTestSuccess(false)}
            />
          </div>
        )}

        {smtpTestWarning && (
          <div className="mt-4 mb-4">
            <ZrxAlertBar
              warning
              title="Warning"
              message={smtpTestErrorMessage}
              onClose={() => setSmtpTestWarning(false)}
            />
          </div>
        )}

        {smtpSaveError && (
          <div className="mt-4 mb-4">
            <ZrxAlertBar
              danger
              title="Error"
              message={smtpSaveErrorMessage}
              onClose={() => setSmtpSaveError(false)}
            />
          </div>
        )}

        {smtpSaveWarning && (
          <div className="mt-4 mb-4">
            <ZrxAlertBar
              warning
              title="Integration Disabled"
              message={smtpSaveWarningMessage}
              onClose={() => setSmtpSaveWarning(false)}
            />
          </div>
        )}

        <div className="mt-6">
          <div className="flex items-center gap-2">
            <h3 className="zrx-h4">Server Settings</h3>
            {smtpEnabled === 'No' && (
              <RiCloseLine
                className="text-red-0 text-xl h-6 w-6 flex-shrink-0"
                style={{
                  marginTop: '-6px',
                }}
              />
            )}
          </div>

          <p
            className="zrx-field-description"
            style={{
              lineHeight: '23px',
            }}
          >
            {initialSettings.smtp.passwordMasked && (
              <>
                Your current SMTP password ends in&nbsp;
                <b>{initialSettings.smtp.passwordMasked}</b>
                .
                <br />
              </>
            )}
            Configure your SMTP server and enter a new password if needed.
          </p>
          <p className="zrx-field-description my-4 mb-5">
            <Link href="#" className="zrx-link-primary">
              Learn more about email configurations.
            </Link>
          </p>

          {/* SMTP Server Address field */}
          <div className="w-full md:w-1/2 mb-4">
            <ZrxInput
              value={smtpServer}
              onChange={(value: string | number) => setSmtpServer(String(value))}
              placeholder="Server (smtp.xxxx.com)"
              style={{ width: '100%' }}
              disabled={smtpEnabled === 'No'}
            />
          </div>

          {/* SMTP Port field */}
          <div className=" w-full md:w-1/2 mb-4">
            <ZrxInput
              value={smtpPort}
              onChange={(value: string | number) => setSmtpPort(String(value))}
              placeholder="Port (e.g., 587 or 465)"
              style={{ width: '100%' }}
              disabled={smtpEnabled === 'No'}
            />
          </div>

          {/* SMTP Username field */}
          <div className="w-full md:w-1/2 mb-4">
            <ZrxInput
              value={smtpUsername}
              onChange={(value: string | number) => setSmtpUsername(String(value))}
              placeholder="Sender Address (e.g., sre@xxxx.com)"
              style={{ width: '100%' }}
              disabled={smtpEnabled === 'No'}
            />
          </div>

          {/* SMTP Password field */}
          <div className="w-full md:w-1/2 mb-4">
            <ZrxInput
              value={smtpPassword}
              onChange={(value: string | number) => setSmtpPassword(String(value))}
              placeholder="Password or app-specific password"
              style={{ width: '100%' }}
              disabled={smtpEnabled === 'No'}
            />
          </div>

          {/* Button group with Test and Save buttons side by side */}
          <div className="mt-6 w-full md:w-1/2 flex gap-3">
            <ZrxButton
              secondary
              className="flex items-center justify-center gap-2 w-1/2"
              style={{ width: '100%' }}
              onClick={handleSmtpTest}
              disabled={smtpEnabled === 'No'}
            >
              <RiKeyLine className="text-lg" />
              {' '}
              Test
            </ZrxButton>

            <ZrxButton
              primary
              className="flex items-center justify-center gap-2 w-1/2"
              style={{ width: '100%' }}
              onClick={handleSmtpSave}
            >
              <RiSave3Line className="text-lg" />
              {' '}
              Save
            </ZrxButton>
          </div>
        </div>
      </section>

      {/* divider */}
      <div className="zrx-horizontal-divider my-10" />

      {/* Database Section */}
      <section className="mt-18 w-full">
        <div className="flex items-center justify-between w-full md:w-1/2">
          <h2 className="zrx-h1 mb-0">Database</h2>
          <div className="flex items-center">
            <ZrxSwitch
              options={[
                { value: 'No', label: 'Disabled' },
                { value: 'Yes', label: 'Enabled' },
              ]}
              value={dbEnabled}
              onChange={value => setDbEnabled(value as string)}
              size="small"
              toggle={true}
            />
          </div>
        </div>

        {/* Conditional explainer text */}
        <p className="mt-6 mb-4 zrx-field-description">
          Database is
          {' '}
          <span className={dbEnabled === 'Yes' ? 'font-bold text-green-0' : 'font-bold text-red-0'}>
            {dbEnabled === 'Yes' ? 'enabled' : 'disabled'}
          </span>
          .
          {dbEnabled === 'Yes'
            ? ' The system will store data in the configured database.'
            : ' The system will not store any data.'}
        </p>

        {/* Alert bars for Database */}
        {dbSaveSuccess && (
          <div className="mt-4 mb-4">
            <ZrxAlertBar
              success
              title="Success"
              message="Your database settings have been saved."
              onClose={() => setDbSaveSuccess(false)}
            />
          </div>
        )}

        {dbTestSuccess && (
          <div className="mt-4 mb-4">
            <ZrxAlertBar
              primary
              title="Test Successful"
              message="Database connection test completed successfully."
              onClose={() => setDbTestSuccess(false)}
            />
          </div>
        )}

        {dbTestWarning && (
          <div className="mt-4 mb-4">
            <ZrxAlertBar
              warning
              title="Warning"
              message={dbTestErrorMessage}
              onClose={() => setDbTestWarning(false)}
            />
          </div>
        )}

        {dbSaveError && (
          <div className="mt-4 mb-4">
            <ZrxAlertBar
              danger
              title="Error"
              message={dbSaveErrorMessage}
              onClose={() => setDbSaveError(false)}
            />
          </div>
        )}

        <div className="mt-6">
          <div className="flex items-center gap-2">
            <h3 className="zrx-h4">Connection Settings</h3>
            {dbEnabled === 'No' && (
              <RiCloseLine
                className="text-red-0 text-xl h-6 w-6 flex-shrink-0"
                style={{
                  marginTop: '-6px',
                }}
              />
            )}
          </div>

          <p
            className="zrx-field-description"
            style={{
              lineHeight: '23px',
            }}
          >
            {initialSettings.database.passwordMasked && (
              <>
                Your current database password ends in&nbsp;
                <b>{initialSettings.database.passwordMasked}</b>
                .
                <br />
              </>
            )}
            Configure your database connection details below.
          </p>
          <p className="zrx-field-description my-4 mb-5">
            <Link href="#" className="zrx-link-primary">
              Learn more about database integrations.
            </Link>
          </p>

          {/* Database Host field */}
          <div className="w-full md:w-1/2 mb-4">
            <ZrxInput
              value={dbHost}
              onChange={(value: string | number) => setDbHost(String(value))}
              placeholder="Host (e.g., localhost or db.example.com)"
              style={{ width: '100%' }}
              disabled={dbEnabled === 'No'}
            />
          </div>

          {/* Database Port field */}
          <div className="w-full md:w-1/2 mb-4">
            <ZrxInput
              value={dbPort}
              onChange={(value: string | number) => setDbPort(String(value))}
              placeholder="Port (e.g., 5432 for PostgreSQL)"
              style={{ width: '100%' }}
              disabled={dbEnabled === 'No'}
            />
          </div>

          {/* Database Name field */}
          <div className="w-full md:w-1/2 mb-4">
            <ZrxInput
              value={dbName}
              onChange={(value: string | number) => setDbName(String(value))}
              placeholder="Database Name"
              style={{ width: '100%' }}
              disabled={dbEnabled === 'No'}
            />
          </div>

          {/* Database Username field */}
          <div className="w-full md:w-1/2 mb-4">
            <ZrxInput
              value={dbUsername}
              onChange={(value: string | number) => setDbUsername(String(value))}
              placeholder="Username"
              style={{ width: '100%' }}
              disabled={dbEnabled === 'No'}
            />
          </div>

          {/* Database Password field */}
          <div className="w-full md:w-1/2 mb-4">
            <ZrxInput
              value={dbPassword}
              onChange={(value: string | number) => setDbPassword(String(value))}
              placeholder="Password (leave empty to keep current)"
              style={{ width: '100%' }}
              disabled={dbEnabled === 'No'}
            />
          </div>

          {/* Button group with Test and Save buttons */}
          <div className="mt-6 w-full md:w-1/2 flex gap-3">
            <ZrxButton
              secondary
              className="flex items-center justify-center gap-2 w-1/2"
              style={{ width: '100%' }}
              onClick={handleDbTest}
              disabled={dbEnabled === 'No'}
            >
              <RiKeyLine className="text-lg" />
              {' '}
              Test
            </ZrxButton>

            <ZrxButton
              primary
              className="flex items-center justify-center gap-2 w-1/2"
              style={{ width: '100%' }}
              onClick={handleDbSave}
            >
              <RiSave3Line className="text-lg" />
              {' '}
              Save
            </ZrxButton>
          </div>
        </div>
      </section>

      {/* divider */}
      <div className="zrx-horizontal-divider my-10" />

      {/* JIRA Section */}
      <section className="mt-18 w-full mb-16">
        <div className="flex items-center justify-between w-full md:w-1/2">
          <h2 className="zrx-h1 mb-0">JIRA Integration</h2>
          <div className="flex items-center">
            <ZrxSwitch
              options={[
                { value: 'No', label: 'Disabled' },
                { value: 'Yes', label: 'Enabled' },
              ]}
              value={jiraEnabled}
              onChange={value => setJiraEnabled(value as string)}
              size="small"
              toggle={true}
            />
          </div>
        </div>

        {/* Conditional explainer text */}
        <p className="mt-6 mb-4 zrx-field-description">
          JIRA integration is
          {' '}
          <span className={jiraEnabled === 'Yes' ? 'font-bold text-green-0' : 'font-bold text-red-0'}>
            {jiraEnabled === 'Yes' ? 'enabled' : 'disabled'}
          </span>
          .
          {jiraEnabled === 'Yes'
            ? ' The system will create JIRA tickets.'
            : ' The system will not create JIRA tickets.'}
        </p>

        {/* Alert bars for JIRA */}
        {jiraSaveSuccess && (
          <div className="mt-4 mb-4">
            <ZrxAlertBar
              success
              title="Success"
              message="Your JIRA integration settings have been saved."
              onClose={() => setJiraSaveSuccess(false)}
            />
          </div>
        )}

        {jiraTestSuccess && (
          <div className="mt-4 mb-4">
            <ZrxAlertBar
              primary
              title="Test Successful"
              message="JIRA connection test completed successfully."
              onClose={() => setJiraTestSuccess(false)}
            />
          </div>
        )}

        {jiraTestWarning && (
          <div className="mt-4 mb-4">
            <ZrxAlertBar
              warning
              title="Warning"
              message={jiraTestErrorMessage}
              onClose={() => setJiraTestWarning(false)}
            />
          </div>
        )}

        {jiraSaveError && (
          <div className="mt-4 mb-4">
            <ZrxAlertBar
              danger
              title="Error"
              message={jiraSaveErrorMessage}
              onClose={() => setJiraSaveError(false)}
            />
          </div>
        )}

        <div className="mt-6">
          <div className="flex items-center gap-2">
            <h3 className="zrx-h4">JIRA Settings</h3>
            {jiraEnabled === 'No' && (
              <RiCloseLine
                className="text-red-0 text-xl h-6 w-6 flex-shrink-0"
                style={{
                  marginTop: '-6px',
                }}
              />
            )}
          </div>

          <p
            className="zrx-field-description"
            style={{
              lineHeight: '23px',
            }}
          >
            {initialSettings.jira.apiKeyMasked && (
              <>
                Your current JIRA API key ends in&nbsp;
                <b>{initialSettings.jira.apiKeyMasked}</b>
                .
                <br />
              </>
            )}
            Configure your JIRA integration details below.
          </p>
          <p className="zrx-field-description my-4 mb-5">
            <Link href="#" className="zrx-link-primary">
              Learn more about JIRA integration.
            </Link>
          </p>

          {/* JIRA URL field */}
          <div className="w-full md:w-1/2 mb-4">
            <ZrxInput
              value={jiraUrl}
              onChange={(value: string | number) => setJiraUrl(String(value))}
              placeholder="JIRA URL (e.g., https://your-domain.atlassian.net)"
              style={{ width: '100%' }}
              disabled={jiraEnabled === 'No'}
            />
          </div>

          {/* JIRA Project Key field */}
          <div className="w-full md:w-1/2 mb-4">
            <ZrxInput
              value={jiraProjectKey}
              onChange={(value: string | number) => setJiraProjectKey(String(value))}
              placeholder="Project Key (e.g., INC)"
              style={{ width: '100%' }}
              disabled={jiraEnabled === 'No'}
            />
          </div>

          {/* JIRA Username field */}
          <div className="w-full md:w-1/2 mb-4">
            <ZrxInput
              value={jiraUsername}
              onChange={(value: string | number) => setJiraUsername(String(value))}
              placeholder="Username or Email"
              style={{ width: '100%' }}
              disabled={jiraEnabled === 'No'}
            />
          </div>

          {/* JIRA API Key field */}
          <div className="w-full md:w-1/2 mb-4">
            <ZrxInput
              value={jiraApiKey}
              onChange={(value: string | number) => setJiraApiKey(String(value))}
              placeholder="API Key (leave empty to keep current)"
              style={{ width: '100%' }}
              disabled={jiraEnabled === 'No'}
            />
          </div>

          {/* Button group with Test and Save buttons */}
          <div className="mt-6 w-full md:w-1/2 flex gap-3">
            <ZrxButton
              secondary
              className="flex items-center justify-center gap-2 w-1/2"
              style={{ width: '100%' }}
              onClick={handleJiraTest}
              disabled={jiraEnabled === 'No'}
            >
              <RiKeyLine className="text-lg" />
              {' '}
              Test
            </ZrxButton>

            <ZrxButton
              primary
              className="flex items-center justify-center gap-2 w-1/2"
              style={{ width: '100%' }}
              onClick={handleJiraSave}
            >
              <RiSave3Line className="text-lg" />
              {' '}
              Save
            </ZrxButton>
          </div>
        </div>
      </section>
    </>
  );
}
