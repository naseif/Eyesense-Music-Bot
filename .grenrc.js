module.exports = {
    "dataSource": "commits",
    "includeMessages": "all",
    "changelogFilename": "CHANGELOG.md",
    "template": {
        commit: (info) => `- ${info.sha}: ${info.message} | (@${info.author})`,
        issue: "- {{labels}} {{name}} [{{text}}]({{url}})",
        label: "[**{{label}}**]",
        noLabel: "closed",
        group: "\n#### {{heading}}\n",
        changelogTitle: "# Changelog\n\n",
        release: "## {{release}} ({{date}})\n{{body}}",
        releaseSeparator: "\n---\n\n"
    }
}
