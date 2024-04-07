import { formatDate } from '~/utilities/format-helpers';

export default function PrivacyPolicyPage() {
  const updatedAt = new Date('2024-02-02');

  return (
    <>
      <div className="space-y-1">
        <time
          dateTime={updatedAt.toISOString()}
          className="block text-muted-foreground text-sm"
        >
          Updated on {formatDate(updatedAt, 'full')}
        </time>

        <h1 className="font-bold text-4xl leading-tight lg:text-5xl">
          Privacy Policy
        </h1>
      </div>

      <div>
        <h2 className="mt-10 scroll-m-20 border-b pb-1 font-semibold text-3xl tracking-tight first:mt-0">
          Introduction
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          The privacy of our visitors is a top priority for Apteryx Software
          ("we", "our", "us") and, by extension, Evaluate ("service") and its
          products. The types of information that Evaluate gathers and records,
          as well as how we utilise it, are detailed in this privacy policy
          document.
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-1 font-semibold text-3xl tracking-tight first:mt-0">
          Data Collection and Usage
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Our service does not collect any information itself, however we do use{' '}
          <a
            className="font-medium underline underline-offset-4"
            href="https://posthog.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            PostHog Analytics
          </a>{' '}
          to collect data about user behaviour, custom events capture, session
          recordings, feature flags, and more. This data is used to analyse
          traffic and usage of our all of our services. This allows us to
          provide a better user experience for our visitors.
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-1 font-semibold text-3xl tracking-tight first:mt-0">
          Policy Acceptance
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Continued use of our service signifies your acceptance of this policy.
          If you do not accept the policy then please do not use our services.
          When registering we will further request your explicit acceptance of
          the privacy policy.
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-1 font-semibold text-3xl tracking-tight first:mt-0">
          Policy Changes
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          We may update this privacy policy from time to time. We encourage you
          to review this privacy policy periodically to stay informed about how
          we are helping to protect the personal information we collect. Your
          continued use of this site after any change in this privacy policy
          will constitute your acceptance of such change.
        </p>
      </div>
    </>
  );
}
