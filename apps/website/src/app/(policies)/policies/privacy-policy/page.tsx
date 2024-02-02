import { Heading2 } from '~/components/typography/heading';
import { Anchor, Paragraph } from '~/components/typography/text';
import { formatDate } from '~/utilities/format-helpers';

export default function PrivacyPolicyPage() {
  const updatedAt = new Date('2024-02-02');

  return (
    <>
      <div className="space-y-1">
        <time
          dateTime={formatDate(updatedAt, 'full')}
          className="block text-sm text-muted-foreground"
        >
          Updated on {formatDate(updatedAt, 'full')}
        </time>

        <h1 className="text-4xl font-bold leading-tight lg:text-5xl">
          Privacy Policy
        </h1>

        <p className="block text-sm text-muted-foreground">
          This privacy policy is only available in English.
        </p>
      </div>

      <div>
        <Heading2>Introduction</Heading2>
        <Paragraph>
          The privacy of our visitors is a top priority for Apteryx Software
          ("we", "our", "us") and, by extension, Evaluate ("service") and its
          products. The types of information that Evaluate gathers and records,
          as well as how we utilise it, are detailed in this privacy policy
          document.
        </Paragraph>

        <Heading2>Data Collection and Usage</Heading2>
        <Paragraph>
          Our service does not collect any information itself. We use{' '}
          <Anchor
            href="https://posthog.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            PostHog
          </Anchor>{' '}
          analytics to collect data about user behaviour, custom events capture,
          session recordings, feature flags, and more. This data is used to
          analyse traffic and usage of our all of our services. This allows us
          to provide a better user experience for our visitors.
        </Paragraph>

        <Heading2>Policy Acceptance</Heading2>
        <Paragraph>
          Continued use of our service signifies your acceptance of this policy.
          If you do not accept the policy then please do not use our services.
          When registering we will further request your explicit acceptance of
          the privacy policy.
        </Paragraph>

        <Heading2>Policy Changes</Heading2>
        <Paragraph>
          We may update this privacy policy from time to time. We encourage you
          to review this privacy policy periodically to stay informed about how
          we are helping to protect the personal information we collect. Your
          continued use of this site after any change in this privacy policy
          will constitute your acceptance of such change.
        </Paragraph>
      </div>
    </>
  );
}
