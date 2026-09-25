# TODO

- [ ] **Share and persist subscriptions**: The Subscriptions tab still reads the static `HOME_SUBSCRIPTIONS` data, so anything added through the create modal only shows on the home screen and is lost when the app restarts. Move subscriptions into shared state with persistent storage so both tabs show the same list.
- [ ] **Brand icons for new subscriptions**: Use an icon/logo library so a new subscription automatically gets a matching icon (e.g. the Spotify logo for "Spotify"), and fall back to a default icon when there's no match.
- [ ] **Spending analytics**: Add an analytics tool such as PostHog or Amplitude to track how users spend and learn from their spending patterns.
- [ ] **Receipt scanning**: Use the camera to scan receipts so users can log other kinds of expenses, or to fill in the create-subscription form for them.
