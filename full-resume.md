# Max Vilchevskiy

Software Engineer | iOS | AI-Augmented Engineering

Kyiv, Ukraine · Remote

[vil4max@gmail.com](mailto:vil4max@gmail.com) · [Telegram](https://t.me/vil4max) · [LinkedIn](https://www.linkedin.com/in/vil4max/) · [Portfolio](https://vil4max.github.io)

## About

Software engineer with 13 years of commercial experience, from greenfield startups to large consumer products and fintech platforms. I have built and evolved iOS products from initial releases to production scale, including Drinkit and the Umico-to-Birmarket marketplace, where I later designed a reusable multi-host subscription SDK. Recent work also includes a watchOS voice client with an iPhone relay and two released personal apps, DriveCheckUA and OneCart Family.

I bring hands-on experience applying AI-assisted and agentic software-development workflows in shipped products and R&D work across planning, implementation, testing, verification, and code review, while retaining ownership of technical decisions and production quality. In DriveCheckUA, I shipped a Foundation Models summary with structured output, validation, and deterministic fallback. A separate Swift agent/tool runtime is covered by a 38-case evaluation corpus and real-device validation.

I work across greenfield and established codebases, owning technical decisions, integration boundaries, and production quality. I’m open to Software Engineer and Senior Software Engineer roles, especially in iOS products and fintech, where AI-assisted engineering is treated as a disciplined development practice.

## Skills

**iOS & Apple Platforms:** Swift · Objective-C · UIKit · SwiftUI · Foundation · iOS SDK · Xcode · Swift Concurrency · Combine · Auto Layout · URLSession · REST APIs · WebSockets · Core Data · Keychain Services · StoreKit 2 · watchOS · WatchConnectivity · Realtime Audio Streaming

**Architecture & Delivery:** Swift Package Manager (SPM) · Modular Architecture · MVVM · Clean Architecture · Dependency Injection · Protocol-Oriented Programming · XCTest · Xcode Instruments · Performance Optimization · CI/CD · App Store Connect

**AI Engineering & Development:** Apple Foundation Models · Context Engineering · Agentic Workflows · Tool Calling · Structured Outputs · AI-Assisted Development

## Experience

### Senior iOS Engineer · GlobalLogic

Jan 2026 - Jun 2026

Apple Watch Voice AI. Fixed-term R&D / demo contract · watchOS voice companion

Voice-first watchOS companion for field workers who need their hands free. Internal R&D / demo.

Within the iOS workstream, I owned technical design and implementation for key watchOS client flows while collaborating with the wider R&D team. I built the conversation UI on the Watch and implemented the iPhone relay for live WebSocket and audio under watchOS runtime constraints. Assistant replies also had to become predictable screens and actions on the device, so I implemented that mapping on the client.

- Built watchOS conversation UI and mapped structured AI/backend responses to navigation, application state, warnings, and UI actions.
- Implemented the iPhone relay for real-time WebSocket and audio communication under watchOS runtime constraints for the delivered R&D demo.
- Owned the technical design and implementation of key watchOS client flows, making architecture decisions within a collaborative R&D team.
- Subsequently participated in an internal evaluation of AI-assisted iOS delivery, creating scenarios and reviewing implementation defects, corrections, and regressions.

**Technologies:** watchOS · WatchConnectivity · URLSessionWebSocketTask · AVFoundation

[Project details](https://vil4max.github.io/projects.html#project-watch-ai-assistant)

### Senior iOS Engineer · PASHA Holding

Apr 2022 - Jan 2026

Birmarket. Production marketplace and loyalty · 20+ iOS engineers · 50+ mobile team

Primary iOS work on Premium Subscription during the Umico to Birmarket marketplace expansion in Azerbaijan.

I joined Umico in 2022 during its startup stage and delivered marketplace features as it grew into Birmarket, a major e-commerce marketplace, by 2025. In the final phase, I extracted and rebuilt Premium Subscription for integration across multiple host apps. The product context is documented on Birmarket's public site.

Premium Subscription began as part of Birmarket. I rebuilt it as a separate Swift Package so Birbank and M10 could integrate the same SDK. The host apps kept authentication and token refresh, while the SDK received a scoped access token and handled its own networking. I worked on modularizing the larger Birmarket codebase and diagnosed production memory leaks, retain cycles, and UI hangs with Xcode Instruments.

- Joined Umico during its earlier marketplace stage and delivered marketplace features across ordering, delivery, and later loyalty as the platform evolved into Birmarket.
- Designed and rebuilt Premium Subscription as a configurable multi-host SDK for integration into Birmarket, Birbank, and M10, taking primary iOS responsibility for the feature.
- Independently decomposed the Premium Subscription migration and formed its implementation backlog, then coordinated host/SDK API boundaries with backend and other teams.
- Onboarded a new iOS engineer, coordinated feature allocation between engineers, and took part in mandatory code reviews.

**Technologies:** SwiftUI · Clean Architecture · Swift Package Manager (SPM) · Multi-host SDK · Xcode Instruments

[Project details](https://vil4max.github.io/projects.html#project-birmarket)

### iOS Engineer · Drinkit

Feb 2020 - Feb 2022

Drinkit. Digital-first coffee chain · greenfield launch to product scale-up

Joined the early team that launched Drinkit with its first physical coffee shop and built the production iOS app from scratch.

Over two years, I developed the digital-to-physical product journey, performed substantial implementation work on drink customization, and integrated contextual offers with the backend deciding the final offer. Drinkit has since grown into an international digital coffee chain; its official site lists 215+ coffee shops across five countries.

- Built and launched the greenfield Drinkit iOS app as one of three iOS engineers, then continued developing it as the product evolved from its first coffee shop into a broader digital coffee-chain experience.
- Implemented substantial parts of drink customization throughout the product’s evolution.
- Integrated contextual offers into the ordering flow, connecting client presentation with backend-driven customer and product context.

**Technologies:** UIKit · Combine

[Project details](https://vil4max.github.io/projects.html#project-drinkit)

### iOS Developer · SOLVVE

Jan 2019 - Feb 2020

PLAYHERA. Esports tournaments · production App Store client

Joined a live App Store esports client and shipped production work in the tournament-management area.

I worked in the tournament-management area of a live esports product covering teams, players, schedules, matches, and results. I adapted to RxSwift feature flows inside an existing UIKit codebase and review process.

- Implemented tournament-management and profile/settings functionality in an existing production UIKit application using RxSwift and established team conventions.
- Worked in the tournament-management area of a live esports product with teams, players, schedules, matches, and results.

**Technologies:** Swift · UIKit · RxSwift

[Project details](https://vil4max.github.io/projects.html#project-playhera)

### iOS Developer · Electus

Jul 2018 - Nov 2018

Electus. Greenfield Web3 wallet startup · primary iOS contributor

Primary iOS contributor on a greenfield Web3 consumer wallet when the mobile product did not exist yet.

When I joined Electus, there was no iOS app yet. I became the primary iOS contributor and built wallet creation, import, and balance flows with Keychain storage, Touch ID, and seed-phrase verification. The app used a third-party Ethereum client for testnet work and also displayed Bitcoin balances. I also worked with the team on making wallet flows understandable to people who did not know much about blockchain.

- Built wallet creation/import, balances, asset visibility, and market-data charts as the primary iOS contributor to a greenfield consumer wallet.
- Implemented Keychain-backed storage, Touch ID protection, and seed-phrase verification; integrated Ethereum testnet transaction tracking and Bitcoin balance/network data.

**Technologies:** Swift · UIKit · Keychain Services · Biometric Authentication (Touch ID) · Web3 · Ethereum

[Project details](https://vil4max.github.io/projects.html#project-electus)

### iOS Developer · GBKSoft

Jun 2017 - Jun 2018

Outsourcing delivery · BLE R&D · Clovis · Eastern Union

First full-time office iOS role: client products, hardware R&D, and maintenance.

I built CoreBluetooth flows for a BLE beacon/tracker prototype and turned noisy Bluetooth state into something a user could understand. I also shipped work on Clovis, a US wellness storefront, and maintained Eastern Union, an existing real-estate client app.

- End-to-end BLE / CoreBluetooth work on a hardware prototype
- Clovis App Store storefront for a US wellness client
- Maintenance on Eastern Union, a live CRE app

[Project details](https://vil4max.github.io/projects.html#project-eastern-union)

### iOS Developer · Amconsoft

Nov 2015 - Jun 2017

Client iOS stream · AcuCharting · FlipTaxi · ALERT

Independent client iOS work from supplied design and behavior specs.

I built AcuCharting, an iPad charting notebook with SceneKit body models and Core Data. Other client work included a taxi maps MVP and ALERT, an access-gated resilience coaching app with audio practice.

- SceneKit + Core Data iPad product on AcuCharting
- Maps and location work on a taxi MVP
- ALERT coaching client from supplied flow, design, and audio

[Project details](https://vil4max.github.io/projects.html#project-alert)

### iOS Developer · Tap4Parking

Nov 2014 - Nov 2015

Digital parking · map-first startup

Primary iOS implementer on a map-first parking product for about a year.

I built the map as the main screen on Google Maps SDK: parking locations, user location, routes, and multi-storey floor plans with red/green occupancy. Location behavior was a core product concern.

- Map-first parking client on Google Maps SDK
- Multi-storey occupancy plans and route-to-parking flows
- Location behavior as a product constraint

[Project details](https://vil4max.github.io/projects.html#project-tap4parking)

### Junior iOS Developer · iCenter

Dec 2013 - Nov 2014

AlphaSMS · bulk SMS client

First iOS role: a greenfield bulk SMS client built from design and product behavior.

I implemented AlphaSMS end to end - UI, navigation, and API - and shipped it to the App Store. Later I built an internal news-digest feed for the company.

- Greenfield AlphaSMS App Store delivery
- End-to-end client work: UI, navigation, and API
- Internal news-digest feed for company showcase

## Selected projects

### Apple Watch Voice AI (R&D / demo)

[GlobalLogic](https://vil4max.github.io/index.html#milestone-globallogic)

I built the watchOS conversation UI and implemented the iPhone relay for live audio and WebSocket traffic under watchOS runtime constraints. The product was a voice companion for field workers who often had their hands occupied.

The assistant returned structured replies that the client turned into screens and actions on the Watch. I implemented that mapping and also designed a custom emergency flow. After the client engagement, I participated in an internal evaluation of AI-assisted iOS delivery workflows.

- Custom emergency flow on watchOS
- Voice conversation UI plus iPhone relay for WebSocket and realtime audio
- Structured AI command flows driving on-device UI actions
- Work Point maps, hazards, and navigation on the watch/phone pair

**Technologies:** WatchKit · WatchConnectivity · URLSessionWebSocketTask · AVFoundation

### Birmarket: Marketplace & Loyalty

[PASHA Holding](https://vil4max.github.io/index.html#milestone-pasha)

I joined Umico in 2022 during its startup stage and delivered marketplace features as it grew into Birmarket, a major e-commerce marketplace, by 2025. In the final phase, I extracted and rebuilt Premium Subscription for integration across multiple host apps. [Birmarket product context](https://bir.az/en/news/bir-ecosystem-strengthens-its-position-with-birmarket-the-countrys-largest-e-commerce-platform).

Birmarket, Birbank, and M10 integrated the same remote Swift Package. Each host kept its own authentication, session, and token refresh. It passed a scoped access token through a small public API, while the SDK handled its own networking. I also worked on the shared analytics layer and broader modularization of the larger UIKit codebase (~20+ iOS, ~50+ mobile).

- Reimplemented Premium Subscription as a configurable multi-host SPM SDK
- Defined host/SDK API boundaries with backend and platform teams
- Diagnosed memory leaks, retain cycles, and UI hangs in production using Xcode Instruments
- Worked on modularizing a large production iOS codebase

**Technologies:** UIKit · SwiftUI · SPM · Clean Architecture · PostHog · Multi-host SDK

### Drinkit: Coffee Ordering App

[Drinkit](https://vil4max.github.io/index.html#milestone-drinkit)

I joined Drinkit while the team was opening its first physical coffee shop. There were three iOS engineers, and we built the production app from an empty codebase and released it on the App Store.

I stayed for two years as the product grew beyond a simple menu of ready drinks. I implemented substantial parts of drink customization, where options depended on each other and on shop availability. I also integrated contextual offers, with the backend choosing the final offer, and worked on order status updates delivered through polling.

- First-coffee-shop launch with a three-engineer iOS team; App Store release during the engagement
- Two years of product evolution across the digital and physical customer journey
- Substantial implementation work on drink customization as a core evolving product surface
- Contextual offers with a shared client/backend data flow
- Order prep status on iOS via backend polling

**Technologies:** UIKit · URLSession · REST

### PLAYHERA: esports tournaments

[SOLVVE](https://vil4max.github.io/index.html#milestone-solvve)

I joined a live App Store esports client and shipped production work in the tournament-management area of a product with teams, players, schedules, matches, and results.

I adapted to RxSwift feature flows inside the existing UIKit codebase and review process.

- Production work in a live App Store esports client
- Tournament-management area in an established architecture
- RxSwift feature work in a maintained UIKit codebase

**Technologies:** Swift · UIKit · RxSwift

### FinTech R&D

Part-time project · Client-delivered beta

This was a fintech R&D project built around ownership records for physical gold measured in grams. I was the primary iOS engineer. The backend owned the Ethereum and smart-contract logic; the app used its middleware API and handled the customer-facing flows.

I completed a demo-ready purchase flow with third-party KYC, Stripe, and Apple Pay. The app also covered authorization, the customer's gold balance and portfolio, price charts, and sell flows. The system recorded the resulting ownership state in grams. For transaction information, the iOS client could query public Ethereum APIs, but purchases and other business operations still went through the backend. I later handed the project over to a second iOS engineer.

- Implemented the UIKit iOS application
- Demo-ready beta: auth, KYC, gold balance, price chart, Stripe buy, Apple Pay, sell
- Gram-denominated ownership records tracked by the backend system
- Clear boundary: backend owned chain logic; iOS owned the customer experience

**Technologies:** Swift · UIKit · Stripe · Apple Pay · REST · MVVM

### Electus: Web3 consumer wallet

[Electus](https://vil4max.github.io/index.html#milestone-electus)

When I joined Electus, there was no iOS app yet. I became the primary iOS contributor. The larger idea was a consumer crypto product, but the first working version concentrated on the wallet, with Ethereum and Bitcoin as its main assets.

I built wallet creation, import, and balance flows with Keychain storage, Touch ID, and seed-phrase verification. The app showed assets, market data, and simple charts. It used a third-party Ethereum client for testnet development and transaction tracking, and it could retrieve Bitcoin balance and network data. I also worked with the team on making transfers easier to understand through contacts and fiat amounts. Those ideas were still in development; swap and buy remained roadmap concepts.

- Primary iOS ownership from a clean codebase with real product input
- Wallet create/import/balance with Keychain, Touch ID, and seed-phrase verification
- Asset/balance visibility with market data and charts
- Ethereum testnet client integration plus Bitcoin balance display
- Reached an internal pre-release build; swap and buy stayed unimplemented roadmap concepts

**Technologies:** Swift · UIKit · Keychain · Touch ID · Ethereum testnet

### DriveCheckUA

Pet project

DriveCheckUA is a small CarPlay utility I shipped for drivers: glance regional alert status for the current location without picking up the phone. One screen, one region, one refresh. The iPhone companion adds a country overview with an on-device Apple Foundation Models summary and deterministic fallback, in English, Russian, and Ukrainian.

Informational status only.

Separate engineering work includes a bounded Swift agent/tool runtime, a 38-case scripted evaluation corpus, and Foundation Models device validation. This runtime is distinct from the released country summary.

- CarPlay template for a single regional status read
- iPhone companion with Core Location / MapKit region context
- Localized in English, Russian, and Ukrainian

**Technologies:** SwiftUI · CarPlay · Core Location · MapKit · URLSession · Apple Foundation Models

[App Store](https://apps.apple.com/app/id6793023910) · [Source code](https://github.com/vil4max/regional-check)

### OneCart Family

Pet project

OneCart Family is a shared family shopping cart built collaboratively. We developed and released it with AI-assisted engineering, SwiftUI, and live CloudKit sync: add what the household needs, check items off in the trolley, and keep purchase history in one place.

- Collaborative project we use at home
- Shared family cart with trolley checkoffs and purchase history
- Live sync via iCloud / CloudKit and Sign in with Apple

**Technologies:** SwiftUI · Core Data · CloudKit · Sign in with Apple

[App Store](https://apps.apple.com/app/id6793219621) · [Source code](https://github.com/vil4max/OneCart)

## Languages

- Ukrainian - Native
- Russian - Native
- English - Upper-Intermediate (B2)
