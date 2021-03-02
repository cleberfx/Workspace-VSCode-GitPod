FROM gitpod/workspace-full

USER root

# Install custom tools, runtime, etc. using apt-get
# For example, the command below would install "bastet" - a command line tetris clone:
#
RUN apt-get update && apt-get install -y \
  sudo \
  git-flow \
  graphviz \
  iptables \
  && apt-get clean && rm -rf /var/cache/apt/* && rm -rf /var/lib/apt/lists/* && rm -rf /tmp/*
  
RUN iptables -A INPUT -p tcp --dport 4000 -j ACCEPT
RUN iptables -A INPUT -p tcp --dport 22 -j ACCEPT

USER gitpod  

RUN  curl -fsSL https://code-server.dev/install.sh | sh -s -- --dry-run 
RUN  curl -fsSL https://code-server.dev/install.sh | sh 
RUN  curl https://cli-assets.heroku.com/install-ubuntu.sh | sh

RUN bash -c "npm install -g generator-jhipster \
    && npm install -g generator-jhipster-nodejs \
	&& npm install -g @angular/cli" 

# More information: https://www.gitpod.io/docs/config-docker/
