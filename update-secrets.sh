# update-secrets.sh — lancer après chaque session Vocareum
#!/bin/bash

REPO="eng-oumayma/Plateforme-Integree-de-Surveillance-et-de-Pilotage-des-Actions-Correctives"
echo "Mise à jour des credentials AWS dans GitHub Secrets..."

gh secret set AWS_ACCESS_KEY_ID     --body "$AWS_ACCESS_KEY_ID"     --repo $REPO
gh secret set AWS_SECRET_ACCESS_KEY --body "$AWS_SECRET_ACCESS_KEY" --repo $REPO
gh secret set AWS_SESSION_TOKEN     --body "$AWS_SESSION_TOKEN"     --repo $REPO

echo "✅ Secrets mis à jour"