'use client';

import type { ZrxGridColumn } from '@/components/zrx/grid/grid';
import { ZrxAlertBar } from '@/components/zrx/alertbar/alertbar';
import ZrxButton from '@/components/zrx/button/button';
import ZrxGrid from '@/components/zrx/grid/grid';
import { ZrxInput } from '@/components/zrx/input/input';
import ZrxSelect from '@/components/zrx/select/select';
import ZrxSwitch from '@/components/zrx/switch/switch';
import ZrxTagCloud from '@/components/zrx/tagcloud/tagcloud';
import ZrxTextarea from '@/components/zrx/textarea/textarea';
import { useNavigationPath } from '@/hooks/useNavigationPath';
import { useSystemBanner } from '@/hooks/useSystemBanner';
import { RiAddLine, RiAlertLine, RiCheckboxCircleLine, RiCloseLine, RiDashboardLine, RiInformationLine, RiLockLine, RiSaveLine } from '@remixicon/react';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

// Add this car data
const carData = [
  { id: 1, make: 'Toyota', model: 'Camry', year: 2021, engineSize: '2.5L', topSpeed: 135, price: 26000, inStock: true },
  { id: 2, make: 'Honda', model: 'Civic', year: 2020, engineSize: '1.8L', topSpeed: 130, price: 22000, inStock: true },
  { id: 3, make: 'Ford', model: 'Mustang', year: 2022, engineSize: '5.0L', topSpeed: 180, price: 38000, inStock: false },
  { id: 4, make: 'BMW', model: '3 Series', year: 2021, engineSize: '2.0L', topSpeed: 155, price: 42000, inStock: true },
  { id: 5, make: 'Mercedes', model: 'C Class', year: 2020, engineSize: '2.0L', topSpeed: 155, price: 45000, inStock: true },
  { id: 6, make: 'Audi', model: 'A4', year: 2021, engineSize: '2.0L', topSpeed: 150, price: 40000, inStock: false },
  { id: 7, make: 'Tesla', model: 'Model 3', year: 2022, engineSize: 'Electric', topSpeed: 162, price: 49000, inStock: true },
  { id: 8, make: 'Volkswagen', model: 'Golf', year: 2020, engineSize: '1.4L', topSpeed: 125, price: 25000, inStock: true },
  { id: 9, make: 'Hyundai', model: 'Elantra', year: 2022, engineSize: '2.0L', topSpeed: 128, price: 21000, inStock: true },
  { id: 10, make: 'Mazda', model: 'CX-5', year: 2021, engineSize: '2.5L', topSpeed: 130, price: 28000, inStock: false },
  { id: 11, make: 'Subaru', model: 'Forester', year: 2020, engineSize: '2.5L', topSpeed: 126, price: 27000, inStock: true },
  { id: 12, make: 'Chevrolet', model: 'Malibu', year: 2021, engineSize: '1.5L', topSpeed: 132, price: 24000, inStock: true },
  { id: 13, make: 'Nissan', model: 'Altima', year: 2022, engineSize: '2.5L', topSpeed: 140, price: 26000, inStock: false },
  { id: 14, make: 'Kia', model: 'Sorento', year: 2020, engineSize: '2.4L', topSpeed: 127, price: 30000, inStock: true },
  { id: 15, make: 'Jeep', model: 'Cherokee', year: 2021, engineSize: '2.0L', topSpeed: 120, price: 32000, inStock: true },
];

