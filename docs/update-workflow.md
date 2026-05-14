# Update Workflow

## EAS Build

Use EAS Build when native configuration changes, native dependencies change, app icons change, splash config changes, permissions change, or the first installable APK is needed.

## EAS Update

Use EAS Update for JavaScript, TypeScript, curriculum data, styling, copy, and most image asset updates after a compatible APK is already installed.

## Preview Flow

1. Run checks locally.
2. Commit changes.
3. Push to GitHub.
4. Build or update the preview branch.
5. Install the APK if a native rebuild is required.
6. Use EAS Update for compatible post-install updates.

## Commands

```bash
npm install
npm run lint
npm test
npx expo start
eas login
eas build:configure
eas build --platform android --profile preview
eas update --branch preview --message "Update DIY Electrician Academy"
```
