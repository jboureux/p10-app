# p10-app

## Description du projet

## Architecture Project

![image](https://github.com/user-attachments/assets/56e0a6d7-7808-4125-aaf4-4ff94046c972)

## Modèle conceptuel de données

## Choix techniques

- Apollo GraphQL
- Next.js
- Better-auth
- PostgreSQL

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

Po content