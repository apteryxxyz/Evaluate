import { formatDate } from '~/utilities/format-helpers';

export default function TermsOfServicePage() {
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
          Terms of Service
        </h1>
      </div>

      <div>
        <h2 className="mt-10 scroll-m-20 border-b pb-1 font-semibold text-3xl tracking-tight first:mt-0">
          Introduction
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Welcome to Evaluate ("service"), a set of products provided by Apteryx
          Software ("we", "our", "us"). By using any one of our products, you
          are agreeing to the following terms. Please read them carefully. If
          you do not agree to these terms, you may not use our service.
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-1 font-semibold text-3xl tracking-tight first:mt-0">
          Use of our Services
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          By using our services, you agree to follow these guidelines:
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>
              You will use our services only for lawful purposes and in
              compliance with all applicable laws, regulations and guidelines.
            </li>

            <li>
              You will not use our services for any illegal or unauthorised
              purpose, including but not limited to, violation of any
              intellectual property rights, data protection laws or any other
              applicable laws and regulations.
            </li>

            <li>
              You will not engage in any activities that may harm or disrupt the
              service or other users' use of the service.
            </li>

            <li>
              You will not use our services in any way that may infringe on any
              third-party rights, including but not limited to, intellectual
              property rights, privacy rights, or any other rights.
            </li>

            <li>
              You will not use our services to create or promote hate speech,
              discrimination, or harassment.
            </li>

            <li>
              You will not use our services to impersonate or misrepresent
              yourself or others.
            </li>
          </ul>
          We reserve the right to terminate or restrict your access to our
          services if you violate these terms of use.
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-1 font-semibold text-3xl tracking-tight first:mt-0">
          Intellectual Property
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          All content and software related to our services, unless otherwise
          stated, is the property of Apteryx Software and is protected by
          copyright laws. You may not use any content or software on our website
          without express written permission.
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-1 font-semibold text-3xl tracking-tight first:mt-0">
          Limitation of Liability
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          In no event shall Apteryx Software, or its directors, employees,
          partners, agents, suppliers, or affiliates, be liable for any damages
          whatsoever, including but not limited to, direct, indirect, special,
          incidental, or consequential damages, arising out of or in connection
          with the use or inability to use our services.
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-1 font-semibold text-3xl tracking-tight first:mt-0">
          Terms Acceptance
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Continued use of our services signifies your acceptance of these
          terms. If you do not accept these terms then please do not use our
          services.
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-1 font-semibold text-3xl tracking-tight first:mt-0">
          Terms Changes
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          We reserve the right to modify these terms of use at any time. If we
          make changes to the terms of use, we will post those changes on this
          page. Your continued use of our services following any changes to
          these terms of use constitutes acceptance of those changes.
        </p>
      </div>
    </>
  );
}
