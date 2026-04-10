# KBK Projet 2026

## Project Scope
- Build a React Native app with Expo Router.
- Keep the app focused on the brief in [docs/project-brief.md](../docs/project-brief.md).
- Reuse the cloned open source prompt reference when prompt examples are needed: [docs/reference/open-source-prompts/README.md](../docs/reference/open-source-prompts/README.md).

## Architecture
- Use Expo Router for navigation.
- Keep the bottom tabs for Home, Profile, Camera, and Audio.
- Keep Settings behind a Stack route from Profile only.
- Use a shared student context with name, password, image, voice, and color.
- Make the background color flow through the 4 main screens.

## UI And Behavior
- Use Pressable or TouchableOpacity on the home screen, not Button.
- Show a default image before the profile photo exists.
- Keep camera and audio flows permission-aware with fallback states.
- Show the saved audio path in the audio screen.
- Prefer clean, functional styling over decorative complexity.

## Working Rules
- Do not invent new prompts when a real source can be reused.
- Keep changes small and aligned with the brief.
- Prefer Expo-managed packages and APIs.
- Check the brief before changing routes, permissions, context, or shared styling.

## Tooling
- Use the available GitHub, web, browser, Mermaid, Python, and terminal-backed tools when they reduce guesswork.
- Prefer real project references and open source material over invented examples.
