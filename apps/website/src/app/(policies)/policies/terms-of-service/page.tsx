import { Heading2 } from '~/components/typography/heading';
import { ListItem, UnorderedList } from '~/components/typography/list';
import { Paragraph } from '~/components/typography/text';
import { formatDate } from '~/utilities/format-helpers';

export default function TermsOfServicePage() {
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
          Terms of Service
        </h1>

        <p className="block text-sm text-muted-foreground">
          This privacy policy are only available in English.
        </p>
      </div>

      <div>
        <Heading2>Introduction</Heading2>
        <Paragraph>
          Welcome to Evaluate ("service"), a set of products provided by Apteryx
          Software ("we", "our", "us"). By using any one of our products, you
          are agreeing to the following terms. Please read them carefully. If
          you do not agree to these terms, you may not use our service.
        </Paragraph>

        <Heading2>Use of our Services</Heading2>
        <Paragraph>
          By using our services, you agree to follow these guidelines:
          <UnorderedList>
            <ListItem>
              You will use our services only for lawful purposes and in
              compliance with all applicable laws, regulations and guidelines.
            </ListItem>

            <ListItem>
              You will not use our services for any illegal or unauthorised
              purpose, including but not limited to, violation of any
              intellectual property rights, data protection laws or any other
              applicable laws and regulations.
            </ListItem>

            <ListItem>
              You will not engage in any activities that may harm or disrupt the
              service or other users' use of the service.
            </ListItem>

            <ListItem>
              You will not use our services in any way that may infringe on any
              third-party rights, including but not limited to, intellectual
              property rights, privacy rights, or any other rights.
            </ListItem>

            <ListItem>
              You will not use our services to create or promote hate speech,
              discrimination, or harassment.
            </ListItem>

            <ListItem>
              You will not use our services to impersonate or misrepresent
              yourself or others.
            </ListItem>
          </UnorderedList>
          We reserve the right to terminate or restrict your access to our
          services if you violate these terms of use.
        </Paragraph>

        <Heading2>Intellectual Property</Heading2>
        <Paragraph>
          All content and software related to our services, unless otherwise
          stated, is the property of Apteryx Software and is protected by
          copyright laws. You may not use any content or software on our website
          without express written permission.
        </Paragraph>

        <Heading2>Limitation of Liability</Heading2>
        <Paragraph>
          In no event shall Apteryx Software, or its directors, employees,
          partners, agents, suppliers, or affiliates, be liable for any damages
          whatsoever, including but not limited to, direct, indirect, special,
          incidental, or consequential damages, arising out of or in connection
          with the use or inability to use our services.
        </Paragraph>

        <Heading2>Terms Acceptance</Heading2>
        <Paragraph>
          Continued use of our services signifies your acceptance of these
          terms. If you do not accept these terms then please do not use our
          services.
        </Paragraph>

        <Heading2>Terms Changes</Heading2>
        <Paragraph>
          We reserve the right to modify these terms of use at any time. If we
          make changes to the terms of use, we will post those changes on this
          page. Your continued use of our services following any changes to
          these terms of use constitutes acceptance of those changes.
        </Paragraph>
      </div>
    </>
  );
}
