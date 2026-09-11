# Base image with devcontainer support (includes git, sudo, vscode user)
FROM mcr.microsoft.com/devcontainers/base:ubuntu-22.04

# Install any system dependencies you need for your project
# Go and Node.js are added via devcontainer features in devcontainer.json
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*
