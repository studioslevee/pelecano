# Pellicano Source Structure

This file documents the raw source package and the site-owned paths used by the build.

## Primary Source Files

- `2025 Project Resumes.pdf`
- `Copy/2026-03-24-Pellicano-Website-Copy-Overview.pdf`
- `Copy/2026-03-24-Current-Pellicano-Portfolio-Descriptions.pdf`

## Raw Asset Folders

- `Photography/Portfolio/<Category>/<Project Name>/...`
- `Photography/About Us/Team Photography/...`
- `Video/...`
- `Logos/...`
- `Client Logos/...`

## Site-Owned Media Targets

Decap now uses a single flat editable media root:

- `public/media/uploads/<asset>`

Current naming conventions inside that flat root:

- project assets: `<project-slug>__<original-filename>`
- team assets: `team__<original-filename>`
- video assets: `video__<original-filename>`
- logo assets: `logo__<original-filename>`

This flat layout is intentional so Decap's built-in `image` and `file` widgets
can browse the editable media area more reliably.

## Reference Copies

The non-runtime source materials are also copied into `references/` for easy review:

- `references/2025 Project Resumes.pdf`
- `references/Copy/...`
- `references/Logos/...`
- `references/Client Logos/...`
- `references/Color Font/...`
- `references/Video/...`

## Project Folder To Slug Map

- `Photography/Portfolio/Automotive/BMW of Albany` -> `bmw-of-albany`
- `Photography/Portfolio/Automotive/Butler Audi South Atlanta` -> `butler-audi-south-atlanta`
- `Photography/Portfolio/Automotive/Butler Ford Milledgeville` -> `butler-ford-milledgeville`
- `Photography/Portfolio/Corporate Office/Fleming and Riles` -> `fleming-and-riles`
- `Photography/Portfolio/Corporate Office/Synovus Bank` -> `synovus-bank`
- `Photography/Portfolio/Entertainment & Restaurants/Biancas` -> `biancas`
- `Photography/Portfolio/Entertainment & Restaurants/Bowl-and-Barrel` -> `bowl-and-barrel`
- `Photography/Portfolio/Entertainment & Restaurants/The-General-Public` -> `the-general-public`
- `Photography/Portfolio/Entertainment & Restaurants/Tin-Lizzys-Multiple-Locations` -> `tin-lizzys-multiple-locations`
- `Photography/Portfolio/Faith Based/Christ Community Church` -> `christ-community-church`
- `Photography/Portfolio/Faith Based/First Baptist Mount Juliette` -> `mount-juliet-first-baptist-church`
- `Photography/Portfolio/Faith Based/Free Chapel` -> `free-chapel`
- `Photography/Portfolio/Faith Based/Victory World Church` -> `victory-world-church`
- `Photography/Portfolio/Healthcare/Harrington Park Health & Rehabilitation` -> `harrington-park-health-and-rehabilitation`
- `Photography/Portfolio/Healthcare/Linear Accelerator Replacement` -> `linear-accelerator-replacement`
- `Photography/Portfolio/Healthcare/Phoebe 7th Floor Covid ICU` -> `phoebe-7th-floor-covid-icu`
- `Photography/Portfolio/Healthcare/Phoebe Hybrid OR 8` -> `phoebe-hybrid-or-8`
- `Photography/Portfolio/Healthcare/Phoebe Simulation Lab` -> `phoebe-simulation-lab`
- `Photography/Portfolio/Healthcare/Piedmont Athens Brain & Spine` -> `piedmont-athens-brain-and-spine`
- `Photography/Portfolio/Hospitality/Flaggstone Student Housing` -> `flaggstone-student-housing`
- `Photography/Portfolio/Hospitality/Fort Valley State University Dining Hall` -> `fort-valley-state-university-dining-hall`
- `Photography/Portfolio/Hospitality/Sleep Inn & Suites` -> `sleep-inn-and-suites`
- `Photography/Portfolio/Industrial/Flint Power Equipment` -> `flint-power-equipment`
- `Photography/Portfolio/Industrial/Schnitzer Steel Facility` -> `schnitzer-steel-facility`
- `Photography/Portfolio/Industrial/Shubee` -> `shubee`
- `Photography/Portfolio/Retail/Retail Projects` -> `retail-projects`

## Team Source Map

- `01 Tony-Pellicano.JPG` -> `tony-pellicano`
- `02 Stephen-Dew.JPG` -> `stephen-dew`
- `03 Robert Newberry.jpg` -> `robert-newberry`
- `04 Michael Garrison.jpg` -> `michael-garrison`
- `05 John Wagnon.jpg` -> `john-wagnon`
- `06 Pat Etheridge, CHC.JPG` -> `pat-etheridge`
- `07 Trish Russell.JPG` -> `trish-russell`
- `08 Merideth Holland.jpg` -> `merideth-holland`

## Known Source Mismatches

- `Phoebe 7th Floor Covid ICU` currently contains files named like `Phoebe-Hybrid-OR-8-*`.
- `Harrington Park Health & Rehabilitation` contains a square image named like `Linear-Accelerator-Replacement-*`.
- The site uses normalized public-facing titles while the local folders preserve the raw source naming.
