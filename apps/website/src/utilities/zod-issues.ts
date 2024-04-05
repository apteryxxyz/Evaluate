/**
 * Combines the messages of multiple issues into a single message.
 * @param issues the issues to combine
 * @returns the combined message
 */
export function combineIssueMessages(issues: { message?: string }[]) {
  return issues.reduce((message, issue, i) => {
    if (!issue.message) return message;
    if (issue.message.endsWith('.')) issue.message = issue.message.slice(0, -1);

    if (i === 0) message += issue.message;
    else if (i !== issues.length - 1)
      message += `, ${issue.message.toLowerCase()}`;
    else if (i === issues.length - 1)
      message += ` and ${issue.message.toLowerCase()}`;

    if (i === issues.length - 1) message += '.';
    return message;
  }, '');
}
