import { format } from 'date-fns';

export default function PrivacyPolicyPage() {
  const updatedAt = new Date('2025-02-17');

  return (
    <>
      <div className="space-y-1">
        <time
          dateTime={updatedAt.toISOString()}
          className="block text-muted-foreground text-sm"
        >
          Updated on {format(updatedAt, 'yyyy-MM-dd')}
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
          Our services do not track individual users or store personally
          identifiable information. We use{' '}
          <a
            className="font-medium underline underline-offset-4"
            href="https://posthog.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            PostHog Analytics
          </a>{' '}
          to collect <strong>session-based</strong> data to analyse traffic,
          feature usage, and service performance. This data helps us improve our
          products while ensuring anonymity and privacy.
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-1 font-semibold text-3xl tracking-tight first:mt-0">
          GDPR & Compliance
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          We comply with the General Data Protection Regulation (GDPR) and other
          relevant data protection laws. As our analytics are session-based and
          do not involve tracking individual users or storing personal data, our
          services do not require cookie consent banners. We ensure that any
          data collected remains anonymous and is used solely for improving our
          services.
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-1 font-semibold text-3xl tracking-tight first:mt-0">
          Your Privacy Choices
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Since we do not track users personally, there is no need for an opt-in
          or opt-out mechanism. However, if you have any concerns or questions
          about our data handling, you may contact us for further clarification.
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-1 font-semibold text-3xl tracking-tight first:mt-0">
          Policy Acceptance
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          By continuing to use our services, you acknowledge and accept this
          privacy policy. If you do not agree with this policy, please refrain
          from using our services.
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-1 font-semibold text-3xl tracking-tight first:mt-0">
          Policy Updates
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          We may update this privacy policy periodically to reflect changes in
          our practices or legal requirements. Any modifications will be posted
          here, and continued use of our services after such changes will
          indicate your acceptance of the updated policy.
        </p>
      </div>
    </>
  );
}
