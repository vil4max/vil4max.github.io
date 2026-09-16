# Max Vilchevskiy

Senior iOS Engineer | Agentic AI Engineering

Kyiv, Ukraine · Remote

Available immediately · Employment or contractor (FOP)

[vil4max@gmail.com](mailto:vil4max@gmail.com) · [Telegram](https://t.me/vil4max) · [LinkedIn](https://www.linkedin.com/in/vil4max/) · [Portfolio](https://vil4max.github.io) · [GitHub](https://github.com/vil4max)

## About

I'm a Senior iOS Engineer with 13 years of experience in iOS, consumer products, and fintech. I've built apps from scratch and worked on established products through years of growth. At Drinkit, I was part of the team that launched the app with its first coffee shop. At Umico, I developed marketplace features as the product grew into Birmarket, then built a subscription SDK for several host apps. My recent work also includes a watchOS voice client with an iPhone relay.

I use coding agents for planning, implementation, testing, verification, and code review in released products and R&D work. I make the technical decisions and check the results. I built and released DriveCheckUA and OneCart Family this way. DriveCheckUA includes a Foundation Models summary with structured output, validation, and deterministic fallback. I also built a separate Swift agent/tool runtime with a 38-case evaluation corpus and validation on a real device.

I'm looking for two kinds of roles: Senior iOS Engineer positions on long-term products, particularly in iOS and fintech, and Applied AI / AI engineering roles centered on agent orchestration, tool calling, and evaluation — the same discipline behind the Swift agent/tool runtime above. I can take a feature from technical planning through implementation and release, and I'd like to contribute to other parts of the product over time.

## Skills

**iOS & Apple Platforms:** Swift · Objective-C · UIKit · SwiftUI · Swift Concurrency · Combine · URLSession · REST APIs · WebSockets · Core Data · Keychain Services · StoreKit 2 · watchOS · WatchConnectivity · Realtime Audio Streaming

**AI Engineering & Development:** Apple Foundation Models · Context Engineering · Agentic SDLC · Agentic Workflows · Tool Calling · Structured Outputs · Continuous Evaluation · Deterministic Verification · Human-in-the-Loop Engineering · AI-Assisted Development

**Architecture & Delivery:** Swift Package Manager (SPM) · Modular Architecture · MVVM · Clean Architecture · Dependency Injection · Protocol-Oriented Programming · XCTest · Xcode Instruments · Performance Optimization · CI/CD · App Store Connect

## Experience

### Senior iOS Engineer · GlobalLogic (contract R&D)

Jan 2026 - Jun 2026

Apple Watch voice assistant · Hands-free fieldwork

An R&D Apple Watch voice assistant for hands-free fieldwork. Worked with the wider R&D team on the Apple platform client. Led watchOS interaction flows, audio streaming, and the iPhone relay. Mapped structured AI/backend responses to navigation, application state, warnings, and UI actions. Implemented Work Point details, hazards, maps, and navigation, together with a custom emergency flow. The iPhone relay handled real-time communication within watchOS runtime limits. Once the demo was delivered, I created Jira evaluation scenarios for VelocityAI, checked generated implementations against requirements and visual references, and reviewed fixes and regressions. Shipped a TestFlight demo package with codebase and documentation.

- Built the watchOS voice interface with persistent listening sessions and haptics, mapping structured assistant responses onto known screens and actions rather than executing arbitrary model instructions.
- Implemented the iPhone relay for realtime audio and WebSocket traffic around watchOS runtime limits, plus Work Point maps with compass navigation, polygon geometry, and a custom emergency flow.
- Evaluated GlobalLogic's VelocityAI SDLC hands-on: authored Jira scenarios with visual references and checked implementations, fixes, and regressions against spec.

**Technologies:** WebSockets · WatchKit · Swift Concurrency · WatchConnectivity · URLSessionWebSocketTask · AVFoundation · Audio Streaming · Structured AI Responses

[Project details](https://vil4max.github.io/projects.html#project-watch-ai-assistant)

### Senior iOS Engineer · PASHA Holding

Apr 2022 - Jan 2026

Birmarket · Marketplace shopping and loyalty

Birmarket (formerly Umico) is a consumer marketplace in the PASHA ecosystem. Embedded in the loyalty engineering team alongside backend and QA specialists. Shipped core loyalty features and spearheaded subscription modularization. Joined the existing product in 2022. Competo had been a PASHA Holding subsidiary since March 2020; the marketplace was renamed Birmarket in July 2025. Official company context: https://pasha-holding.az/en/ecosystem/competo/. Marketplace work covered ordering, delivery, profiles, partner information, and loyalty. Extracted feature modules and shared infrastructure while continuing feature delivery, and diagnosed memory leaks, retain cycles, and UI hangs with Xcode Instruments. During the final year, rebuilt Premium Subscription as a remote Swift Package for Birmarket, Birbank, and M10. Hosts retained authentication and token refresh; the SDK accepted a scoped token and managed its own networking. I defined integration contracts and worked on shared analytics. Onboarded a new iOS engineer, coordinated feature assignments, and participated in mandatory code reviews. The larger mobile organization used several feature teams with dedicated technical leadership. Used A/B tests, feature flags, and remote configuration. Designed and implemented the SDK analytics abstraction with PostHog independently of host-level Firebase analytics. Validated the unified subscription package through host integration and TestFlight.

- Extracted Premium Subscription from the Birmarket monolith into a remote Swift Package for three host apps — Birmarket, Birbank, and m10 — breaking cyclic host dependencies on networking and themes.
- Designed the module's integration surface and analytics abstraction: hosts pass a scoped token and keep Firebase, authentication, and token refresh, while the SDK owns networking with PostHog routing by host and module.
- Diagnosed production memory leaks, retain cycles, and UI hangs with Instruments; onboarded an iOS engineer, coordinated feature assignments, and reviewed code in the loyalty team.

**Technologies:** UIKit · SwiftUI · Swift Concurrency · Swift Package Manager (SPM) · Modular Architecture · Clean Architecture · Multi-host SDK · Unit Testing · Integration Testing · CI/CD · Xcode Instruments · A/B Testing · Feature Flags · Remote Configuration · Product Analytics · Firebase · PostHog

[Project details](https://vil4max.github.io/projects.html#project-birmarket)

### Senior iOS Engineer · Drinkit

Feb 2020 - Feb 2022

Drinkit · Mobile coffee ordering

Drinkit was a digital coffee-shop startup in Dodo Brands, linking mobile ordering with preparation and pickup. Worked in a product team of about 20 across engineering, design, QA and product. Helped establish the mobile team and took ownership of iOS features and releases. Organized an existing team of three iOS and two Android engineers to join the product. Responsibilities spanned menu features, shared integrations, and the connected ordering and pickup flow. Implemented much of drink customization, including ingredient dependencies, availability, and price calculations from backend parameters. Integrated contextual offers selected by the backend and host-side interaction with a separately developed payment SDK. Implemented looping menu videos and offline caching; covered financial calculations, cart state, selected services, and APIs with tests. Drinkit later expanded internationally; its official site lists 215+ coffee shops across five countries: https://drinkit.io/. Worked with A/B tests, feature flags, and remote configuration as the product evolved. Launched the app with the first coffee shop and developed the product for two years.

- Implemented drink customization and pricing, refined UX with the designer, and worked with A/B tests and feature flags.
- Built looping menu videos and offline caching, and integrated the payment SDK on the host side.
- Covered cart and pricing rules with tests and prepared release builds and manual-testing scenarios.

**Technologies:** Swift · UIKit · Combine · Swift Package Manager (SPM) · Grand Central Dispatch (GCD) · OperationQueue · MVP · Coordinator · AVFoundation · AVPlayer · File-system Caching · Payment SDK Integration · Unit Testing · Integration Testing · URLSession · REST APIs · A/B Testing · Feature Flags · Remote Configuration

[Project details](https://vil4max.github.io/projects.html#project-drinkit)

### iOS Developer · SOLVVE

Jan 2019 - Feb 2020

PLAYHERA · Esports tournament platform

PLAYHERA, an established esports tournament platform. Joined the iOS team at SOLVVE, working in its architecture and review process. Implemented assigned tournament, profile and news features in the RxSwift/UIKit codebase. The product included schedules, matches, ratings, team communication, and player information. My implementation work used the existing reactive feature flows and team conventions. Maintained production App Store releases for the live esports application.

- Implemented tournament tables, profiles, and settings within the existing UIKit architecture.
- Developed news and feed functionality using RxSwift and the team’s code-review process.

**Technologies:** Swift · UIKit · RxSwift · Reactive UI · Production Maintenance · Code Review

[Project details](https://vil4max.github.io/projects.html#project-playhera)

### iOS Developer · Electus

Jul 2018 - Nov 2018

Electus · Consumer cryptocurrency wallet

Electus, a consumer-crypto startup building a wallet for Ethereum and Bitcoin users. Worked as the primary iOS developer inside the startup team. Built the first iOS client from scratch and shaped wallet flows together with the team. Used Keychain, Touch ID, and seed-phrase verification to protect wallet flows. Integrated a third-party Ethereum client for testnet transactions and retrieved Bitcoin balance and network data. Worked with the team on transfers expressed through contacts and fiat amounts and on defining and testing smart-contract behavior. Buying, swapping, and the broader portal remained product plans. Delivered an internal TestFlight MVP with wallet, market data, charts and a news feed.

- Implemented wallet creation, import, balances, asset lists, and market-data charts.
- Integrated secure storage, seed-phrase verification, Ethereum testnet tracking, and Bitcoin data.

**Technologies:** Swift · UIKit · Keychain Services · Touch ID · Ethereum Testnet · Transaction Tracking · Smart Contract Integration

[Project details](https://vil4max.github.io/projects.html#project-electus)

### iOS Developer · GBKSoft

Jun 2017 - Jun 2018

Clovis · Online retail; Eastern Union · Real estate; Bluetooth trackers and offline games

The work spanned retail, real estate, an offline game, and Bluetooth hardware R&D. Worked in product teams and was the primary developer of the Clovis storefront. Implemented storefront features and BLE integration, tested physical tracker prototypes, and maintained existing apps. Configured Bluetooth tracker prototypes, measured their behavior, and debugged the software/device integration. The R&D application did not reach the App Store. Clovis covered product browsing, authentication, and purchasing for a US sports-nutrition business. Eastern Union work involved translating domain rules into screen behavior and information structure. Extended the existing Defend Ukraine offline game with local difficulty levels, including changes to opponent counts. Released Clovis and later updates; delivered tracker TestFlight builds and game changes that reached the App Store.

- Developed and tested CoreBluetooth integration with physical tracker prototypes.
- Built Clovis storefront flows and delivered subsequent App Store updates.
- Implemented real-estate features, defect fixes, and offline game difficulty levels.

**Technologies:** REST APIs · CoreBluetooth · Physical Device Testing · TestFlight · Swift · UIKit · Requirements Analysis · Feature Development · Production Maintenance

[Project details](https://vil4max.github.io/projects.html#project-eastern-union)

### iOS Developer · Amconsoft

Nov 2015 - Jun 2017

AcuCharting · Patient records; ALERT · Resilience training; FlipTaxi · Taxi ordering

The applications covered acupuncture patient records, resilience training for law-enforcement users, and taxi ordering. Developed AcuCharting and ALERT independently and worked with a team on FlipTaxi. Implemented offline records and interactive 3D treatment mapping, audio exercises and reminders, and passenger-side maps and location updates. AcuCharting used SceneKit body models and Core Data for patient visits and needle-placement history. I implemented rotation, zoom, and editing treatment points, then delivered later App Store updates. ALERT delivered guided exercises with local audio playback and scheduled reminders. FlipTaxi covered authorization and taxi-order flows; the passenger client polled backend positions supplied by driver clients. Released AcuCharting and ALERT on the App Store; FlipTaxi reached a backend-connected beta.

- Built offline patient records and interactive treatment mapping on a 3D body model.
- Implemented local audio playback, seeking, and scheduled reminders in ALERT.
- Developed map and location features for the FlipTaxi passenger beta.

**Technologies:** SceneKit · Core Data · Maps · API Integration · UIKit · AVFoundation · Audio Playback · UserNotifications · Local Reminders · App Store Delivery

[Project details](https://vil4max.github.io/projects.html#project-alert)

### iOS Developer · Tap4Parking

Nov 2014 - Nov 2015

Tap4Parking · Parking discovery and availability

Tap4Parking was a Kyiv startup building a municipal parking app for finding facilities and checking available spaces. Worked independently on the iOS application within the startup. Implemented the map interface, location handling, availability display, and directions to facilities; compared map providers and explored indoor positioning separately. Compared MapKit, Google Maps, and Yandex Maps for map detail and coverage, then used Google Maps SDK for the map surface. The released app showed facility-level availability. Drivers located individual spaces themselves once inside; payments were outside its scope. Released the parking-search app on the App Store; indoor positioning remained a separate prototype.

- Displayed parking locations and available-space counts, with location handling and directions to a facility.
- Explored indoor positioning with proposed floor-mounted transmitters in a separate prototype.

**Technologies:** Objective-C · UIKit · Google Maps SDK · Core Location · MapKit Evaluation · Parking Availability · Indoor Positioning Prototype

[Project details](https://vil4max.github.io/projects.html#project-tap4parking)

### Junior iOS Developer · iCenter

Dec 2013 - Nov 2014

AlphaSMS · Bulk messaging; Ukrainian news aggregator

AlphaSMS brought an existing bulk-messaging service to mobile; a second app aggregated Ukrainian news. Worked alongside an Android developer on AlphaSMS, each responsible for one platform. Built the iOS clients in a junior role, covering interface, navigation, API integration, and manual testing. AlphaSMS included message composition, drafts, scheduled sends, mailing history, and a contact book. I separated networking, UI, and basic business logic as the implementation evolved. The news client let users select sources and browse a chronological feed with images, headlines, and links to the original articles. Released both applications on the App Store, taking the news client from idea to delivery.

- Implemented AlphaSMS messaging flows and service API integration.
- Developed source subscriptions and a chronological news feed, with navigation to original articles.

**Technologies:** Objective-C · UIKit · API Integration · Separation of Concerns · Manual Testing · App Store Delivery

## Selected projects

### Apple Watch Voice AI (R&D / demo)

[GlobalLogic](https://vil4max.github.io/index.html#milestone-globallogic)

An internal R&D project explored a hands-free voice assistant for field workers using Apple Watch. Worked within the wider R&D team on the Apple-platform client. Designed and implemented watchOS interaction flows, an iPhone relay for live audio and WebSocket traffic, and structured-response mapping within agreed contracts. Implemented a custom emergency flow and Work Point details, hazards, maps, and navigation across the watch and phone. Structured replies selected known screens and actions rather than executing arbitrary model instructions. The iPhone relay carried live audio and WebSocket traffic within watchOS runtime limits. After the engagement, I evaluated an internal AI-assisted iOS development workflow using Jira requirements and visual references. Delivered a TestFlight demo package with codebase and documentation, then evaluated AI-assisted development workflows.

- Designed a custom emergency flow on watchOS
- Built the voice conversation interface and an iPhone relay for WebSocket communication and live audio
- Translated structured AI commands into UI actions on the device
- Implemented Work Point maps, hazards, and navigation across the watch and phone

**Technologies:** WatchKit · Swift Concurrency · WatchConnectivity · URLSessionWebSocketTask · AVFoundation · Audio Streaming · Structured AI Responses

### Birmarket: Marketplace & Loyalty

[PASHA Holding](https://vil4max.github.io/index.html#milestone-pasha)

Umico was an existing PASHA-ecosystem product growing toward a leading marketplace in Azerbaijan, later renamed Birmarket. Worked in the loyalty team alongside mobile, backend, QA, and product specialists. Developed shopping and loyalty features, extracted shared modules, and later took primary responsibility for the multi-host Premium Subscription SDK. Joined in 2022 after the marketplace and its App Store app already existed within the PASHA ecosystem. Competo became a PASHA Holding subsidiary in March 2020, before my tenure; the Birmarket name followed in July 2025. [Company context](https://pasha-holding.az/en/ecosystem/competo/) · [About Birmarket](https://bir.az/en/news/bir-ecosystem-strengthens-its-position-with-birmarket-the-countrys-largest-e-commerce-platform). Birmarket, Birbank, and M10 integrated the same remote Swift Package. Each host handled authentication, session lifecycle, and token refresh, then passed a scoped access token through a small public API. The SDK managed its own networking. Worked on shared analytics and modularization of the larger UIKit app. Feature development involved mobile and backend engineers, QA, business analysts, and product owners across several product teams. Used A/B tests, feature flags, and remote configuration during product development. Worked with host-level Firebase analytics and independently designed the subscription SDK analytics layer with PostHog, keeping it independent from the host analytics setup. Subscription functionality became reusable across Birmarket, Birbank, and m10 through one SDK.

- Reimplemented Premium Subscription as a configurable multi-host SPM SDK
- Defined host/SDK API boundaries with backend and platform teams
- Diagnosed memory leaks, retain cycles, and UI hangs in production using Xcode Instruments
- Worked on modularizing a large production iOS codebase

**Technologies:** UIKit · SwiftUI · Swift Concurrency · Swift Package Manager (SPM) · Modular Architecture · Clean Architecture · Multi-host SDK · Unit Testing · Integration Testing · CI/CD · Xcode Instruments · A/B Testing · Feature Flags · Remote Configuration · Product Analytics · Firebase · PostHog

[App Store](https://apps.apple.com/us/app/birmarket-online-shopping-app/id1458111389)

### Drinkit: Coffee Ordering App

[Drinkit](https://vil4max.github.io/index.html#milestone-drinkit)

Drinkit began as a digital coffee-shop startup within Dodo Brands, connecting mobile ordering with preparation and pickup. Worked in a product team of about twenty people across mobile, backend, design, QA, product, and hardware. Developed the iOS app, organized the mobile team’s arrival, and shaped features and architecture collaboratively. The mobile group had three iOS and two Android engineers. I organized its move into Drinkit and worked with startup management and the team on features and the initial technical approach. Drink customization depended on ingredient relationships, shop availability, and backend pricing parameters. I implemented much of that functionality, integrated backend-selected offers, and displayed order status through polling. Implemented looping menu videos, offline data caching, and host-side payment SDK integration. The app connected customer orders to backend preparation state and in-shop pickup displays. Used A/B tests, feature flags, and remote configuration during product development. Launched the app with the first coffee shop and developed the product for two years.

- Built and released the iOS app with a three-engineer team for the first coffee-shop launch
- Developed the product for two years, connecting ordering in the app with preparation and pickup in the shop
- Developed and refined drink customization as the product grew
- Integrated contextual offers using shared client and backend data
- Displayed order-preparation status through backend polling

**Technologies:** Swift · UIKit · Combine · Swift Package Manager (SPM) · Grand Central Dispatch (GCD) · OperationQueue · MVP · Coordinator · AVFoundation · AVPlayer · File-system Caching · Payment SDK Integration · Unit Testing · Integration Testing · URLSession · REST APIs · A/B Testing · Feature Flags · Remote Configuration

[App Store](https://apps.apple.com/us/app/drinkit-order-your-coffee/id1495622004)

### PLAYHERA: esports tournaments

[SOLVVE](https://vil4max.github.io/index.html#milestone-solvve)

Playhera was an established international esports platform for managing tournaments, teams, players, and results. Worked in the iOS team at SOLVVE within an existing architecture and review process. Developed tournament tables and standings, profiles and settings, and news features in a Swift/UIKit application using RxSwift. Worked in the existing UIKit architecture with RxSwift. Changes followed the team’s code-review process and included tournament tables and standings, profiles, settings, news, and the news feed. Shipped the features in App Store updates to the existing esports application.

- Shipped features and updates for an esports app already on the App Store
- Developed tournament-management features within the existing architecture
- Implemented UIKit features using RxSwift

**Technologies:** Swift · UIKit · RxSwift · Reactive UI · Production Maintenance · Code Review

[App Store](https://apps.apple.com/ua/app/playhera/id1449021935)

### Eastern Union: CRE app

[GBKSoft](https://vil4max.github.io/index.html#milestone-gbksoft)

Eastern Union was an established commercial real-estate application under ongoing development. Worked as part of the GBKSoft development team. Interpreted domain-specific documentation, implemented features, and corrected defects within the existing Swift/UIKit codebase. The work involved translating real-estate documentation into screen behavior and information structure. Changes were incremental additions and refinements to the existing application. Delivered scoped maintenance and feature changes to the existing application.

- Maintained and refined the existing commercial real-estate app
- Implemented features and fixes within its Swift/UIKit codebase

**Technologies:** Swift · UIKit · Requirements Analysis · Feature Development · Production Maintenance

[App Store](https://apps.apple.com/us/app/eastern-union/id1125123079)

### FinTech R&D

R&D prototype · Beta

A fintech prototype for trading physical gold with Ethereum ownership records. Collaborated on iOS alongside backend engineers. Owned the client app across KYC onboarding, portfolio tracking, and buy/sell flows. The app used the backend middleware API for business operations and could query public Ethereum APIs for transaction information. Gold balances and ownership records were maintained by the backend. Integrated third-party KYC, Stripe, and Apple Pay into the beta purchase flow. The UIKit client also displayed portfolio balances and price charts and supported selling gold. Delivered a functional beta with Stripe and Apple Pay checkout.

- Implemented the UIKit iOS application
- Delivered a beta with authorization, KYC, gold balances, price charts, and buy/sell flows; integrated Stripe and Apple Pay for purchases
- Displayed gold ownership in grams using records managed by the backend
- Integrated customer flows with the backend, which handled blockchain and smart-contract logic

**Technologies:** Swift · UIKit · Combine · MVVM · KYC SDK Integration · Stripe · Apple Pay · REST APIs · Ethereum Transaction Data

### Electus: Web3 consumer wallet

[Electus](https://vil4max.github.io/index.html#milestone-electus)

Electus was a consumer-crypto startup developing a wallet for Ethereum and Bitcoin users. Worked as the primary iOS developer within the startup team. Built the application from scratch, including wallet creation, import, balances, secure storage, and transaction data; contributed to product-flow and smart-contract discussions. Protected wallet creation, import, and balances using Keychain storage, Touch ID, and seed-phrase verification. A third-party Ethereum client supported testnet development and transaction tracking; the app also retrieved Bitcoin balance and network data. Worked with the team to define and test smart-contract behavior and explored transfers using contacts and familiar fiat amounts. Buying, swapping, and a broader software-only portal remained product plans rather than delivered MVP features. Delivered an internal TestFlight MVP with wallet functionality, market information, charts, and a news feed.

- Built the iOS app from scratch as the primary developer and worked with the team on product flows
- Implemented wallet creation, import, and balances with Keychain, Touch ID, and seed-phrase verification
- Displayed assets, balances, market data, and charts
- Integrated an Ethereum testnet client and Bitcoin balance data
- Delivered an internal pre-release build; buying and swapping remained planned features

**Technologies:** Swift · UIKit · Keychain Services · Touch ID · Ethereum Testnet · Transaction Tracking · Smart Contract Integration

### ALERT: law enforcement resilience training

[Amconsoft](https://vil4max.github.io/index.html#milestone-amconsoft)

ALERT provided resilience training for law-enforcement users through guided exercises, audio practice, and reminders. Implemented the iOS application independently as the sole mobile developer. Built restricted access, exercise categories, guided One Way practice, local audio playback controls, and configurable reminder frequency. Audio was stored on the device and supported playback seeking. The application focused on resilience coaching; dispatch and emergency-alert functionality were outside its scope. Completed the application and released it on the App Store with scheduled local reminders.

- Independently built the iOS app and released it on the App Store
- Implemented restricted access, practice categories, and guided One Way exercises
- Added local audio playback and configurable reminder frequency

**Technologies:** UIKit · AVFoundation · Audio Playback · UserNotifications · Local Reminders · App Store Delivery

### Tap4Parking

[Tap4Parking](https://vil4max.github.io/index.html#milestone-tap4parking)

Tap4Parking was a Kyiv startup building a municipal parking app for finding facilities and checking available spaces. Worked independently on the iOS application within the startup. Implemented the map interface, location handling, availability display, and directions to facilities; compared map providers and explored indoor positioning separately. Displayed parking locations and available-space counts, including when approaching a facility. The released application did not include payments or guidance to individual parking spaces. Compared MapKit, Google Maps, and Yandex Maps. Explored indoor positioning with proposed floor-mounted transmitters in a separate prototype/beta; a deployed indoor-navigation system was not completed. Released the parking-search app on the App Store; indoor positioning remained a separate prototype.

- Built and released a parking-search app on the App Store
- Displayed parking availability and directions to a facility
- Compared map providers and explored indoor positioning in a prototype

**Technologies:** Objective-C · UIKit · Google Maps SDK · Core Location · MapKit Evaluation · Parking Availability · Indoor Positioning Prototype

### Green Riding Hood: interactive book

Early career · App Store release

Green Riding Hood was an interactive read-aloud children’s book combining illustrated fairy-tale scenes, activities, and healthy-living themes. Contributed to the book project during early-career commercial iOS work. Worked on the iOS application as a contributor; the book combined animated illustrations and interactive content with read-aloud storytelling. The book combined play and healthy-living themes in illustrated interactive scenes. Its published App Store listing provides the product reference. Contributed to a children’s application that was published on the App Store.

- Worked on a published interactive read-aloud children's book for iOS
- The book featured illustrated, animated fairy-tale scenes and interactive activities

**Technologies:** iOS · Interactive book

[App Store](https://apps.apple.com/us/app/green-riding-hood-read-aloud/id977242839)

### DriveCheckUA

Personal project · App Store release

DriveCheckUA displays regional safety alerts on iPhone and CarPlay. Built independently with coding agents. Architected the client, on-device AI integration, and CarPlay UI. Swift code classifies alert status before the model receives supplied facts. The AI integration checks model availability, limits generation time, handles cancellation, validates output, and falls back deterministically when needed. Separately built a bounded Swift agent/tool runtime with a 38-case scripted evaluation corpus and documented real-device validation. Checks cover tool selection, execution budgets, malformed results, cancellation, deadlines, and fallback behavior. This runtime is separate from the released country-summary feature. Released on the App Store; evaluated a bounded Swift agent runtime.

- Built and released the CarPlay and iPhone app with coding agents
- Integrated an on-device Foundation Models summary with validation and fallback
- Built a separate bounded agent/tool runtime with an evaluation corpus and device checks

**Technologies:** SwiftUI · Swift Concurrency · CarPlay · Core Location · MapKit · URLSession · Apple Foundation Models · Structured Outputs · Tool Calling · Cancellation · Evaluation Corpus · Swift Testing

[App Store](https://apps.apple.com/app/id6793023910) · [Source code](https://github.com/vil4max/regional-check)

### OneCart Family

Personal project · App Store release

OneCart Family is a family shopping app with shared iCloud lists. Built independently with coding agents. Led architecture, data synchronization, and release verification. Core Data uses private and shared CloudKit stores with CKShare invitations. Edits persist locally before cloud propagation. The app handles membership changes, duplicate records, and recovery when cloud account deletion fails. WidgetKit snapshots and App Intents support widget actions. XCTest regression suites cover cart state, sharing, persistence, synchronization errors, and deletion recovery. I reviewed generated changes, investigated defects, and verified releases. Released on the App Store.

- Built and released a shared shopping app with coding agents
- Implemented Core Data and CloudKit persistence, CKShare invitations, and offline edits
- Added widget actions and account-lifecycle flows with regression tests

**Technologies:** Swift · SwiftUI · Swift Concurrency · Core Data · CloudKit · CKShare · WidgetKit · App Intents · XCTest · Offline Persistence · Synchronization Recovery

[App Store](https://apps.apple.com/app/id6793219621) · [Source code](https://github.com/vil4max/OneCart)

## Languages

- Ukrainian - Fluent
- Russian - Native
- English - Upper-Intermediate (B2)