// Add this motorcycle data
const motorcycleData = [
  { id: 1, make: 'Honda', model: 'CBR500R', year: 2021, engineSize: '500cc', topSpeed: 115, price: 7000, inStock: true, tags: [{ id: '1', label: 'Sport' }] },
  { id: 2, make: 'Yamaha', model: 'MT-07', year: 2022, engineSize: '689cc', topSpeed: 130, price: 7600, inStock: true, tags: [{ id: '2', label: 'Naked' }] },
  { id: 3, make: 'Kawasaki', model: 'Ninja 400', year: 2021, engineSize: '399cc', topSpeed: 120, price: 5000, inStock: false, tags: [{ id: '1', label: 'Sport' }] },
  { id: 4, make: 'Ducati', model: 'Panigale V4', year: 2022, engineSize: '1103cc', topSpeed: 190, price: 28000, inStock: true, tags: [{ id: '3', label: 'Superbike' }] },
  { id: 5, make: 'Harley-Davidson', model: 'Iron 883', year: 2020, engineSize: '883cc', topSpeed: 105, price: 10000, inStock: true, tags: [{ id: '4', label: 'Cruiser' }] },
  { id: 6, make: 'Suzuki', model: 'GSX-R750', year: 2021, engineSize: '750cc', topSpeed: 175, price: 12500, inStock: true, tags: [{ id: '1', label: 'Sport' }] },
  { id: 7, make: 'BMW', model: 'S1000RR', year: 2022, engineSize: '999cc', topSpeed: 186, price: 20000, inStock: false, tags: [{ id: '3', label: 'Superbike' }] },
  { id: 8, make: 'KTM', model: 'Duke 390', year: 2021, engineSize: '373cc', topSpeed: 104, price: 5500, inStock: true, tags: [{ id: '2', label: 'Naked' }] },
  { id: 9, make: 'Triumph', model: 'Street Triple RS', year: 2022, engineSize: '765cc', topSpeed: 150, price: 12000, inStock: true, tags: [{ id: '2', label: 'Naked' }] },
  { id: 10, make: 'Indian', model: 'Scout Bobber', year: 2020, engineSize: '1133cc', topSpeed: 115, price: 13000, inStock: false, tags: [{ id: '4', label: 'Cruiser' }] },
  { id: 11, make: 'Aprilia', model: 'RS 660', year: 2021, engineSize: '659cc', topSpeed: 140, price: 11500, inStock: true, tags: [{ id: '1', label: 'Sport' }] },
  { id: 12, make: 'Moto Guzzi', model: 'V7 Stone', year: 2022, engineSize: '744cc', topSpeed: 110, price: 9000, inStock: true, tags: [{ id: '4', label: 'Cruiser' }] },
];

