#!/bin/bash

# Helper script for versioning and publishing

# Check if version type is provided
if [ -z "$1" ]; then
  echo "Error: Version type not specified"
  echo "Usage: ./scripts/publish.sh [patch|minor|major]"
  exit 1
fi

VERSION_TYPE=$1

# Validate version type
if [[ "$VERSION_TYPE" != "patch" && "$VERSION_TYPE" != "minor" && "$VERSION_TYPE" != "major" ]]; then
  echo "Error: Invalid version type. Use 'patch', 'minor', or 'major'"
  exit 1
fi

# Check if there are uncommitted changes
if [[ -n $(git status -s) ]]; then
  echo "Error: There are uncommitted changes. Please commit or stash them first."
  exit 1
fi

# Update version
echo "Updating version ($VERSION_TYPE)..."
npm version $VERSION_TYPE

# Push changes and tags
echo "Pushing changes and tags..."
git push && git push --tags

echo "Done! GitHub Actions will now build and publish the package."