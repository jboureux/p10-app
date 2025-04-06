# p10-app

## Description du projet

P10-APP est une application de pronostics multijoueur en ligne centrée sur un pari original : prédire le pilote qui terminera 10e lors d’un Grand Prix de Formule 1. L’application repose sur un modèle en temps réel avec gestion des ligues privées, des scores et des profils utilisateurs.

## Architecture Project

![image](https://github.com/user-attachments/assets/56e0a6d7-7808-4125-aaf4-4ff94046c972)

## Modèle conceptuel de données

## Choix techniques

- Apollo GraphQL
- Next.js
- Better-auth
- PostgreSQL
- NestJS

### Justification Tehcnique 

--> NestJS : 

    – Facile à prendre en main

    – Stack connue par toute l'équipe

    – Structure simple et fiable

    – Environnement TypeScript inclus dans le framework

    - Possède des commandes native CLI afin de générer des controller / services / modules

    – Possède une très bonne documentation.

    – Tests faciles à mettre en place


--> Docker : 

    – Prérequis du minimum PATEL

    – Environnement stable et reproductible peu importe la machine.

    – Compatibilité avec les CI/CD

    – Déploiement simplifié

    – Scalabilité plus simple

    – Rollback facilité en cas de problème en dev / prod

    – Facilité d'utilisation de plusieurs techno simultanément


--> GraphQL : 

    – Précision de la récupération de données

    — Évite de spammer les appels AP.

    – Possibilité de récupérer des informations de plusieurs entités en une seule requête

    – Possibilité de formater les données envoyées comme on le souhaite (évite le tri des données dans le front)

    – Bonne documentation

    – Débugging facilité grâce à plusieurs outils disponibles (GraphQL Playground, Apollo Sandbox…)


--> Better-auth : 

    – Documentation moderne et très complète

    – Gère la double authentification

    – Permet une expérience utilisateur fluide (connexion persistante, auto-refresh de token, redirection) 

    – Facile à intégrer dans un projet

    – Adapté à une API REST comme à GraphQL

    – Compatible avec Docker

    – Permet un grand contrôle sur le trafic (rate-limiting, bruteforce protection)

    – Contient des logs de connexion


## Installation en local

> Prérequis: Avoir docker et git installés sur la machine

1. Cloner le projet
2. Lancer les conteneurs de développement avec la commande `make start/dev`

### Commandes utiles

- Ouvrir un terminal dans le conteneur `serveur`: `make shell/dev/server`
- Accéder aux logs du conteneur `serveur`: `make logs/dev/server`
- Stopper les conteneurs de développement: `make stop/dev`

## Déploiement sur un serveur

> Prérequis: Avoir docker et git installés sur la machine

1. Cloner le projet
2. Lancer les conteneurs de production avec la commande `make start/prod`

### Commandes utiles

- Stopper les conteneurs de production: `make stop/prod`