export default function ComponentPage() {
  const { theme, setTheme } = useTheme();
  const { setSystemBanner } = useSystemBanner();

  function toggleMode() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  const [inputValue, setInputValue] = React.useState('');
  const [inputNumber, setInputNumber] = React.useState(0);
  const [selectedValue, setSelectedValue] = React.useState('');
  const [textareaValue, setTextareaValue] = React.useState('');
  const [switchValue, setSwitchValue] = React.useState('on');
  const [tags, setTags] = React.useState<Array<{ id: string; label: string }>>([]);
  const [maxTagsError, setMaxTagsError] = React.useState<string | undefined>(undefined);
  const [selectedCar, setSelectedCar] = React.useState<string | null>(null);
  const { setNavigationPath } = useNavigationPath();

  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

  const [mounted, setMounted] = useState(false);

  const selectOptions = [
    { value: 'toyota', label: 'Toyota' },
    { value: 'honda', label: 'Honda' },
    { value: 'ford', label: 'Ford' },
    { value: 'bmw', label: 'BMW' },
    { value: 'mercedes', label: 'Mercedes-Benz' },
    { value: 'audi', label: 'Audi' },
    { value: 'volkswagen', label: 'Volkswagen' },
    { value: 'hyundai', label: 'Hyundai' },
    { value: 'chevrolet', label: 'Chevrolet' },
    { value: 'tesla', label: 'Tesla' },
  ];

  const tagOptions = [
    { id: '1', label: 'JavaScript' },
    { id: '2', label: 'TypeScript' },
    { id: '3', label: 'React' },
    { id: '4', label: 'Vue' },
    { id: '5', label: 'Angular' },
    { id: '6', label: 'Node.js' },
    { id: '7', label: 'Express' },
    { id: '8', label: 'MongoDB' },
    { id: '9', label: 'PostgreSQL' },
    { id: '10', label: 'Redis' },
    { id: '11', label: 'GraphQL' },
    { id: '12', label: 'REST API' },
    { id: '13', label: 'CSS' },
    { id: '14', label: 'HTML' },
    { id: '15', label: 'Sass' },
  ];

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    setNavigationPath([
      {
        label: 'Components',
        path: '/components',
        icon: <RiDashboardLine className="w-5 h-5" />,
      },
    ]);
  }, [setNavigationPath]);

  if (!mounted) {
    return null;
  }

  const headingStyle = clsx(
    'text-xl font-bold mb-4',
    theme === 'dark' ? 'text-white' : 'text-gray-900',
  );

  const sectionStyle = clsx(
    'p-4 rounded-lg border',
    theme === 'dark' ? 'border-gray-600' : 'border-gray-300',
  );

  const handleTagsChange = (newTags: Array<{ id: string; label: string }>) => {
    if (newTags.length > 5) {
      setMaxTagsError('Maximum of 5 tags allowed');
    } else {
      setMaxTagsError(undefined);
    }
    setTags(newTags);
  };

  const carColumns: ZrxGridColumn<typeof carData[0]>[] = [
    {
      field: 'make',
      header: 'Make',
      width: '15%',
      minWidth: '100px',
      sortable: true,
    },
    {
      field: 'model',
      header: 'Model',
      width: '15%',
      minWidth: '120px',
      sortable: true,
    },
    {
      field: 'year',
      header: 'Year',
      width: '10%',
      minWidth: '70px',
      sortable: true,
    },
    {
      field: 'engineSize',
      header: 'Engine',
      width: '10%',
      minWidth: '80px',
      sortable: true,
    },
    {
      field: 'topSpeed',
      header: 'Top Speed (mph)',
      width: '15%',
      minWidth: '120px',
      sortable: true,
      render: value => `${value} mph`,
    },
    {
      field: 'price',
      header: 'Price',
      width: '15%',
      minWidth: '90px',
      sortable: true,
      render: value => `$${value.toLocaleString()}`,
    },
    {
      field: 'inStock',
      header: 'In Stock',
      width: '10%',
      minWidth: '100px',
      sortable: true,
      render: value => (
        <ZrxSwitch
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          value={value ? 'yes' : 'no'}
          onChange={() => {}}
          disabled
          size="small"
        />
      ),
    },
    {
      field: 'id',
      header: 'Actions',
      width: '300px',
      minWidth: '400px',
      render: (_value, rowData) => (
        <div className="flex gap-2">
          <ZrxButton
            grids
            primary
            className="px-3"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCar(`${rowData.make} ${rowData.model}`);
            }}
          >
            View
          </ZrxButton>
          <ZrxButton
            grids
            secondary
            className="px-3"
            onClick={(e) => {
              e.stopPropagation();
              console.warn(`Edit ${rowData.make} ${rowData.model}`);
            }}
          >
            Edit
          </ZrxButton>
          <ZrxButton
            grids
            warning
            className="px-3"
            onClick={(e) => {
              e.stopPropagation();
              console.warn(`Alert for ${rowData.make} ${rowData.model}`);
            }}
          >
            Alert
          </ZrxButton>
          <ZrxButton
            grids
            danger
            className="px-3"
            onClick={(e) => {
              e.stopPropagation();
              console.warn(`Delete ${rowData.make} ${rowData.model}`);
            }}
          >
            Delete
          </ZrxButton>
        </div>
      ),
    },
  ];

  const motorcycleColumns: ZrxGridColumn<typeof motorcycleData[0]>[] = [
    {
      field: 'make',
      header: 'Make',
      width: '15%',
      render: (_, rowData) => (
        <ZrxInput
          value={rowData.make}
          onChange={value => console.warn(`Updated make: ${value}`)}
          placeholder="Edit make"
          grid={true}
        />
      ),
    },
    {
      field: 'model',
      header: 'Model',
      width: '15%',
      render: (_, rowData) => (
        <ZrxInput
          value={rowData.model}
          onChange={value => console.warn(`Updated model: ${value}`)}
          placeholder="Edit model"
          grid={true}
        />
      ),
    },
    {
      field: 'engineSize',
      header: 'Engine Size',
      width: '15%',
      render: (_, rowData) => (
        <ZrxSelect
          options={[
            { value: '500cc', label: '500cc' },
            { value: '689cc', label: '689cc' },
            { value: '399cc', label: '399cc' },
            { value: '1103cc', label: '1103cc' },
            { value: '883cc', label: '883cc' },
          ]}
          value={rowData.engineSize}
          onChange={value => console.warn(`Updated engine size: ${value}`)}
          placeholder="Select engine size"
          grid={true}
        />
      ),
    },
    {
      field: 'tags',
      header: 'Tags',
      width: '20%',
      render: (_, rowData) => (
        <ZrxTagCloud
          tags={rowData.tags}
          options={[
            { id: '1', label: 'Sport' },
            { id: '2', label: 'Naked' },
            { id: '3', label: 'Superbike' },
            { id: '4', label: 'Cruiser' },
          ]}
          onChange={newTags => console.warn(`Updated tags: ${JSON.stringify(newTags)}`)}
          placeholder="Add tags..."
        />
      ),
    },
    {
      field: 'inStock',
      header: 'In Stock',
      width: '10%',
      render: (_, rowData) => (
        <ZrxSwitch
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          value={rowData.inStock ? 'yes' : 'no'}
          onChange={value => console.warn(`Updated stock status: ${value}`)}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      header: 'Actions',
      width: '15%',
      render: (_, rowData) => (
        <div className="flex justify-center gap-2">
          <ZrxButton
            success
            grids
            onClick={() => console.warn(`Saved changes for ${rowData.make} ${rowData.model}`)}
          >
            Save
          </ZrxButton>
          <ZrxButton
            danger
            grids
            onClick={() => console.warn(`Deleted ${rowData.make} ${rowData.model}`)}
          >
            Delete
          </ZrxButton>
        </div>
      ),
    },
  ];

  return (
    <main>
      <div className={`min-h-screen mx-auto py-10 max-w-screen-lg px-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        {/* Theme Toggle Button */}
        <div className="mb-8">
          <ZrxButton primary onClick={toggleMode}>
            Set to
            {' '}
            {theme === 'dark' ? 'light' : 'dark'}
          </ZrxButton>
        </div>

        {/* System Banner Test Section */}
        <div className={`w-full ${sectionStyle} mb-8`}>
          <h2 className={headingStyle}>System Banner Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <ZrxButton
                primary
                onClick={() => setSystemBanner(
                  'This is a primary notification',
                  'primary',
                )}
              >
                Show Info Banner
              </ZrxButton>

              <ZrxButton
                secondary
                onClick={() => setSystemBanner(
                  'This is a secondary notification',
                  'secondary',
                )}
              >
                Show Secondary Banner
              </ZrxButton>

              <ZrxButton
                success
                onClick={() => setSystemBanner(
                  'Your changes have been successfully saved!',
                  'success',
                )}
              >
                Show Success Banner
              </ZrxButton>
            </div>

            <div className="flex flex-col gap-3">
              <ZrxButton
                warning
                onClick={() => setSystemBanner(
                  'Please review your inputs before proceeding',
                  'warning',
                )}
              >
                Show Warning Banner
              </ZrxButton>

              <ZrxButton
                danger
                onClick={() => setSystemBanner(
                  'An error occurred while processing your request',
                  'danger',
                )}
              >
                Show Error Banner
              </ZrxButton>

              <ZrxButton
                secondary
                onClick={() => setSystemBanner(null)}
              >
                Clear All Banners
              </ZrxButton>
            </div>
          </div>

          <div className="mt-4">
            <p className={textColor}>
              Note: System banners appear at the top of the application and are meant for important
              system-wide notifications. They persist across page navigation until dismissed or auto-hidden.
            </p>
          </div>
        </div>

        {/* Row 1: Buttons and Switches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Buttons Section */}
          <div className={sectionStyle}>
            <h2 className={headingStyle}>Buttons</h2>
            <div className="flex flex-col gap-3">
              <ZrxButton
                primary
                className="px-6 py-2 flex items-center gap-2"
              >
                <RiAddLine className="text-lg" />
                {' '}
                <p className="zrx-btn-text">Primary</p>
              </ZrxButton>
              <ZrxButton
                secondary
                className="px-6 py-2 flex items-center gap-2"
              >
                <RiInformationLine className="text-lg" />
                {' '}
                <p className="zrx-btn-text">Secondary</p>
              </ZrxButton>
              <ZrxButton
                warning
                className="px-6 py-2 flex items-center gap-2"
              >
                <RiAlertLine className="text-lg" />
                {' '}
                <p className="zrx-btn-text">Warning</p>
              </ZrxButton>
              <ZrxButton
                danger
                className="px-6 py-2 flex items-center gap-2"
              >
                <RiCloseLine className="text-lg" />
                {' '}
                <p className="zrx-btn-text">Danger</p>
              </ZrxButton>
              <ZrxButton
                success
                className="px-6 py-2 flex items-center gap-2"
              >
                <RiCheckboxCircleLine className="text-lg" />
                {' '}
                <p className="zrx-btn-text">Success</p>
              </ZrxButton>
              <ZrxButton
                disabled
                className="px-6 py-2 flex items-center gap-2"
              >
                <RiLockLine className="text-lg" />
                {' '}
                <p className="zrx-btn-text">Disabled</p>
              </ZrxButton>
              <ZrxButton
                forms
                className="px-6 py-2 flex items-center gap-2"
              >
                <RiSaveLine className="text-lg" />
                {' '}
                <p className="zrx-btn-text">Form Control</p>
              </ZrxButton>
            </div>
          </div>

          {/* Switch Section */}
          <div className={sectionStyle}>
            <h2 className={headingStyle}>Switches</h2>
            <div className="flex flex-col gap-5">
              <div>
                <div className={`mb-2 ${textColor}`}>Basic On/Off switch</div>
                <ZrxSwitch
                  options={[
                    { value: 'on', label: 'On' },
                    { value: 'off', label: 'Off' },
                  ]}
                  value={switchValue}
                  onChange={value => setSwitchValue(Array.isArray(value) ? (value[0] ?? 'on') : (value ?? 'on'))}
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>Multiple options</div>
                <ZrxSwitch
                  options={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' },
                  ]}
                  value="weekly"
                  onChange={value => console.warn(value)}
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>Full width</div>
                <ZrxSwitch
                  options={[
                    { value: 'option1', label: 'Option 1' },
                    { value: 'option2', label: 'Option 2' },
                    { value: 'option3', label: 'Option 3' },
                  ]}
                  value="option2"
                  onChange={value => console.warn(value)}
                  fullWidth
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>Small size</div>
                <ZrxSwitch
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                  ]}
                  value="yes"
                  onChange={value => console.warn(value)}
                  size="small"
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>Large size</div>
                <ZrxSwitch
                  options={[
                    { value: 'left', label: 'Left' },
                    { value: 'center', label: 'Center' },
                    { value: 'right', label: 'Right' },
                  ]}
                  value="center"
                  onChange={value => console.warn(value)}
                  size="large"
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>With disabled options</div>
                <ZrxSwitch
                  options={[
                    { value: 'beginner', label: 'Beginner' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'advanced', label: 'Advanced', disabled: true },
                  ]}
                  value="intermediate"
                  onChange={value => console.warn(value)}
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>Fully disabled component</div>
                <ZrxSwitch
                  options={[
                    { value: 'enabled', label: 'Enabled' },
                    { value: 'disabled', label: 'Disabled' },
                  ]}
                  value="disabled"
                  onChange={value => console.warn(value)}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Select and Tag Cloud */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Select Section */}
          <div className={sectionStyle}>
            <h2 className={headingStyle}>Select</h2>
            <div className="flex flex-col gap-5">
              <div>
                <div className={`mb-2 ${textColor}`}>Normal select</div>
                <ZrxSelect
                  placeholder="Choose a car brand"
                  options={selectOptions}
                  value={selectedValue}
                  onChange={value => setSelectedValue(value)}
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>With selected value</div>
                <ZrxSelect
                  placeholder="Choose a car brand"
                  options={selectOptions}
                  value="bmw"
                  onChange={value => setSelectedValue(value)}
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>Error state</div>
                <ZrxSelect
                  placeholder="Choose a car brand"
                  options={selectOptions}
                  errorMessage="Please select a valid option"
                  value={selectedValue}
                  onChange={value => setSelectedValue(value)}
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>Success state</div>
                <ZrxSelect
                  placeholder="Choose a car brand"
                  options={selectOptions}
                  successMessage="Great choice!"
                  value={selectedValue}
                  onChange={value => setSelectedValue(value)}
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>Disabled</div>
                <ZrxSelect
                  placeholder="Choose a car brand"
                  options={selectOptions}
                  value={selectedValue}
                  onChange={value => setSelectedValue(value)}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Tag Cloud Section */}
          <div className={sectionStyle}>
            <h2 className={headingStyle}>Tag Cloud</h2>
            <div className="flex flex-col gap-5">
              <div>
                <div className={`mb-2 ${textColor}`}>Basic tag cloud</div>
                <ZrxTagCloud
                  tags={tags}
                  options={tagOptions}
                  onChange={handleTagsChange}
                  placeholder="Add technologies..."
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>With max tags (5)</div>
                <ZrxTagCloud
                  tags={tags}
                  options={tagOptions}
                  onChange={handleTagsChange}
                  maxTags={5}
                  errorMessage={maxTagsError}
                  placeholder="Add up to 5 technologies..."
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>Predefined tags only</div>
                <ZrxTagCloud
                  tags={tags.filter(tag => tagOptions.some(option => option.id === tag.id))}
                  options={tagOptions}
                  onChange={newTags => setTags(newTags)}
                  allowNew={false}
                  placeholder="Select from existing options only..."
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>With success message</div>
                <ZrxTagCloud
                  tags={tags}
                  options={tagOptions}
                  onChange={handleTagsChange}
                  successMessage="Perfect choice!"
                  placeholder="Add one technology..."
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>Error state</div>
                <ZrxTagCloud
                  tags={tags}
                  options={tagOptions}
                  onChange={handleTagsChange}
                  errorMessage="Please select at least one framework"
                  placeholder="Add technologies..."
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>Disabled</div>
                <ZrxTagCloud
                  tags={[
                    { id: '3', label: 'React' },
                    { id: '2', label: 'TypeScript' },
                  ]}
                  options={tagOptions}
                  onChange={() => {}}
                  disabled
                  placeholder="This tag cloud is disabled"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Textarea and Text Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Textarea Section */}
          <div className={sectionStyle}>
            <h2 className={headingStyle}>Textarea</h2>
            <div className="flex flex-col gap-5">
              <div>
                <div className={`mb-2 ${textColor}`}>Normal textarea</div>
                <ZrxTextarea
                  placeholder="Type your message here..."
                  value={textareaValue}
                  onChange={value => setTextareaValue(value)}
                  rows={4}
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>With character limit</div>
                <ZrxTextarea
                  placeholder="Limited to 100 characters..."
                  value={textareaValue}
                  onChange={value => setTextareaValue(value)}
                  maxLength={100}
                  rows={3}
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>Error state</div>
                <ZrxTextarea
                  placeholder="Type your message here..."
                  errorMessage="Please enter a valid message"
                  value={textareaValue}
                  onChange={value => setTextareaValue(value)}
                  rows={3}
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>Success state</div>
                <ZrxTextarea
                  placeholder="Type your message here..."
                  successMessage="Message looks good!"
                  value={textareaValue}
                  onChange={value => setTextareaValue(value)}
                  rows={3}
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>Disabled</div>
                <ZrxTextarea
                  placeholder="This textarea is disabled"
                  value="Cannot edit this content"
                  onChange={value => setTextareaValue(value)}
                  disabled
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Text Inputs */}
          <div className={sectionStyle}>
            <h2 className={headingStyle}>Text Inputs</h2>
            <div className="flex flex-col gap-5">
              <div>
                <div className={`mb-2 ${textColor}`}>Normal input</div>
                <ZrxInput
                  placeholder="Type some text"
                  value={inputValue}
                  onChange={value => setInputValue(value as string)}
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>Error state</div>
                <ZrxInput
                  placeholder="Type some text"
                  errorMessage="Please enter valid text"
                  value={inputValue}
                  onChange={value => setInputValue(value as string)}
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>Success state</div>
                <ZrxInput
                  placeholder="Type a number"
                  successMessage="Thank you for entering valid text"
                  value={inputValue}
                  onChange={value => setInputValue(value as string)}
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>Disabled</div>
                <ZrxInput
                  placeholder="Type a number"
                  disabled
                  value={inputValue}
                  onChange={value => setInputValue(value as string)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Numeric Inputs and Numeric Inputs with Formatting */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Numeric Inputs */}
          <div className={sectionStyle}>
            <h2 className={headingStyle}>Numeric Inputs</h2>
            <div className="flex flex-col gap-5">
              <div>
                <div className={`mb-2 ${textColor}`}>Basic number input</div>
                <ZrxInput
                  placeholder="Type a number"
                  isNumber
                  value={inputNumber}
                  onChange={(value) => {
                    if (!Number.isNaN(Number(value))) {
                      setInputNumber(value as number);
                    }
                  }}
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>With error</div>
                <ZrxInput
                  placeholder="Type a number"
                  isNumber
                  errorMessage="Please enter a valid number"
                  value={inputNumber}
                  onChange={(value) => {
                    if (!Number.isNaN(Number(value))) {
                      setInputNumber(value as number);
                    }
                  }}
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>With success</div>
                <ZrxInput
                  placeholder="Type a number"
                  isNumber
                  successMessage="Looks good. Thanks!"
                  value={inputNumber}
                  onChange={(value) => {
                    if (!Number.isNaN(Number(value))) {
                      setInputNumber(value as number);
                    }
                  }}
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>Disabled</div>
                <ZrxInput
                  placeholder="Type a number"
                  isNumber
                  disabled
                  value={inputNumber}
                  onChange={(value) => {
                    if (!Number.isNaN(Number(value))) {
                      setInputNumber(value as number);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Numeric Inputs with Formatting */}
          <div className={sectionStyle}>
            <h2 className={headingStyle}>Numeric Inputs with Formatting</h2>
            <div className="flex flex-col gap-5">
              <div>
                <div className={`mb-2 ${textColor}`}>With min and max (0-10)</div>
                <ZrxInput
                  placeholder="Type a number"
                  isNumber
                  min={0}
                  max={10}
                  value={inputNumber}
                  onChange={(value) => {
                    if (!Number.isNaN(Number(value))) {
                      setInputNumber(value as number);
                    }
                  }}
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>With prefix ($)</div>
                <ZrxInput
                  placeholder="Type a number"
                  isNumber
                  min={0}
                  value={inputNumber}
                  prefix="$"
                  onChange={(value) => {
                    if (!Number.isNaN(Number(value))) {
                      setInputNumber(value as number);
                    }
                  }}
                />
              </div>

              <div>
                <div className={`mb-2 ${textColor}`}>With suffix (kg)</div>
                <ZrxInput
                  placeholder="Type a number"
                  isNumber
                  min={0}
                  value={inputNumber}
                  suffix="kg"
                  onChange={(value) => {
                    if (!Number.isNaN(Number(value))) {
                      setInputNumber(value as number);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Theme toggle before AlertBar section */}
        <div className="mt-8 mb-4">
          <ZrxButton primary onClick={toggleMode}>
            Set to
            {' '}
            {theme === 'dark' ? 'light' : 'dark'}
          </ZrxButton>
        </div>

        {/* Alert Bars Section (full width) */}
        <div className={sectionStyle}>
          <h2 className={headingStyle}>Alert Bars</h2>
          <div className="flex flex-col gap-4">
            <ZrxAlertBar
              primary
              title="Information"
              message="This is an informational alert with important details. Please read carefully."
              onClose={() => console.warn('Info alert closed')}
            />

            <ZrxAlertBar
              secondary
              title="Note"
              message="This is a secondary alert with less critical information."
              onClose={() => console.warn('Secondary alert closed')}
            />

            <ZrxAlertBar
              warning
              title="Warning"
              message="Please review your information before proceeding. Some values may need attention."
              onClose={() => console.warn('Warning alert closed')}
            />

            <ZrxAlertBar
              success
              title="Success"
              message="Your changes have been saved successfully! The operation completed without errors."
              onClose={() => console.warn('Success alert closed')}
            />

            <ZrxAlertBar
              danger
              title="Error"
              message="Something went wrong while processing your request. Please try again or contact support."
              onClose={() => console.warn('Error alert closed')}
            />
          </div>
        </div>

        {/* Theme toggle before Data Grid section */}
        <div className="mt-8 mb-4">
          <ZrxButton primary onClick={toggleMode}>
            Set to
            {' '}
            {theme === 'dark' ? 'light' : 'dark'}
          </ZrxButton>
        </div>

        {/* Data Grid Section (full width) */}
        <div className={sectionStyle}>
          <h2 className={headingStyle}>Data Grid</h2>

          {selectedCar && (
            <div className="mb-4 p-2 bg-blue-100 dark:bg-blue-900 rounded">
              Selected car:
              {' '}
              {selectedCar}
            </div>
          )}

          <ZrxGrid
            data={carData}
            columns={carColumns}
            usePagination={true}
            numPageRows={5}
            idField="id"
            minHeight="400px"
            minColumnWidth="70px"
            onCellClick={(rowData) => {
              setSelectedCar(`${rowData.make} ${rowData.model}`);
            }}
          />

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Grid without pagination</h3>
            <ZrxGrid
              data={carData.slice(0, 5)}
              columns={carColumns.filter(col => col.field !== 'id')}
              usePagination={false}
              minHeight="250px"
            />
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Grid with inputs</h3>
            <ZrxGrid
              data={motorcycleData}
              columns={motorcycleColumns}
              usePagination={true}
              numPageRows={5}
              idField="id"
              minHeight="400px"
              minColumnWidth="100px" // Ensure a minimum column width
            />
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Empty grid with minimum height</h3>
            <ZrxGrid
              data={[]}
              columns={carColumns.filter(col => col.field !== 'id')}
              usePagination={false}
              minHeight="200px"
              emptyMessage="No cars found matching your criteria"
            />
          </div>

        </div>
      </div>
    </main>
  );
}
