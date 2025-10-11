# ---- Stage 1: Builder ----
FROM debian:trixie AS builder

# Install core dependencies (including unzip required by Bun)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        bash \
        ca-certificates \
        curl \
        git \
        passwd \
        python3 \
        python3-pip \
        python3-venv \
        python3-certifi \
        python3-urllib3 \
        sudo \
        zsh \
        file \
        tree \
        unzip \
        build-essential \
    && rm -rf /var/lib/apt/lists/* \
    && update-ca-certificates

# Create non-root "node" user
RUN useradd -ms /bin/zsh node \
    && echo "node ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER node
ENV HOME=/home/node
WORKDIR /home/node

# Install Bun in node's home
RUN curl -fsSL https://bun.sh/install | bash
ENV BUN_INSTALL_DIR=/home/node/.bun
ENV PATH="${BUN_INSTALL_DIR}/bin:${PATH}"

# Verify Bun
RUN bun --version

# Install Oh-My-Zsh + plugins
ENV ZSH_CUSTOM=/home/node/.oh-my-zsh/custom
RUN git clone --depth=1 https://github.com/ohmyzsh/ohmyzsh.git ~/.oh-my-zsh \
    && git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM}/themes/powerlevel10k \
    && git clone --depth=1 https://github.com/zsh-users/zsh-autosuggestions.git ${ZSH_CUSTOM}/plugins/zsh-autosuggestions \
    && git clone --depth=1 https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM}/plugins/zsh-syntax-highlighting \
    && cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc \
    && sed -i 's/^ZSH_THEME=.*/ZSH_THEME="powerlevel10k\/powerlevel10k"/' ~/.zshrc \
    && sed -i 's/^plugins=(git)/plugins=(git zsh-autosuggestions zsh-syntax-highlighting)/' ~/.zshrc \
    && echo 'source ~/.p10k.zsh' >> ~/.zshrc \
    && echo 'export ZSH_DISABLE_COMPFIX=true' >> ~/.zshrc

# Python virtual environment
RUN python3 -m venv /home/node/venv \
    && /home/node/venv/bin/pip install --upgrade pip certifi urllib3
ENV PATH="/home/node/venv/bin:/home/node/.local/bin:${BUN_INSTALL_DIR}/bin:${PATH}"

# Install rokit
RUN curl --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/rojo-rbx/rokit/main/scripts/install.sh | bash
ENV PATH="/home/node/.rokit/bin:${PATH}"

# Copy project files & install Node dependencies with Bun
WORKDIR /workspace
COPY --chown=node:node package.json bun.lockb* ./
RUN bun install

COPY --chown=node:node rokit.toml ./
RUN rokit install --no-trust-check

# Copy the rest of the project
COPY --chown=node:node . .
RUN find scripts/shell -name "*.sh" -type f -exec chmod +x {} \; || true


# ---- Stage 2: Runtime ----
FROM debian:trixie-slim AS runtime

# Base runtime dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        bash \
        ca-certificates \
        curl \
        git \
        passwd \
        python3 \
        python3-pip \
        python3-venv \
        python3-certifi \
        python3-urllib3 \
        sudo \
        zsh \
        file \
        tree \
        unzip \
    && rm -rf /var/lib/apt/lists/* \
    && update-ca-certificates

# Create node user
RUN useradd -ms /bin/zsh node \
    && echo "node ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Copy Bun from builder
COPY --from=builder --chown=node:node /home/node/.bun /home/node/.bun
ENV BUN_INSTALL_DIR=/home/node/.bun
ENV PATH="${BUN_INSTALL_DIR}/bin:${PATH}"

# Copy Python venv & Zsh setup from builder
COPY --from=builder --chown=node:node /home/node/venv /home/node/venv
COPY --from=builder --chown=node:node /home/node/.oh-my-zsh /home/node/.oh-my-zsh
COPY --from=builder --chown=node:node /home/node/.zshrc /home/node/.zshrc

USER node
ENV HOME=/home/node
ENV PATH="/home/node/venv/bin:/home/node/.local/bin:${BUN_INSTALL_DIR}/bin:${PATH}"
ENV ZSH_CUSTOM=/home/node/.oh-my-zsh/custom
WORKDIR /home/node

# Optional Powerlevel10k config
COPY --chown=node:node .devcontainer/configuration/.p10k.zsh /home/node/.p10k.zsh

# Copy rokit and workspace
COPY --from=builder --chown=node:node /home/node/.rokit /home/node/.rokit
COPY --from=builder --chown=node:node /workspace /workspace

WORKDIR /workspace
ENV PATH="/home/node/.rokit/bin:/workspace/node_modules/.bin:${BUN_INSTALL_DIR}/bin:/home/node/venv/bin:/home/node/.local/bin:${PATH}"
ENV NODE_ENV=development

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD [ "bash", "-lc", "bun --version >/dev/null 2>&1" ]

ENTRYPOINT ["/workspace/scripts/shell/docker-entrypoint.sh"]
CMD ["zsh"]
