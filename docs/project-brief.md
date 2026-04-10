# KBK Projet 2026 - Resume

Source: "KBK Projet 2026.pdf"

## Scope
- React Native app with Expo Router.
- 5 screens total.
- 3 bottom navigation buttons with icons.
- Shared student context with: name, password, image, voice, and color.

## Main Requirements
- Ask permissions for camera, microphone, and phone data or storage.
- Use a simple login check on the home screen.
- Use Expo Router for navigation.
- Use styles for a clean, functional UI.

## Screen Notes
- Home: show college and names, two input fields, and a Pressable or TouchableOpacity, not a Button.
- Profile: show the name, the captured image, one icon for audio playback, and one icon for settings. Show a default image before capture.
- Settings: accessible only from Profile through Stack navigation. Show the person name in the navigator and component. Allow background color changes that affect the 4 main screens.
- Camera: allow front or back camera, plus two extra features such as zoom, autofocus, or flash. Allow taking and saving a photo.
- Audio: allow recording, saving, and playback of audio. Display the saved audio file path.

## Notes For Future Work
- The project needs shared state for the student object.
- The background color must stay consistent across the main screens.
- Camera and audio flows must handle permission states and fallback UI.
