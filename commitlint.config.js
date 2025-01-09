module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'],
    'jira-issue-in-scope': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'jira-issue-in-scope': ({ scope }) => {
          return [
            scope && scope.match(/\b([A-Z]{1,10}-\d+(, ?[A-Z]{1,10}-\d+)*|HOTFIX|VERSION)\b/),
            'scope should contain a JIRA issue number. Something like this - "KEY-20", "KEY-20, KEY-21", "HOTFIX" or "VERSION"',
          ];
        },
      },
    },
  ],
  prompt: {
    questions: {
      scope: {
        description: 'What is the scope of this change (JIRA issue number like KEY-20)',
      },
    },
  },
};
