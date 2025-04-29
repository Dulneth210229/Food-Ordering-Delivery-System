# 🍔 Cloud-Native Food Ordering & Delivery System

A distributed, scalable food ordering and delivery platform inspired by UberEats and PickMe Food, developed using the **MERN stack** with a **microservices architecture**, containerized using **Docker**, and orchestrated via **Kubernetes**.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Microservices Architecture](#microservices-architecture)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Running with Docker](#running-with-docker)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Team Members](#team-members)

---

## 📦 Project Overview

This project implements a food delivery platform with the following capabilities:

- Customer login, registration, order placement
- Restaurant menu and order management
- Delivery tracking and assignment
- Secure online payments
- Notifications via email/SMS

---

## ✨ Features

✅ Role-based access: Customers, Restaurant Admins, Delivery Personnel  
✅ Real-time order placement and tracking  
✅ RESTful API with Microservice architecture  
✅ Email/SMS notifications  
✅ Containerized with Docker  
✅ Scalable deployment with Kubernetes

---

## 🧰 Technology Stack

### Frontend

- React.js (with Axios & React Router)

### Backend (per service)

- Node.js
- Express.js
- MongoDB / PostgreSQL
- JWT for authentication

### Infrastructure

- Docker
- Docker Compose
- Kubernetes (Minikube for local)
- API Gateway (Express with http-proxy-middleware)

---

## 🧱 Microservices Architecture

| Service                | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `user-service`         | Handles user registration, login, JWT auth     |
| `restaurant-service`   | Menu management, restaurant data, availability |
| `order-service`        | Order placement, order status                  |
| `payment-service`      | Integrates PayHere/FriMi/Stripe for payments   |
| `delivery-service`     | Assigns deliveries, tracks status              |
| `notification-service` | Sends order confirmations, SMS/email alerts    |
| `api-gateway`          | Routes requests to appropriate microservices   |

Each service runs independently, communicates via REST, and is containerized.

---

## 📁 Folder Structure

---

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- Docker & Docker Compose
- MongoDB & PostgreSQL (local or cloud)
- Minikube (optional, for K8s deployment)

### 1. Clone the Repo

```bash
git clone https://github.com/<your-team>/food-delivery-system.git
cd food-delivery-system
```
