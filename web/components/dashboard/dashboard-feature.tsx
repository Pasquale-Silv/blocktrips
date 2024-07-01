'use client';

import { AppHero } from '../ui/ui-layout';

const links: { label: string; href: string }[] = [
  { label: 'BlockTrips Business', href: '/trips/create' },
  { label: 'BlockTrips Traveler', href: '/trips/traveler' }
];

export default function DashboardFeature() {
  return (
    <div>
      <AppHero title="Welcome to BlockTrips" subtitle="Start trading Trips." />
      <div className="max-w-xl mx-auto py-6 sm:px-6 lg:px-8 text-center">
        <div className="space-y-2">
          <p>Here are some helpful links to get you started.</p>
          {links.map((link, index) => (
            <div key={index}>
              <a
                href={link.href}
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
