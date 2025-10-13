import { format } from 'date-fns';

export default function TermsOfServicePage() {
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
          Terms of Service
        </h1>
      </div>

      <div>
        <h2 className="mt-10 scroll-m-20 border-b pb-1 font-semibold text-3xl tracking-tight first:mt-0">
          Introduction
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Welcome to Evaluate ("service"), a set of products provided by Apteryx
          Software ("we", "our", "us"). By using any of our products, you agree
          to the following terms. If you do not agree, you may not use our
          service.
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-1 font-semibold text-3xl tracking-tight first:mt-0">
          Use of Our Services
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          By using our services, you agree to adhere to the following
          guidelines:
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>
              You will use our services lawfully and in compliance with
              applicable laws and regulations.
            </li>
            <li>
              You will not use our services for any unauthorised or illegal
              purposes, including infringement of intellectual property rights
              and data protection laws.
            </li>
            <li>
              You will not engage in activities that harm or disrupt our service
              or interfere with other users.
            </li>
            <li>
              You will not create, distribute, or promote hate speech,
              harassment, or discrimination.
            </li>
            <li>
              You will not impersonate others or misrepresent your identity.
            </li>
          </ul>
          We reserve the right to suspend or terminate your access if you
          violate these terms.
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-1 font-semibold text-3xl tracking-tight first:mt-0">
          Intellectual Property
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          All content and software related to our services, unless otherwise
          stated, is the property of Apteryx Software and protected by copyright
          laws. Unauthorised use, reproduction, or distribution is strictly
          prohibited.
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-1 font-semibold text-3xl tracking-tight first:mt-0">
          Limitation of Liability
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Apteryx Software and its affiliates shall not be liable for any
          direct, indirect, incidental, or consequential damages arising from
          the use or inability to use our services.
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-1 font-semibold text-3xl tracking-tight first:mt-0">
          Acceptance of Terms
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          By continuing to use our services, you acknowledge and accept these
          terms. If you do not agree, please refrain from using our services.
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-1 font-semibold text-3xl tracking-tight first:mt-0">
          Changes to Terms
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          We may update these terms periodically. Any changes will be posted
          here, and continued use of our services after modifications signifies
          acceptance of the revised terms.
        </p>
      </div>
    </>
  );
}
