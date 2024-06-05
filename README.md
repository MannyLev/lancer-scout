# Welcome to Lancer Scout

Lancer Scout is a custom scouting suite developed by Team 321 The RoboLancers.

Lancer Scout was built with several criteria in mind:

 - Fully offline experience for competitions

 - Quick data transfer for real time usage

 - Highly customizable scouting forms

 - Minimalist data analytics and visualization

 - Easy transitions between tournaments

## Table of Contents

 - [How It Works (Overview)](#how-it-works-(overview))

 - [Documentation](#documentation)

 - [Notes For Programmers](#notes-for-programmers)

## How It Works (Overview)

The scouting process starts from the **Lancer Scout Dashboard**. The dashboard has several pages that control the flow of the scouting operation:

 - **The Tournament Page** is for creating and managing different tournaments. Using different tournaments allows for easy data separation across events.

 - **The Schema Page** is for designing the forms that scouts will use. Each *schema* (scouting form) can be built with the editor on this page to avoid the need to do this programmatically. It includes basic presets for a match scouting form and a pit scouting form which can then be modified.

 - **The Upload Page** is for transferring scout data from individual scouters to the main scouting dashboard. Scouts will upload each scouting report via QR Code which the upload page will read and integrate with its database for the current tournament.

 - **The Data Page** is for analyzing the current tournament. There are several tabs within the data page to view pit scouts, team overviews, individual performances of a team, compare teams, and rank teams.

The dashboard is used for managing the scouting operation, so most scouts will only be using the **[Lancer Scout Client](https://lancer-scout-321.vercel.app/)** to collect and later trasfer data.

Lancer Scout Client is a mobile-friendly offline website. Using PWA features, the website will save itself to your device after you enter for the first time on WiFi.

Scouts will upload the schemas created on the dashboard via URL which will allow them to scout using the specific form you created. It is important to make sure scouts are using the right schema across different tournaments or you will run into compatability issues when trying to transfer data.

After they have collected a sufficient amount of data at an event, have the scouts return back to the management team and transfer their data so it can be analyzed on the dashboard.

## Documentation

TODO:

 - installation/script/docker

 - explain each page on dashboard

 - explain each page on client

 - best practices

## Notes For Programmers

TODO

 - language and framework choices

 - repo organization and code structure

 - known issues

 - contributions and future considerations